import type { ToolDefinition } from '@canva-ct/genai';
import { CanvaAIBaseService } from './canva-ai-base';
import { getDocsTools } from './docs-tools';
import { buildDocsSystemPrompt } from './docs-prompt';
import type { AIServiceCallbacks, AIHistoryEntry, NotifyParams } from './types';
import {
  markdownToBlocks,
  updateBlockMarkdown,
  updateBlockType,
  addBlock,
  deleteBlock,
  blocks,
} from '@/store/signals/documentState';
import type { BlockType } from '@/store/signals/documentState';
import {
  addMessageToThread,
  startThreadStreaming,
  appendThreadStreamingContent,
  setThreadDesigning,
  setThreadDesigningMessage,
  endThreadStreaming,
  initDesignProgress,
  addDesignAction,
  completeDesignAction,
  finalizeDesignProgress,
  getToolDisplayName,
  getThreadRequestState,
} from '@/store/signals/chat';
import type { ChatMessage } from '@/store/signals/chat';
import { isDocsAIChange, currentDocsAIMetadata } from '@/store/signals/docsHistory';
import {
  startStreamingSession,
  appendToStreamingSession,
  cancelStreamingSession,
} from '@/store/signals/docsStreaming';

const THREAD_ID = 'docs';

/**
 * Docs AI Service
 * Handles AI-powered document editing with block-level tools
 */
export class DocsAIService extends CanvaAIBaseService {
  private _requestId: string = '';
  private _userPrompt: string = '';

  /**
   * Cancel the current in-flight request (client-side only).
   */
  public cancelRequest(): void {
    const threadState = getThreadRequestState(THREAD_ID);
    const requestId = threadState.currentRequestId;
    if (!requestId || !threadState.isStreaming) return;

    this.cancelCurrentRequest(requestId);
    cancelStreamingSession();
    endThreadStreaming(THREAD_ID);
    addMessageToThread('Request cancelled.', 'assistant', THREAD_ID);
    isDocsAIChange.value = false;
    currentDocsAIMetadata.value = null;
  }

  protected getTools(): ToolDefinition[] {
    return getDocsTools();
  }

  private _selectedContext?: { blockId: string; selectedText: string };

  protected getSystemPrompt(): string {
    // Rebuild every call to get fresh block state
    return buildDocsSystemPrompt(this._selectedContext);
  }

  protected getModelConfig() {
    return {
      model: 'anthropic/claude-opus-4.5:online',
      temperature: 0.7,
      maxTokens: 4096,
    };
  }

