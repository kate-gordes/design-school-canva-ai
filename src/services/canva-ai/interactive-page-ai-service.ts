import type { ToolDefinition } from '@canva-ct/genai';
import { CanvaAIBaseService } from './canva-ai-base';
import { getInteractivePageTools } from './interactive-page-tools';
import { buildInteractivePageSystemPrompt } from './interactive-page-prompt';
import type { AIServiceCallbacks, AIHistoryEntry, NotifyParams } from './types';
import { findAndReplaceHtml, setInteractivePageHtml } from '@/store/signals/interactivePageState';
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

const THREAD_ID = 'interactive-page';

/**
 * Interactive Page AI Service
 * Handles AI-powered HTML page editing with find-and-replace and full HTML replacement tools
 */
export class InteractivePageAIService extends CanvaAIBaseService {
  private _requestId: string = '';
  private _userPrompt: string = '';

  public cancelRequest(): void {
    const threadState = getThreadRequestState(THREAD_ID);
    const requestId = threadState.currentRequestId;
    if (!requestId || !threadState.isStreaming) return;

    this.cancelCurrentRequest(requestId);
    endThreadStreaming(THREAD_ID);
    addMessageToThread('Request cancelled.', 'assistant', THREAD_ID);
  }

  protected getTools(): ToolDefinition[] {
    return getInteractivePageTools();
  }

  protected getSystemPrompt(): string {
    return buildInteractivePageSystemPrompt();
  }

  protected getModelConfig() {
    return {
      model: 'anthropic/claude-opus-4.5:online',
      temperature: 0.7,
      maxTokens: 8192,
    };
  }

  async processRequest(
    userPrompt: string,
    callbacks: AIServiceCallbacks,
    history?: AIHistoryEntry[],
  ): Promise<string> {
    const requestId = `interactive-page_${Date.now()}`;
    this._requestId = requestId;
    this._userPrompt = userPrompt;

    startThreadStreaming(THREAD_ID, requestId);
    initDesignProgress(THREAD_ID);

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

  private executeTool(toolName: string, toolResult: Record<string, unknown>): void {
    const toolData = (toolResult.data as Record<string, unknown>) || toolResult;

    console.log(`[InteractivePageAIService] Executing tool: ${toolName}`, toolData);

    switch (toolName) {
      case 'notify':
        this.handleNotify(toolData as unknown as NotifyParams);
        break;

      case 'find_and_replace':
        this.handleFindAndReplace(toolData as { search: string; replace: string });
        break;

      case 'update_html':
        this.handleUpdateHtml(toolData as { html: string });
        break;

      default:
        console.warn(`[InteractivePageAIService] Unknown tool: ${toolName}`);
    }
  }

  private handleNotify(params: NotifyParams): void {
    console.log(`[InteractivePage Notification] ${params.message}`);
    setThreadDesigningMessage(THREAD_ID, params.message);
  }

  private handleFindAndReplace(params: { search: string; replace: string }): void {
    try {
      const result = findAndReplaceHtml(params.search, params.replace);
      if (result.success) {
        console.log(`[InteractivePageAIService] Replaced ${result.count} occurrence(s)`);
      } else {
        console.warn('[InteractivePageAIService] find_and_replace: search string not found');
      }
    } catch (error) {
      console.error('[InteractivePageAIService] Error in find_and_replace:', error);
    }
  }

  private handleUpdateHtml(params: { html: string }): void {
    try {
      setInteractivePageHtml(params.html);
      console.log('[InteractivePageAIService] Full HTML replaced');
    } catch (error) {
      console.error('[InteractivePageAIService] Error in update_html:', error);
    }
  }
}

export const interactivePageAIService = new InteractivePageAIService();