  /**
   * Process a user request for document editing.
   * Mirrors CanvaAIService.processRequest pattern with debounced completion.
   */
  async processRequest(
    userPrompt: string,
    callbacks: AIServiceCallbacks,
    history?: AIHistoryEntry[],
    selectedContext?: { blockId: string; selectedText: string },
  ): Promise<string> {
    const requestId = `docs_${Date.now()}`;
    this._requestId = requestId;
    this._userPrompt = userPrompt;
    this._selectedContext = selectedContext;

    // Start thread streaming
    startThreadStreaming(THREAD_ID, requestId);
    initDesignProgress(THREAD_ID);

    // Guard to prevent double completion
    let completionHandled = false;
    let toolsInProgress = 0;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;
    let accumulatedContent = '';
    let toolsHaveExecuted = false;

    const doComplete = () => {
      if (completionHandled || this.isRequestCancelled(requestId)) return;
      completionHandled = true;

      if (completionTimer) {
        clearTimeout(completionTimer);
        completionTimer = null;
      }

      // Finalize design progress and build summary before ending streaming
      finalizeDesignProgress(THREAD_ID);
      const progressState = getThreadRequestState(THREAD_ID).designProgress;
      let designSummary: ChatMessage['designSummary'] | undefined;
      if (progressState && progressState.actions.length > 0) {
        const durationSeconds = Math.round(
          ((progressState.requestEndTime ?? Date.now()) - progressState.requestStartTime) / 1000,
        );
        designSummary = {
          durationSeconds,
          actionCount: progressState.actions.length,
          actions: progressState.actions.map(a => ({
            displayName: a.displayName,
            toolName: a.toolName,
          })),
        };
      }

      // End streaming BEFORE adding message
      endThreadStreaming(THREAD_ID);

      const messageContent = accumulatedContent.trim() || 'Done!';
      addMessageToThread(messageContent, 'assistant', THREAD_ID, {
        requestId,
        designSummary,
      });

      callbacks.onComplete?.(requestId);
    };

    const wrappedCallbacks: AIServiceCallbacks = {
      onStream: content => {
        if (completionHandled || this.isRequestCancelled(requestId)) return;
        // Separate pre-tool and post-tool text with a newline
        if (toolsHaveExecuted && accumulatedContent.length > 0) {
          accumulatedContent += '\n\n';
          appendThreadStreamingContent(THREAD_ID, '\n\n');
          toolsHaveExecuted = false;
        }
        accumulatedContent += content;
        appendThreadStreamingContent(THREAD_ID, content);
        callbacks.onStream?.(content);
      },
      onNotification: message => {
        callbacks.onNotification?.(message);
      },
      onModelEnd: () => {
        callbacks.onModelEnd?.();
      },
      onToolStart: toolName => {
        if (this.isRequestCancelled(requestId)) return;
        toolsInProgress++;
        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }
        setThreadDesigning(THREAD_ID, true);
        if (toolName !== 'notify') {
          addDesignAction(THREAD_ID, toolName, getToolDisplayName(toolName, 'active'));
        }
        callbacks.onToolStart?.(toolName);
      },
      onToolEnd: (toolName, result) => {
        if (this.isRequestCancelled(requestId)) return;
        this.executeTool(toolName, result as Record<string, unknown>);
        if (toolName !== 'notify') {
          completeDesignAction(THREAD_ID, toolName);
        }
        toolsInProgress--;
        if (toolsInProgress === 0) {
          setThreadDesigning(THREAD_ID, false);
          toolsHaveExecuted = true;
        }
        callbacks.onToolEnd?.(toolName, result);
      },
      onComplete: () => {
        if (this.isRequestCancelled(requestId)) return;
        if (completionTimer) {
          clearTimeout(completionTimer);
        }
        if (toolsInProgress > 0) {
          return;
        }
        completionTimer = setTimeout(doComplete, 50);
      },
      onError: error => {
        if (completionHandled || this.isRequestCancelled(requestId)) return;
        completionHandled = true;

        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }

        addMessageToThread(
          `Sorry, I encountered an error: ${error.message}`,
          'assistant',
          THREAD_ID,
        );

        endThreadStreaming(THREAD_ID, error.message);
        callbacks.onError?.(error);
      },
    };

    try {
      // Build fresh context each call
      const context = {};
      await this.invokeAI(userPrompt, context, wrappedCallbacks, history);
    } catch (error) {
      addMessageToThread(
        `Sorry, I encountered an error: ${(error as Error).message}`,
        'assistant',
        THREAD_ID,
      );
      endThreadStreaming(THREAD_ID, (error as Error).message);
      callbacks.onError?.(error as Error);
    }

    return requestId;
  }

  /**
   * Dispatch tool execution to the appropriate handler
   */
  private executeTool(toolName: string, toolResult: Record<string, unknown>): void {
    const toolData = (toolResult.data as Record<string, unknown>) || toolResult;

    console.log(`[DocsAIService] Executing tool: ${toolName}`, toolData);

    // Set AI change signals so history entries are attributed to AI
    isDocsAIChange.value = true;
    currentDocsAIMetadata.value = {
      requestId: this._requestId,
      toolName,
      userPrompt: this._userPrompt,
    };

    try {
      switch (toolName) {
        case 'notify':
          this.handleNotify(toolData as unknown as NotifyParams);
          break;

        case 'update_document':
          this.handleUpdateDocument(toolData as { markdown: string });
          break;

        case 'update_block':
          this.handleUpdateBlock(
            toolData as { blockId: string; markdown: string; blockType?: BlockType },
          );
          break;

        case 'insert_block':
          this.handleInsertBlock(
            toolData as { afterBlockId: string; markdown: string; blockType?: BlockType },
          );
          break;

        case 'delete_block':
          this.handleDeleteBlock(toolData as { blockId: string });
          break;

        default:
          console.warn(`[DocsAIService] Unknown tool: ${toolName}`);
      }
    } finally {
      isDocsAIChange.value = false;
      currentDocsAIMetadata.value = null;
    }
  }

  private handleNotify(params: NotifyParams): void {
    console.log(`[DocsAI Notification] ${params.message}`);
    setThreadDesigningMessage(THREAD_ID, params.message);
  }

  private handleUpdateDocument(params: { markdown: string }): void {
    try {
      cancelStreamingSession();
      // Capture old content before replacing
      const oldBlocks = blocks.value;
      const oldContentMap = new Map(oldBlocks.map(b => [b.blockId, b.markdown]));
      markdownToBlocks(params.markdown);
      // Queue all blocks for sequential streaming animation
      const allBlocks = blocks.value;
      startStreamingSession(
        this._requestId,
        allBlocks.map(b => ({
          blockId: b.blockId,
          fullContent: b.markdown,
          oldContent: oldContentMap.get(b.blockId),
        })),
      );
      console.log('[DocsAIService] Document updated with new markdown');
    } catch (error) {
      console.error('[DocsAIService] Error updating document:', error);
    }
  }

  private handleUpdateBlock(params: {
    blockId: string;
    markdown: string;
    blockType?: BlockType;
  }): void {
    try {
      // Capture old content before mutating
      const oldBlock = blocks.value.find(b => b.blockId === params.blockId);
      const oldContent = oldBlock?.markdown;
      updateBlockMarkdown(params.blockId, params.markdown);
      if (params.blockType) {
        updateBlockType(params.blockId, params.blockType);
      }
      appendToStreamingSession([
        { blockId: params.blockId, fullContent: params.markdown, oldContent },
      ]);
      console.log(`[DocsAIService] Block ${params.blockId} updated`);
    } catch (error) {
      console.error('[DocsAIService] Error updating block:', error);
    }
  }

  private handleInsertBlock(params: {
    afterBlockId: string;
    markdown: string;
    blockType?: BlockType;
  }): void {
    try {
      const newBlockId = addBlock(params.afterBlockId);
      updateBlockMarkdown(newBlockId, params.markdown);
      if (params.blockType) {
        updateBlockType(newBlockId, params.blockType);
      }
      appendToStreamingSession([{ blockId: newBlockId, fullContent: params.markdown }]);
      console.log(`[DocsAIService] New block ${newBlockId} inserted after ${params.afterBlockId}`);
    } catch (error) {
      console.error('[DocsAIService] Error inserting block:', error);
    }
  }

  private handleDeleteBlock(params: { blockId: string }): void {
    try {
      deleteBlock(params.blockId);
      console.log(`[DocsAIService] Block ${params.blockId} deleted`);
    } catch (error) {
      console.error('[DocsAIService] Error deleting block:', error);
    }
  }
}

// Export singleton instance
export const docsAIService = new DocsAIService();
