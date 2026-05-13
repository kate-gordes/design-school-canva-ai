import type { ToolDefinition } from '@canva-ct/genai';
import { CanvaAIBaseService } from './canva-ai-base';
import { getToolsForScope, getCreationModeTools } from './tools';
import { buildSystemPrompt, getCreationModePrompt } from './prompt';
import { falImageService } from './fal-image-service';
import type {
  AIServiceCallbacks,
  AIContext,
  PresentationContext,
  PageContext,
  ElementContext,
  AIHistoryEntry,
  RequestScope,
  UpdateElementStyleParams,
  UpdateElementContentParams,
  UpdateCanvasBackgroundParams,
  GenerateImageParams,
  EditImageParams,
  AddElementParams,
  DeleteElementParams,
  BatchUpdateParams,
  GenerateSlideParams,
  NotifyParams,
  CreatePresentationParams,
  CreateSlideWithDataParams,
  CreateMultipleSlidesParams,
  RequestSlideSelectionParams,
} from './types';
import {
  generateRequestId,
  generateChangeId,
  addActiveRequest,
  updateRequestStatus,
  updateRequestStreamContent,
  addChangeToRequest,
  captureElementState,
  captureCanvasState,
  activeRequests,
  addPendingOperation,
  updatePendingOperation,
  generateOperationId,
  getPendingOperationsForRequest,
} from '@/store/signals/aiRequests';
import type { OriginalState } from '@/store/signals/aiRequests';
import {
  canvases,
  activeCanvasId,
  updateElementProperty,
  updateElementContent,
  deleteElement,
  addElementToCanvas,
  handleUpdateCanvasElements,
  handleAddCanvasWithElements,
  recordHistory,
  selectedElementId,
  selectedElementIds,
  selectedPageId,
  setElementLoadingState,
  isAIChange,
  currentAIInitiationScope,
  currentAIMetadata,
  hasUnsupportedSelection,
  isCreationMode,
  loadHardcodedPresentation,
  exitCreationMode,
} from '@/store/signals/canvasState';
import type { GradientConfig } from '@/store/signals/canvasState';
import {
  addDebugHistoryEntry,
  captureElementSnapshot,
  captureCanvasSnapshot,
} from '@/store/signals/debugHistory';
import type {
  HistoryScope,
  ActionType,
  StateSnapshot,
  OriginContext,
} from '@/store/signals/debugHistory';
import type { ElementData } from '@/store/signals/canvasState';
import {
  addMessageToThread,
  startThreadStreaming,
  appendThreadStreamingContent,
  setThreadDesigning,
  setThreadDesigningMessage,
  endThreadStreaming,
  setThreadImageGenerating,
  initDesignProgress,
  addDesignAction,
  completeDesignAction,
  finalizeDesignProgress,
  getToolDisplayName,
  getThreadRequestState,
} from '@/store/signals/chat';
import type { ChatMessage } from '@/store/signals/chat';
import { imageToElementsService } from '@/services/image-to-elements';
import { imageGenerationService } from '@/services/image-generation';
import {
  addAIEditingPage,
  removeAIEditingPage,
  addAIEditingElement,
  removeAIEditingElement,
  clearAllAIEditing,
  aiEditingPages,
  aiEditingElements,
} from '@/store/signals/aiEditingState';
import { findCanvasIdForElement } from '@/store/signals/canvasState';

/**
 * Main Canva AI Service
 * Handles AI-powered canvas editing with auto-apply functionality
 */
export class CanvaAIService extends CanvaAIBaseService {
  private currentScope: RequestScope = 'presentation';
  private currentContext: AIContext | null = null;
  private currentOriginContext: OriginContext | null = null;
  private pendingSlidePickerData: { excludeCanvasId: number } | null = null;

  protected getTools(): ToolDefinition[] {
    if (isCreationMode.value) {
      return getCreationModeTools();
    }
    return getToolsForScope(this.currentScope);
  }

  protected getSystemPrompt(context: unknown): string {
    if (isCreationMode.value) {
      return getCreationModePrompt();
    }
    return buildSystemPrompt(context as AIContext);
  }

  protected getModelConfig() {
    return {
      model: 'anthropic/claude-opus-4.5',
      temperature: 0.7,
      maxTokens: 4096,
    };
  }

  /**
   * Compute thread ID from current selection state
   * Thread routing: element > page > presentation
   */
  private computeThreadId(): string {
    const currentElementId = selectedElementId.value;
    const currentPageId = selectedPageId.value;
    const isUnsupported = hasUnsupportedSelection.value;

    // Unsupported elements use presentation thread
    if (currentElementId && !isUnsupported) {
      return currentElementId;
    }
    if (currentPageId !== null && !isUnsupported) {
      return `page:${currentPageId}`;
    }
    return 'presentation';
  }

  /**
   * Process a user request
   * Determines scope, builds context, and handles AI interaction
   */
  async processRequest(
    userPrompt: string,
    callbacks: AIServiceCallbacks,
    history?: AIHistoryEntry[],
  ): Promise<string> {
    // Determine scope from current selection state
    const scope = this.determineScope();
    const requestId = generateRequestId();

    // Capture target canvas ID at request time (for async operations)
    // Priority: selectedPageId > activeCanvasId
    const targetCanvasId = selectedPageId.value ?? activeCanvasId.value;

    // Capture thread ID at request time - responses will be routed to this thread
    const threadId = this.computeThreadId();

    // Capture origin context at request time (before selection can change)
    // This records where the AI request was initiated from (the thread context)
    const currentElementId = selectedElementId.value;
    this.currentOriginContext = {
      scope,
      canvasId: targetCanvasId,
      elementId: scope === 'element' ? currentElementId : null,
      elementType: scope === 'element' ? this.getElementType(currentElementId) : null,
    };

    console.log(
      `[CanvaAIService] Processing request with scope: ${scope}, targetCanvasId: ${targetCanvasId}, threadId: ${threadId}`,
    );

    // Reset slide picker state from any previous request
    this.pendingSlidePickerData = null;

    // Track request with captured canvas ID and thread ID
    addActiveRequest({
      requestId,
      scope,
      status: 'processing',
      userPrompt,
      changes: [],
      streamContent: '',
      targetCanvasId,
      threadId,
    });

    // Start thread streaming state (service manages state, not components)
    startThreadStreaming(threadId, requestId);
    initDesignProgress(threadId);

    // Show AI editing visual indicators immediately for targeted scopes.
    // For design-level requests, wait until tools execute to know which pages/elements are affected.
    if (scope === 'page') {
      addAIEditingPage(targetCanvasId);
    } else if (scope === 'element') {
      if (currentElementId) {
        addAIEditingElement(currentElementId);
      }
      for (const eid of selectedElementIds.value) {
        addAIEditingElement(eid);
      }
    }

    // Build context based on scope
    const context = this.buildContext(scope);
    this.currentScope = scope;
    this.currentContext = context;

    // Guard to prevent double completion (base service may call onComplete multiple times)
    let completionHandled = false;
    let toolsInProgress = 0;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;

    // Helper to perform actual completion - called once all streaming is truly done
    const doComplete = () => {
      if (completionHandled) return;
      completionHandled = true;

      // Clear any pending timer
      if (completionTimer) {
        clearTimeout(completionTimer);
        completionTimer = null;
      }

      // Get request to find the captured threadId and accumulated content
      const request = activeRequests.value.get(requestId);

      // Finalize design progress and build summary before ending streaming
      finalizeDesignProgress(threadId);
      const progressState = getThreadRequestState(threadId).designProgress;
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

      // Clear AI editing indicators at request end
      // Pages transition to linger state (fade-out on thumbnails)
      for (const pageId of aiEditingPages.value) {
        removeAIEditingPage(pageId);
      }
      // Keep indicators on elements that still have async ops in flight
      const pendingOps = getPendingOperationsForRequest(requestId);
      const asyncElementIds = new Set(
        pendingOps
          .filter(op => op.status === 'in_progress' && op.targetElementId)
          .map(op => op.targetElementId!),
      );
      if (asyncElementIds.size > 0) {
        // Only keep elements with in-flight ops
        aiEditingElements.value = asyncElementIds;
      } else {
        aiEditingElements.value = new Set();
      }

      // IMPORTANT: End streaming state BEFORE adding the message
      // This prevents a brief moment where both streaming indicator and message are shown
      endThreadStreaming(threadId);

      if (request) {
        // Determine message content - use stream content if available,
        // otherwise provide a contextual fallback
        let messageContent = request.streamContent.trim();

        if (!messageContent) {
          // Check for pending async operations (image generation, etc.)
          const pendingOps = getPendingOperationsForRequest(requestId);
          const hasAsyncOps = pendingOps.some(op => op.status === 'in_progress');

          if (hasAsyncOps) {
            // Don't add a message yet - async operations will complete later
            // The streaming indicator will have shown progress already
            messageContent = 'Working on your request...';
          } else if (request.changes.length > 0) {
            messageContent = 'Done!';
          } else {
            messageContent = 'I processed your request.';
          }
        }

        // Add assistant message to the correct thread (captured at request time)
        addMessageToThread(messageContent, 'assistant', request.threadId, {
          changes: request.changes.length > 0 ? request.changes : undefined,
          requestId,
          designSummary,
          slidePickerData: this.pendingSlidePickerData ?? undefined,
        });
        this.pendingSlidePickerData = null;
      }

      updateRequestStatus(requestId, 'completed');
      callbacks.onComplete?.(requestId);
    };

    // Create wrapped callbacks that handle tool execution and thread state
    const wrappedCallbacks: AIServiceCallbacks = {
      onStream: content => {
        // Don't update streaming state after completion
        if (completionHandled) return;
        // Update both legacy request tracking and new thread state
        updateRequestStreamContent(requestId, content);
        appendThreadStreamingContent(threadId, content);
        callbacks.onStream?.(content);
      },
      onNotification: message => {
        callbacks.onNotification?.(message);
      },
      onModelEnd: () => {
        callbacks.onModelEnd?.();
      },
      onToolStart: toolName => {
        toolsInProgress++;
        // Clear any pending completion timer - more content is coming after tools
        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }
        // Set thread to designing state (tool executing)
        setThreadDesigning(threadId, true);
        // Track design action (skip notify and request_slide_selection — they are not design actions)
        if (toolName !== 'notify' && toolName !== 'request_slide_selection') {
          addDesignAction(threadId, toolName, getToolDisplayName(toolName, 'active'));
        }
        callbacks.onToolStart?.(toolName);
      },
      onToolEnd: (toolName, result) => {
        // Execute and track the tool
        this.executeAndTrack(toolName, result as Record<string, unknown>, requestId);
        // Mark design action as completed (skip notify and request_slide_selection)
        if (toolName !== 'notify' && toolName !== 'request_slide_selection') {
          completeDesignAction(threadId, toolName);
        }
        toolsInProgress--;
        // Clear designing state when no more tools in progress
        if (toolsInProgress === 0) {
          setThreadDesigning(threadId, false);
        }
        callbacks.onToolEnd?.(toolName, result);
      },
      onComplete: () => {
        // The base service may call onComplete multiple times (after each model turn).
        // We use a debounce pattern: schedule completion, but if another onComplete
        // comes in (more content coming), we reschedule. This ensures we capture
        // all streamed content including the final response after tools.
        if (completionTimer) {
          clearTimeout(completionTimer);
        }
        // If tools are in progress, don't schedule completion yet
        if (toolsInProgress > 0) {
          return;
        }
        // Schedule completion with a small delay to allow any final content to arrive
        completionTimer = setTimeout(doComplete, 50);
      },
      onError: error => {
        // Guard against double error handling
        if (completionHandled) return;
        completionHandled = true;

        // Clear all AI editing indicators on error
        clearAllAIEditing();

        // Clear any pending completion timer
        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }

        // Get request to find the captured threadId
        const request = activeRequests.value.get(requestId);
        if (request) {
          // Add error message to the correct thread (captured at request time)
          addMessageToThread(
            `Sorry, I encountered an error: ${error.message}`,
            'assistant',
            request.threadId,
          );
        }

        // End thread streaming state with error
        endThreadStreaming(threadId, error.message);
        updateRequestStatus(requestId, 'error', error.message);
        callbacks.onError?.(error);
      },
    };

    try {
      await this.invokeAI(userPrompt, context, wrappedCallbacks, history);
    } catch (error) {
      // Clear all AI editing indicators on error
      clearAllAIEditing();
      // Add error message to the correct thread (using captured threadId)
      addMessageToThread(
        `Sorry, I encountered an error: ${(error as Error).message}`,
        'assistant',
        threadId,
      );
      // End thread streaming state with error
      endThreadStreaming(threadId, (error as Error).message);
      updateRequestStatus(requestId, 'error', (error as Error).message);
      callbacks.onError?.(error as Error);
    }

    return requestId;
  }

  /**
   * Determine the scope based on current selection
   * element > page > presentation
   */
  private determineScope(): RequestScope {
    // Unsupported elements: use presentation scope (treat as whole design)
    if (hasUnsupportedSelection.value) {
      return 'presentation';
    }

    // If specific elements are selected, use element scope
    if (selectedElementId.value || selectedElementIds.value.size > 0) {
      return 'element';
    }

    // If a page is selected (but no element), use page scope
    if (selectedPageId.value !== null) {
      return 'page';
    }

    // Default to presentation scope (can access all slides)
    return 'presentation';
  }

  /**
   * Build context object based on scope
   */
  private buildContext(scope: RequestScope): AIContext {
    const allCanvases = canvases.value;
    const currentCanvasId = activeCanvasId.value;
    const currentCanvas = allCanvases.find(c => c.canvasId === currentCanvasId);

    switch (scope) {
      case 'presentation': {
        // Only include presentation and fixed-design canvases —
        // doc and website pages have their own AI services.
        const designCanvases = allCanvases.filter(
          c => !c.docType || c.docType === 'presentation' || c.docType === 'fixed-design',
        );
        const context: PresentationContext = {
          scope: 'presentation',
          totalSlides: designCanvases.length,
          canvases: designCanvases.map(canvas => ({
            canvasId: canvas.canvasId,
            content: canvas.content,
            color: canvas.color,
            elements: (canvas.elements || []).map(el => ({
              elementId: el.elementId,
              type: el.type,
              style: this.sanitizeData(el.style) as React.CSSProperties,
              content: el.content,
            })),
          })),
        };
        return context;
      }

      case 'page': {
        // Use selectedPageId if available, otherwise fall back to activeCanvasId
        const pageCanvasId = selectedPageId.value ?? currentCanvasId;
        const pageCanvas = allCanvases.find(c => c.canvasId === pageCanvasId);

        // Calculate current slide index (1-based)
        const currentSlideIndex = allCanvases.findIndex(c => c.canvasId === pageCanvasId) + 1;

        const context: PageContext = {
          scope: 'page',
          canvasId: pageCanvasId,
          content: pageCanvas?.content || '',
          color: pageCanvas?.color,
          currentSlideIndex: currentSlideIndex > 0 ? currentSlideIndex : undefined,
          totalSlides: allCanvases.length,
          elements: (pageCanvas?.elements || []).map(el => ({
            elementId: el.elementId,
            type: el.type,
            style: this.sanitizeData(el.style) as React.CSSProperties,
            content: el.content,
          })),
        };
        return context;
      }

      case 'element': {
        const selectedIds = selectedElementId.value
          ? [selectedElementId.value]
          : Array.from(selectedElementIds.value);

        const selectedElements = (currentCanvas?.elements || [])
          .filter(el => selectedIds.includes(el.elementId))
          .map(el => ({
            elementId: el.elementId,
            type: el.type,
            style: this.sanitizeData(el.style) as React.CSSProperties,
            content: el.content,
          }));

        const context: ElementContext = {
          scope: 'element',
          canvasId: currentCanvasId,
          selectedElements,
        };
        return context;
      }

      default:
        throw new Error(`Unknown scope: ${scope}`);
    }
  }

  /**
   * Map tool name to action type for debug history
   */
  private mapToolNameToActionType(toolName: string): ActionType {
    const mapping: Record<string, ActionType> = {
      update_element_style: 'style-change',
      update_element_content: 'content-change',
      update_canvas_background: 'background-change',
      generate_image: 'create',
      edit_image: 'update',
      add_element: 'create',
      delete_element: 'delete',
      batch_update: 'update',
      generate_slide: 'create',
      create_slide_with_data: 'create',
      create_multiple_slides: 'create',
    };
    return mapping[toolName] || 'update';
  }

  /**
   * Determine the affected scope based on what the tool actually modifies
   */
  private getAffectedScope(toolName: string): HistoryScope {
    switch (toolName) {
      case 'update_element_style':
      case 'update_element_content':
      case 'generate_image':
      case 'edit_image':
      case 'add_element':
      case 'delete_element':
        return 'element';
      case 'update_canvas_background':
        return 'page';
      case 'generate_slide':
      case 'create_slide_with_data':
        return 'page';
      case 'create_multiple_slides':
        // Multiple slides affects presentation level
        return 'presentation';
      case 'batch_update':
        // Batch updates affect multiple elements but at element level
        return 'element';
      default:
        return 'element';
    }
  }

  /**
   * Capture debug history state snapshot based on tool type
   */
  private captureDebugStateSnapshot(
    toolName: string,
    toolData: Record<string, unknown>,
    targetCanvasId: number,
  ): StateSnapshot | null {
    switch (toolName) {
      case 'update_element_style':
      case 'update_element_content':
      case 'edit_image':
      case 'delete_element':
        return captureElementSnapshot(toolData.elementId as string);
      case 'generate_image':
        if (toolData.elementId) {
          return captureElementSnapshot(toolData.elementId as string);
        }
        return captureCanvasSnapshot(targetCanvasId);
      case 'update_canvas_background':
        return captureCanvasSnapshot((toolData.canvasId as number) || targetCanvasId);
      case 'add_element':
      case 'generate_slide':
        return captureCanvasSnapshot((toolData.canvasId as number) || targetCanvasId);
      case 'batch_update':
        // For batch, capture the canvas state
        return captureCanvasSnapshot(targetCanvasId);
      default:
        return null;
    }
  }

  /**
   * Extract the element IDs affected by a tool call (for AI editing indicators)
   */
  private getAffectedElementIds(toolName: string, toolData: Record<string, unknown>): string[] {
    switch (toolName) {
      case 'update_element_style':
      case 'update_element_content':
      case 'generate_image':
      case 'edit_image':
      case 'delete_element':
        return toolData.elementId ? [toolData.elementId as string] : [];
      case 'batch_update': {
        const updates = toolData.updates as Array<{ elementId: string }> | undefined;
        return updates ? updates.map(u => u.elementId) : [];
      }
      default:
        return [];
    }
  }

  /**
   * Get the element type from an element ID
   */
  private getElementType(elementId: string | null): string | null {
    if (!elementId) return null;
    for (const canvas of canvases.value) {
      const element = canvas.elements?.find(el => el.elementId === elementId);
      if (element) return element.type;
    }
    return null;
  }

  /**
   * Create origin context for AI changes
   * Origin is where the AI request was initiated from (the thread context)
   * Returns the origin captured at request initiation time
   */
  private createAIOriginContext(): OriginContext {
    // Return the origin context captured at request initiation time
    // This ensures the origin reflects where the request was started,
    // not where selection might have moved to during async operations
    if (this.currentOriginContext) {
      return this.currentOriginContext;
    }

    // Fallback to current state (shouldn't normally happen)
    const currentElementId = selectedElementId.value;
    const currentPageId = selectedPageId.value;
    const currentCanvasId = currentPageId ?? activeCanvasId.value;

    return {
      scope: this.currentScope,
      canvasId: currentCanvasId,
      elementId: this.currentScope === 'element' ? currentElementId : null,
      elementType: this.currentScope === 'element' ? this.getElementType(currentElementId) : null,
    };
  }

  /**
   * Execute a tool and track the change
   */
  private executeAndTrack(
    toolName: string,
    toolResult: Record<string, unknown>,
    requestId: string,
  ): void {
    // Unwrap the tool data - it may be wrapped in a { data: {...} } structure
    const toolData = (toolResult.data as Record<string, unknown>) || toolResult;

    // Get the target canvas ID - prefer toolData.canvasId for tools that specify a specific canvas
    const request = activeRequests.value.get(requestId);
    const toolDataCanvasId = toolData.canvasId != null ? Number(toolData.canvasId) : null;
    const targetCanvasId = toolDataCanvasId ?? request?.targetCanvasId ?? activeCanvasId.value;

    console.log(
      `[CanvaAIService] Executing tool: ${toolName}, targetCanvasId: ${targetCanvasId}`,
      toolData,
    );

    // Track AI editing state for visual indicators
    const affectedElementIds = this.getAffectedElementIds(toolName, toolData);
    const affectedCanvasId = toolDataCanvasId ?? targetCanvasId;

    // Mark page and elements as being AI-edited
    if (this.currentScope !== 'element') {
      addAIEditingPage(affectedCanvasId);
    }
    for (const eid of affectedElementIds) {
      addAIEditingElement(eid);
    }

    // Capture original state BEFORE applying (for undo)
    const originalState = this.captureOriginalState(toolName, toolData, targetCanvasId);

    // Capture debug history state BEFORE applying
    const debugBeforeState = this.captureDebugStateSnapshot(toolName, toolData, targetCanvasId);

    // Set AI change flags to prevent double-recording in canvasState
    isAIChange.value = true;
    currentAIInitiationScope.value = this.currentScope;
    currentAIMetadata.value = {
      requestId,
      toolName,
      userPrompt:
        this.currentContext?.scope === 'element' ? undefined : request?.userPrompt || undefined,
    };

    // Execute the tool
    let success = false;
    try {
      switch (toolName) {
        case 'notify':
          // Notify updates the designing message for the thread
          this.handleNotify(
            toolData as unknown as NotifyParams,
            request?.threadId || 'presentation',
          );
          return; // Don't track as a change

        case 'update_element_style':
          success = this.handleUpdateElementStyle(toolData as unknown as UpdateElementStyleParams);
          break;

        case 'update_element_content':
          success = this.handleUpdateElementContent(
            toolData as unknown as UpdateElementContentParams,
          );
          break;

        case 'update_canvas_background':
          success = this.handleUpdateCanvasBackground(
            toolData as unknown as UpdateCanvasBackgroundParams,
            targetCanvasId,
          );
          break;

        case 'generate_image':
          // Async operation - track AFTER completion
          this.handleGenerateImage(
            toolData as unknown as GenerateImageParams,
            requestId,
            originalState,
            (toolData.description as string) || 'Generate image',
            targetCanvasId,
            request?.threadId || 'presentation',
          );
          return; // Don't track here, will track after async completes

        case 'edit_image':
          // Async operation - track AFTER completion
          this.handleEditImage(
            toolData as unknown as EditImageParams,
            requestId,
            originalState,
            (toolData.description as string) || 'Edit image',
            targetCanvasId,
            request?.threadId || 'presentation',
          );
          return; // Don't track here, will track after async completes

        case 'add_element':
          success = this.handleAddElement(toolData as unknown as AddElementParams, targetCanvasId);
          break;

        case 'delete_element':
          success = this.handleDeleteElement(toolData as unknown as DeleteElementParams);
          break;

        case 'batch_update':
          success = this.handleBatchUpdate(toolData as unknown as BatchUpdateParams);
          break;

        case 'generate_slide':
          // Async operation - track AFTER completion
          this.handleGenerateSlide(
            toolData as unknown as GenerateSlideParams,
            requestId,
            originalState,
            (toolData.description as string) || 'Generate slide',
            targetCanvasId,
          );
          return; // Don't track here, will track after async completes

        case 'create_presentation':
          success = this.handleCreatePresentation(
            toolData as unknown as CreatePresentationParams,
            requestId,
          );
          exitCreationMode(); // Exit creation mode after tool executes
          break;

        case 'create_slide_with_data': {
          const slideResult = this.handleCreateSlideWithData(
            toolData as unknown as CreateSlideWithDataParams,
            requestId,
            targetCanvasId,
          );
          success = slideResult.success;
          break;
        }

        case 'create_multiple_slides': {
          const multiResult = this.handleCreateMultipleSlides(
            toolData as unknown as CreateMultipleSlidesParams,
            requestId,
            targetCanvasId,
          );
          success = multiResult.success;
          break;
        }

        case 'request_slide_selection':
          this.handleRequestSlideSelection(toolData as unknown as RequestSlideSelectionParams);
          return; // Not a canvas change — no tracking needed

        default:
          console.warn(`[CanvaAIService] Unknown tool: ${toolName}`);
          // Reset AI change flags
          isAIChange.value = false;
          currentAIMetadata.value = null;
          return;
      }
    } catch (error) {
      console.error(`[CanvaAIService] Error executing tool ${toolName}:`, error);
      success = false;
    }

    // Reset AI change flags
    isAIChange.value = false;
    currentAIMetadata.value = null;

    // Track the change in AI request system
    if (success && originalState) {
      addChangeToRequest(requestId, {
        id: generateChangeId(),
        toolName,
        description: (toolData.description as string) || toolName,
        targetId: (toolData.elementId as string) || (toolData.canvasId as string) || 'unknown',
        timestamp: new Date(),
        originalState,
        appliedState: null, // Will be captured when first toggled off
        reverted: false,
      });
    }

    // Track in debug history system
    if (success && debugBeforeState) {
      const debugAfterState = this.captureDebugStateSnapshot(toolName, toolData, targetCanvasId);
      const targetElementId = (toolData.elementId as string) || null;
      if (debugAfterState) {
        addDebugHistoryEntry({
          affectedScope: this.getAffectedScope(toolName),
          initiationScope: this.currentScope,
          source: 'canva-ai',
          actionType: this.mapToolNameToActionType(toolName),
          targetId: targetElementId || (toolData.canvasId as string) || null,
          targetCanvasId,
          targetElementType: this.getElementType(targetElementId),
          origin: this.createAIOriginContext(),
          beforeState: debugBeforeState,
          afterState: debugAfterState,
          description: (toolData.description as string) || toolName,
          aiMetadata: {
            requestId,
            toolName,
            userPrompt: request?.userPrompt,
          },
        });
      }
    }
  }

  /**
   * Capture original state before a tool modifies it
   */
  private captureOriginalState(
    toolName: string,
    toolData: Record<string, unknown>,
    targetCanvasId: number,
  ): OriginalState | null {
    switch (toolName) {
      case 'update_element_style':
      case 'update_element_content':
      case 'edit_image':
      case 'delete_element':
        return captureElementState(toolData.elementId as string);

      case 'update_canvas_background':
        // Use targetCanvasId (captured at request time) as fallback
        return captureCanvasState((toolData.canvasId as number) || targetCanvasId);

      case 'generate_image':
        if (toolData.elementId) {
          return captureElementState(toolData.elementId as string);
        }
        return null;

      case 'add_element':
      case 'generate_slide':
        // For new elements/slides, use targetCanvasId (captured at request time)
        return captureCanvasState((toolData.canvasId as number) || targetCanvasId);

      case 'batch_update': {
        // For batch updates, capture the first element (simplified)
        const updates = toolData.updates as Array<{ elementId: string }>;
        if (updates && updates.length > 0) {
          return captureElementState(updates[0].elementId);
        }
        return null;
      }

      default:
        return null;
    }
  }

  // Tool handlers

  private handleNotify(params: NotifyParams, threadId: string): void {
    console.log(`[CanvaAI Notification] ${params.message}`);
    // Update the thread designing message to show what the AI is doing
    setThreadDesigningMessage(threadId, params.message);
  }

  private handleRequestSlideSelection(params: RequestSlideSelectionParams): void {
    // Store the picker data — doComplete will attach it to the final assistant message
    this.pendingSlidePickerData = { excludeCanvasId: params.currentCanvasId };
    console.log(
      '[CanvaAIService] Slide selection requested, excludeCanvasId:',
      params.currentCanvasId,
    );
  }

  private handleUpdateElementStyle(params: UpdateElementStyleParams): boolean {
    try {
      updateElementProperty(params.elementId, 'style', params.style);
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error updating element style:', error);
      return false;
    }
  }

  private handleUpdateElementContent(params: UpdateElementContentParams): boolean {
    try {
      updateElementContent(params.elementId, params.content);
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error updating element content:', error);
      return false;
    }
  }

  private handleUpdateCanvasBackground(
    params: UpdateCanvasBackgroundParams,
    targetCanvasId: number,
  ): boolean {
    try {
      // Use params.canvasId if specified, otherwise use targetCanvasId (captured at request time)
      const canvasId = params.canvasId ?? targetCanvasId;

      canvases.value = canvases.value.map(c => {
        if (c.canvasId === canvasId) {
          const update: Partial<typeof c> = {};

          if (params.color) {
            update.color = params.color;
          }

          if (params.gradient) {
            update.gradient = {
              type: params.gradient.type,
              colors: params.gradient.colors,
              angle: params.gradient.angle ? `${params.gradient.angle}deg` : undefined,
            };
          }

          return { ...c, ...update };
        }
        return c;
      });

      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error updating canvas background:', error);
      return false;
    }
  }

  private async handleGenerateImage(
    params: GenerateImageParams,
    requestId: string,
    originalState: OriginalState | null,
    description: string,
    targetCanvasId: number,
    threadId: string,
  ): Promise<void> {
    // Create pending operation
    const operationId = generateOperationId();

    addPendingOperation({
      id: operationId,
      requestId,
      type: 'generate_image',
      status: 'in_progress',
      targetElementId: params.elementId,
      description: 'Creating image...',
      startedAt: new Date(),
    });

    // Set thread image generating state (persists after streaming ends)
    setThreadImageGenerating(threadId, true, 'Creating image...');

    // Set element loading state if targeting an existing element
    if (params.elementId) {
      setElementLoadingState(params.elementId, {
        status: 'loading',
        message: 'Generating image...',
      });
    }

    try {
      const result = await falImageService.generateImage(params.prompt, {
        width: params.width,
        height: params.height,
      });

      let targetId = params.elementId || 'unknown';

      // Set AI change flag to prevent duplicate debug history entries
      isAIChange.value = true;

      if (params.elementId) {
        // Update existing element
        updateElementProperty(params.elementId, 'style', {
          backgroundImage: `url('${result.url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        });
        // Clear element loading state
        setElementLoadingState(params.elementId, null);
      } else {
        // Create new image element on the target canvas
        const newElement: ElementData = {
          elementId: `img_${Date.now()}`,
          type: 'image',
          style: {
            position: 'absolute',
            top: '100px',
            left: '100px',
            width: `${result.width / 2}px`,
            height: `${result.height / 2}px`,
            backgroundImage: `url('${result.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          },
        };
        addElementToCanvas(targetCanvasId, newElement);
        targetId = newElement.elementId;
      }

      // Reset AI change flag
      isAIChange.value = false;

      // Mark operation as completed and clear thread image generating state
      updatePendingOperation(operationId, { status: 'completed', completedAt: new Date() });
      setThreadImageGenerating(threadId, false);

      // Clear AI editing indicator now that async op is done
      if (params.elementId) removeAIEditingElement(params.elementId);
      removeAIEditingElement(targetId);

      // Track the change AFTER async completion
      if (originalState) {
        addChangeToRequest(requestId, {
          id: generateChangeId(),
          toolName: 'generate_image',
          description,
          targetId,
          timestamp: new Date(),
          originalState,
          appliedState: null,
          reverted: false,
        });
      }

      // Track in debug history system
      const debugAfterState = captureElementSnapshot(targetId);
      if (debugAfterState) {
        addDebugHistoryEntry({
          affectedScope: 'element',
          initiationScope: this.currentScope,
          source: 'canva-ai',
          actionType: params.elementId ? 'update' : 'create',
          targetId,
          targetCanvasId,
          targetElementType: this.getElementType(targetId),
          origin: this.createAIOriginContext(),
          beforeState: originalState
            ? { type: 'element', elementData: originalState.data as ElementData | undefined }
            : { type: 'element', elementData: undefined },
          afterState: debugAfterState,
          description,
          aiMetadata: {
            requestId,
            toolName: 'generate_image',
            userPrompt: params.prompt,
          },
        });
      }
    } catch (error) {
      console.error('[CanvaAIService] Error generating image:', error);

      // Mark operation as error and clear thread image generating state
      updatePendingOperation(operationId, {
        status: 'error',
        error: (error as Error).message,
        completedAt: new Date(),
      });
      setThreadImageGenerating(threadId, false);

      // Clear AI editing indicator on error
      if (params.elementId) removeAIEditingElement(params.elementId);

      // Clear element loading state on error
      if (params.elementId) {
        setElementLoadingState(params.elementId, {
          status: 'error',
          message: 'Failed to generate',
        });
      }
    }
  }

  private async handleEditImage(
    params: EditImageParams,
    requestId: string,
    originalState: OriginalState | null,
    description: string,
    targetCanvasId: number,
    threadId: string,
  ): Promise<void> {
    // Create pending operation
    const operationId = generateOperationId();

    addPendingOperation({
      id: operationId,
      requestId,
      type: 'edit_image',
      status: 'in_progress',
      targetElementId: params.elementId,
      description: 'Creating image...',
      startedAt: new Date(),
    });

    // Set thread image generating state (persists after streaming ends)
    setThreadImageGenerating(threadId, true, 'Creating image...');

    // Set element loading state
    setElementLoadingState(params.elementId, { status: 'loading', message: 'Creating image...' });

    try {
      // Get current image URL from element - search in target canvas first, then all canvases
      let canvas = canvases.value.find(c => c.canvasId === targetCanvasId);
      let element = canvas?.elements?.find(el => el.elementId === params.elementId);

      // If not found in target canvas, search all canvases (for presentation-level edits)
      if (!element) {
        for (const c of canvases.value) {
          element = c.elements?.find(el => el.elementId === params.elementId);
          if (element) {
            canvas = c;
            break;
          }
        }
      }

      if (!element?.style?.backgroundImage) {
        console.error('[CanvaAIService] No image found in element');
        updatePendingOperation(operationId, {
          status: 'error',
          error: 'No image found in element',
          completedAt: new Date(),
        });
        setElementLoadingState(params.elementId, { status: 'error', message: 'No image found' });
        return;
      }

      // Extract URL from backgroundImage style
      const urlMatch = element.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      let currentImageUrl = urlMatch ? urlMatch[1] : null;

      if (!currentImageUrl) {
        console.error('[CanvaAIService] Could not extract image URL');
        updatePendingOperation(operationId, {
          status: 'error',
          error: 'Could not extract image URL',
          completedAt: new Date(),
        });
        setElementLoadingState(params.elementId, { status: 'error', message: 'Invalid image' });
        return;
      }

      // Convert local/relative URLs to base64 data URI
      if (!currentImageUrl.startsWith('data:') && !currentImageUrl.startsWith('http')) {
        currentImageUrl = await this.imageUrlToBase64(currentImageUrl);
      }

      const result = await falImageService.editImage(currentImageUrl, params.prompt);

      // Set AI change flag to prevent duplicate debug history entries
      isAIChange.value = true;

      updateElementProperty(params.elementId, 'style', {
        backgroundImage: `url('${result.url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      });

      // Reset AI change flag
      isAIChange.value = false;

      // Mark operation as completed and clear thread image generating state
      updatePendingOperation(operationId, { status: 'completed', completedAt: new Date() });
      setThreadImageGenerating(threadId, false);
      setElementLoadingState(params.elementId, null);

      // Clear AI editing indicator now that async op is done
      removeAIEditingElement(params.elementId);

      // Track the change AFTER async completion
      if (originalState) {
        addChangeToRequest(requestId, {
          id: generateChangeId(),
          toolName: 'edit_image',
          description,
          targetId: params.elementId,
          timestamp: new Date(),
          originalState,
          appliedState: null,
          reverted: false,
        });
      }

      // Track in debug history system
      const debugAfterState = captureElementSnapshot(params.elementId);
      if (debugAfterState) {
        addDebugHistoryEntry({
          affectedScope: 'element',
          initiationScope: this.currentScope,
          source: 'canva-ai',
          actionType: 'update',
          targetId: params.elementId,
          targetCanvasId,
          targetElementType: this.getElementType(params.elementId),
          origin: this.createAIOriginContext(),
          beforeState: originalState
            ? { type: 'element', elementData: originalState.data as ElementData | undefined }
            : { type: 'element', elementData: undefined },
          afterState: debugAfterState,
          description,
          aiMetadata: {
            requestId,
            toolName: 'edit_image',
            userPrompt: params.prompt,
          },
        });
      }
    } catch (error) {
      console.error('[CanvaAIService] Error editing image:', error);

      // Mark operation as error and clear thread image generating state
      updatePendingOperation(operationId, {
        status: 'error',
        error: (error as Error).message,
        completedAt: new Date(),
      });
      setThreadImageGenerating(threadId, false);

      // Clear AI editing indicator on error
      removeAIEditingElement(params.elementId);

      // Set element error state
      setElementLoadingState(params.elementId, { status: 'error', message: 'Failed to edit' });
    }
  }

  /**
   * Convert a local image URL to base64 data URI
   */
  private async imageUrlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Could not get canvas context'));
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }

  private handleAddElement(params: AddElementParams, targetCanvasId: number): boolean {
    try {
      const newElement: ElementData = {
        elementId: `${params.type}_${Date.now()}`,
        type: params.type,
        style: {
          position: 'absolute',
          ...params.style,
        },
        content: params.content,
      };

      // Use params.canvasId if specified, otherwise use targetCanvasId
      const canvasId = (params as { canvasId?: number }).canvasId ?? targetCanvasId;
      addElementToCanvas(canvasId, newElement);
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error adding element:', error);
      return false;
    }
  }

  private handleDeleteElement(params: DeleteElementParams): boolean {
    try {
      deleteElement(params.elementId);
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error deleting element:', error);
      return false;
    }
  }

  private handleBatchUpdate(params: BatchUpdateParams): boolean {
    try {
      for (const update of params.updates) {
        if (update.style) {
          updateElementProperty(update.elementId, 'style', update.style);
        }
        if (update.content !== undefined) {
          updateElementContent(update.elementId, update.content);
        }
      }
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error in batch update:', error);
      return false;
    }
  }

  private handleCreatePresentation(params: CreatePresentationParams, requestId: string): boolean {
    try {
      loadHardcodedPresentation();
      activeCanvasId.value = 1;
      console.log('[CanvaAIService] Loaded hardcoded presentation');
      return true;
    } catch (error) {
      console.error('[CanvaAIService] Error creating presentation:', error);
      return false;
    }
  }

  /**
   * Handle create_slide_with_data tool - creates a slide from JSON structure
   * Image elements will have pendingImagePrompt set and will auto-generate
   */
  private handleCreateSlideWithData(
    params: CreateSlideWithDataParams,
    requestId: string,
    targetCanvasId: number,
  ): { success: boolean; canvasId?: number; slideIndex?: number; totalSlides?: number } {
    try {
      const { slideData, position, description } = params;
      const timestamp = Date.now();
      const allCanvases = canvases.value;

      // Calculate insertAfterCanvasId from position parameter
      let insertAfterCanvasId: number | undefined;
      if (position === 'end') {
        // Insert after the last slide
        insertAfterCanvasId =
          allCanvases.length > 0 ? allCanvases[allCanvases.length - 1].canvasId : undefined;
      } else if (position === 'beginning') {
        // Insert at the beginning (before all slides)
        insertAfterCanvasId = undefined;
      } else if (typeof position === 'number') {
        // Insert after the specified slide number (1-based)
        const slideIndex = position - 1;
        if (slideIndex >= 0 && slideIndex < allCanvases.length) {
          insertAfterCanvasId = allCanvases[slideIndex].canvasId;
        } else if (position <= 0) {
          insertAfterCanvasId = undefined; // Insert at beginning
        } else {
          // Position beyond total slides, insert at end
          insertAfterCanvasId =
            allCanvases.length > 0 ? allCanvases[allCanvases.length - 1].canvasId : undefined;
        }
      }
      // If position not specified, use targetCanvasId (current active slide)

      console.log('[CanvaAIService] Creating slide with data:', {
        elementCount: slideData.elements.length,
        position,
        insertAfterCanvasId,
        description,
      });

      // Transform the elements array into ElementData format
      const elements: ElementData[] = slideData.elements.map((el, index) => {
        const elementId = `${el.type}_${timestamp}_${index}`;

        // Build base style with position: absolute
        const style: React.CSSProperties = {
          position: 'absolute',
          top: el.style.top,
          left: el.style.left,
          ...(el.style.width && { width: el.style.width }),
          ...(el.style.height && { height: el.style.height }),
          ...(el.style.fontSize && { fontSize: el.style.fontSize }),
          ...(el.style.fontFamily && { fontFamily: el.style.fontFamily }),
          ...(el.style.fontWeight && { fontWeight: el.style.fontWeight }),
          ...(el.style.color && { color: el.style.color }),
          ...(el.style.backgroundColor && { backgroundColor: el.style.backgroundColor }),
          ...(el.style.borderRadius && { borderRadius: el.style.borderRadius }),
          ...(el.style.textAlign && {
            textAlign: el.style.textAlign as React.CSSProperties['textAlign'],
          }),
          ...(el.style.lineHeight && { lineHeight: el.style.lineHeight }),
          ...(el.style.letterSpacing && { letterSpacing: el.style.letterSpacing }),
        };

        // For image elements, set up pending image generation
        if (el.type === 'image' && el.content) {
          // Set loading state for the element
          setElementLoadingState(elementId, {
            status: 'loading',
            message: 'Generating image...',
          });

          return {
            elementId,
            type: 'image' as const,
            style: {
              ...style,
              // Default image dimensions if not specified
              width: style.width || '400px',
              height: style.height || '300px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            },
            // Set pending image prompt - this triggers auto-generation via CanvasElement
            pendingImagePrompt: el.content,
            imageGenerationStatus: 'pending' as const,
          };
        }

        // For text elements
        if (el.type === 'text') {
          return {
            elementId,
            type: 'text' as const,
            style,
            content: el.content || '',
          };
        }

        // For shape elements
        return {
          elementId,
          type: el.type as 'shape',
          style,
          content: el.content,
        };
      });

      // Build gradient config if provided
      let gradient: GradientConfig | undefined;
      if (slideData.gradient) {
        gradient = {
          type: slideData.gradient.type,
          colors: slideData.gradient.colors,
          angle: slideData.gradient.angle ? `${slideData.gradient.angle}deg` : undefined,
        };
      }

      // Create the canvas using handleAddCanvasWithElements
      // Use calculated insertAfterCanvasId, or fall back to targetCanvasId (current active slide)
      const insertAfter =
        position !== undefined ? insertAfterCanvasId : (insertAfterCanvasId ?? targetCanvasId);
      const newCanvasId = handleAddCanvasWithElements(
        elements,
        slideData.backgroundColor,
        insertAfter,
        gradient,
      );

      // Badge the new thumbnail immediately
      addAIEditingPage(newCanvasId);

      // Calculate the new slide's index (1-based for user-friendly output)
      const updatedCanvases = canvases.value;
      const newSlideIndex = updatedCanvases.findIndex(c => c.canvasId === newCanvasId) + 1;
      const totalSlides = updatedCanvases.length;

      console.log('[CanvaAIService] Slide created successfully:', {
        canvasId: newCanvasId,
        slideIndex: newSlideIndex,
        totalSlides,
        elementCount: elements.length,
        imageElementsWithPending: elements.filter(e => e.pendingImagePrompt).length,
      });

      return { success: true, canvasId: newCanvasId, slideIndex: newSlideIndex, totalSlides };
    } catch (error) {
      console.error('[CanvaAIService] Error creating slide with data:', error);
      return { success: false };
    }
  }

  /**
   * Handle create_multiple_slides tool - creates multiple slides in one call
   * Iterates through the slides array and calls handleCreateSlideWithData for each
   */
  private handleCreateMultipleSlides(
    params: CreateMultipleSlidesParams,
    requestId: string,
    targetCanvasId: number,
  ): { success: boolean; slidesCreated: number; totalSlides?: number } {
    try {
      const { slides, position } = params;
      let slidesCreated = 0;
      let lastCanvasId: number | undefined;

      console.log('[CanvaAIService] Creating multiple slides:', {
        slideCount: slides.length,
        position,
      });

      // Process each slide in order
      for (let i = 0; i < slides.length; i++) {
        const slideSpec = slides[i];

        // Calculate position for this slide:
        // - First slide uses the original position parameter
        // - Subsequent slides insert after the previously created slide
        let slidePosition: 'end' | 'beginning' | number | undefined;
        if (i === 0) {
          slidePosition = position;
        } else if (lastCanvasId !== undefined) {
          // Find the index of the last created canvas and insert after it
          const lastIndex = canvases.value.findIndex(c => c.canvasId === lastCanvasId);
          if (lastIndex >= 0) {
            slidePosition = lastIndex + 1; // 1-based position
          } else {
            slidePosition = 'end';
          }
        } else {
          slidePosition = 'end';
        }

        const result = this.handleCreateSlideWithData(
          {
            slideData: slideSpec.slideData,
            position: slidePosition,
            description: slideSpec.description,
          },
          requestId,
          targetCanvasId,
        );

        if (result.success && result.canvasId) {
          slidesCreated++;
          lastCanvasId = result.canvasId;
          console.log(`[CanvaAIService] Slide ${i + 1}/${slides.length} created:`, {
            canvasId: result.canvasId,
            slideIndex: result.slideIndex,
            description: slideSpec.description,
          });
        } else {
          console.error(`[CanvaAIService] Failed to create slide ${i + 1}/${slides.length}`);
        }
      }

      const totalSlides = canvases.value.length;

      console.log('[CanvaAIService] Multiple slides creation complete:', {
        slidesCreated,
        totalSlides,
      });

      return { success: slidesCreated > 0, slidesCreated, totalSlides };
    } catch (error) {
      console.error('[CanvaAIService] Error creating multiple slides:', error);
      return { success: false, slidesCreated: 0 };
    }
  }

  /**
   * Get the first slide's image URL to use as a reference for generating new slides.
   * This ensures visual consistency across the presentation.
   *
   * Attempts in order:
   * 1. Extract existing background image URL from first slide's elements
   * 2. Render the first slide's DOM element to a data URI
   */
  private async getFirstSlideImageUrl(): Promise<string | undefined> {
    const allCanvases = canvases.value;

    // Need at least one canvas to use as reference
    if (allCanvases.length === 0) {
      console.log('[CanvaAIService] No canvases available for reference');
      return undefined;
    }

    const firstCanvas = allCanvases[0];

    // Strategy 1: Try to extract existing image URL from elements
    const existingImageUrl = this.extractImageUrlFromCanvas(firstCanvas);
    if (existingImageUrl) {
      console.log('[CanvaAIService] Found existing image URL in first canvas');
      // If it's a remote URL, use it directly
      if (existingImageUrl.startsWith('http')) {
        return existingImageUrl;
      }
      // If it's a local/relative URL or data URI, it should work as-is
      if (existingImageUrl.startsWith('data:')) {
        return existingImageUrl;
      }
      // For relative URLs, convert to base64
      try {
        return await this.imageUrlToBase64(existingImageUrl);
      } catch (error) {
        console.warn('[CanvaAIService] Failed to convert local image URL:', error);
      }
    }

    // Strategy 2: Render the first slide's DOM element to an image
    const renderedImage = await this.renderCanvasToImage(firstCanvas.canvasId);
    if (renderedImage) {
      console.log('[CanvaAIService] Rendered first canvas to image');
      return renderedImage;
    }

    console.log('[CanvaAIService] Could not get first slide image');
    return undefined;
  }

  /**
   * Extract an image URL from a canvas's elements (looks for background images)
   */
  private extractImageUrlFromCanvas(canvas: (typeof canvases.value)[0]): string | undefined {
    if (!canvas.elements || canvas.elements.length === 0) {
      return undefined;
    }

    // Look for image elements or elements with background images
    for (const element of canvas.elements) {
      if (element.style?.backgroundImage) {
        const urlMatch = element.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          return urlMatch[1];
        }
      }
    }

    return undefined;
  }

  /**
   * Render a canvas DOM element to a data URI image
   */
  private async renderCanvasToImage(canvasId: number): Promise<string | undefined> {
    try {
      // Find the canvas DOM element by its ID
      // The canvas elements have a data attribute or class we can target
      const canvasElement = document.querySelector(
        `[data-canvas-id="${canvasId}"], #canvas-${canvasId}, .canvas-container[data-id="${canvasId}"]`,
      );

      if (!canvasElement) {
        // Try finding by index if direct ID lookup fails
        const allCanvasElements = document.querySelectorAll(
          '.canvas-slide, .slide-canvas, [class*="canvas"]',
        );
        if (allCanvasElements.length > 0) {
          const firstCanvasEl = allCanvasElements[0] as HTMLElement;
          return this.domElementToDataUri(firstCanvasEl);
        }
        console.log('[CanvaAIService] Could not find canvas DOM element');
        return undefined;
      }

      return this.domElementToDataUri(canvasElement as HTMLElement);
    } catch (error) {
      console.error('[CanvaAIService] Error rendering canvas to image:', error);
      return undefined;
    }
  }

  /**
   * Convert a DOM element to a data URI using canvas rendering
   */
  private async domElementToDataUri(element: HTMLElement): Promise<string | undefined> {
    try {
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return undefined;
      }

      // Set canvas size to match element
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      // Get computed styles for background
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;

      // Fill background
      ctx.fillStyle = bgColor || '#ffffff';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Try to render background image if present
      const bgImage = styles.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          await this.drawImageToContext(ctx, urlMatch[1], 0, 0, rect.width, rect.height);
        }
      }

      // Render child elements (simplified - handles images and text)
      await this.renderChildElements(ctx, element, rect);

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('[CanvaAIService] Error converting DOM to data URI:', error);
      return undefined;
    }
  }

  /**
   * Draw an image to a canvas context
   */
  private drawImageToContext(
    ctx: CanvasRenderingContext2D,
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      };
      img.onerror = () => {
        console.warn('[CanvaAIService] Failed to load image for rendering:', imageUrl);
        resolve(); // Don't reject, just continue without the image
      };
      img.src = imageUrl;
    });
  }

  /**
   * Render child elements of a container to the canvas context
   */
  private async renderChildElements(
    ctx: CanvasRenderingContext2D,
    container: HTMLElement,
    containerRect: DOMRect,
  ): Promise<void> {
    const children = container.querySelectorAll('*');

    for (const child of children) {
      const childEl = child as HTMLElement;
      const childRect = childEl.getBoundingClientRect();
      const styles = window.getComputedStyle(childEl);

      // Calculate position relative to container
      const relX = childRect.left - containerRect.left;
      const relY = childRect.top - containerRect.top;

      // Render background images
      const bgImage = styles.backgroundImage;
      if (bgImage && bgImage !== 'none') {
        const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          await this.drawImageToContext(
            ctx,
            urlMatch[1],
            relX,
            relY,
            childRect.width,
            childRect.height,
          );
        }
      }

      // Render text content
      if (
        childEl.textContent
        && childEl.childNodes.length === 1
        && childEl.childNodes[0].nodeType === Node.TEXT_NODE
      ) {
        ctx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
        ctx.fillStyle = styles.color;
        ctx.textBaseline = 'top';
        ctx.fillText(childEl.textContent, relX, relY);
      }
    }
  }

  private async handleGenerateSlide(
    params: GenerateSlideParams,
    requestId: string,
    originalState: OriginalState | null,
    description: string,
    targetCanvasId: number,
  ): Promise<void> {
    // Create pending operation
    const operationId = generateOperationId();

    addPendingOperation({
      id: operationId,
      requestId,
      type: 'generate_slide',
      status: 'in_progress',
      description: 'Creating slide...',
      startedAt: new Date(),
    });

    const allCanvases = canvases.value;

    // Calculate insertAfterCanvasId from position parameter
    let insertAfterCanvasId: number | undefined;
    const { position } = params;
    if (position === 'end') {
      // Insert after the last slide
      insertAfterCanvasId =
        allCanvases.length > 0 ? allCanvases[allCanvases.length - 1].canvasId : undefined;
    } else if (position === 'beginning') {
      // Insert at the beginning (before all slides)
      insertAfterCanvasId = undefined;
    } else if (typeof position === 'number') {
      // Insert after the specified slide number (1-based)
      const slideIndex = position - 1;
      if (slideIndex >= 0 && slideIndex < allCanvases.length) {
        insertAfterCanvasId = allCanvases[slideIndex].canvasId;
      } else if (position <= 0) {
        insertAfterCanvasId = undefined; // Insert at beginning
      } else {
        // Position beyond total slides, insert at end
        insertAfterCanvasId =
          allCanvases.length > 0 ? allCanvases[allCanvases.length - 1].canvasId : undefined;
      }
    }
    // If position not specified, use targetCanvasId (current active slide)

    console.log('🎯 [CanvaAIService] handleGenerateSlide CALLED with:', {
      prompt: params.prompt.substring(0, 50) + '...',
      position,
      insertAfterCanvasId,
      targetCanvasId,
      currentCanvasCount: allCanvases.length,
    });

    // Determine where to insert the new slide
    // Use calculated insertAfterCanvasId, or fall back to targetCanvasId (current active slide)
    const insertAfter =
      position !== undefined ? insertAfterCanvasId : (insertAfterCanvasId ?? targetCanvasId);

    // STAGE 1: Create blank slide immediately with loading state
    const { canvasId: newCanvasId, elementId: placeholderElementId } =
      this.addPlaceholderSlideCanvas(insertAfter);

    // Badge the new thumbnail immediately
    addAIEditingPage(newCanvasId);

    console.log('[CanvaAIService] Placeholder slide created:', {
      newCanvasId,
      placeholderElementId,
    });

    // Set element loading state on the placeholder
    setElementLoadingState(placeholderElementId, {
      status: 'loading',
      message: 'Creating slide...',
    });

    try {
      // Get the first slide's image as reference for style consistency
      const firstSlideImageUrl = await this.getFirstSlideImageUrl();
      console.log(
        '🖼️ [CanvaAIService] First slide reference:',
        firstSlideImageUrl ? 'found' : 'not found',
      );

      // Generate slide image (with reference if available)
      console.log('🖼️ [CanvaAIService] Starting image generation...');
      const result = await falImageService.generateSlideImage(params.prompt, firstSlideImageUrl);
      console.log('✅ [CanvaAIService] Image generated:', result.url.substring(0, 50) + '...');

      // Set AI change flag to prevent duplicate debug history entries
      isAIChange.value = true;

      // STAGE 2: Update the placeholder with the generated image
      updateElementProperty(placeholderElementId, 'style', {
        backgroundImage: `url('${result.url}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      });

      // Reset AI change flag
      isAIChange.value = false;

      // Clear loading state
      setElementLoadingState(placeholderElementId, null);

      console.log('[CanvaAIService] Slide updated with generated image');

      // Mark operation as completed
      updatePendingOperation(operationId, { status: 'completed', completedAt: new Date() });

      // Track the change AFTER async completion
      if (originalState) {
        addChangeToRequest(requestId, {
          id: generateChangeId(),
          toolName: 'generate_slide',
          description,
          targetId: String(newCanvasId),
          timestamp: new Date(),
          originalState,
          appliedState: null,
          reverted: false,
        });
      }

      // Track in debug history system
      const debugAfterState = captureCanvasSnapshot(newCanvasId);
      if (debugAfterState) {
        addDebugHistoryEntry({
          affectedScope: 'page',
          initiationScope: this.currentScope,
          source: 'canva-ai',
          actionType: 'create',
          targetId: String(newCanvasId),
          targetCanvasId: newCanvasId,
          targetElementType: null,
          origin: this.createAIOriginContext(),
          beforeState: { type: 'canvas', canvasData: undefined },
          afterState: debugAfterState,
          description,
          aiMetadata: {
            requestId,
            toolName: 'generate_slide',
            userPrompt: params.prompt,
          },
        });
      }

      // STAGE 3: Asynchronously convert to editable elements (fire-and-forget)
      // This runs in the background - if it succeeds, the slide becomes editable
      // If it fails, the slide remains as a background image (graceful degradation)
      this.convertSlideToElements(newCanvasId, result.url);
    } catch (error) {
      console.error('[CanvaAIService] Error generating slide:', error);

      // Mark operation as error
      updatePendingOperation(operationId, {
        status: 'error',
        error: (error as Error).message,
        completedAt: new Date(),
      });

      // Set error state on the placeholder element
      setElementLoadingState(placeholderElementId, {
        status: 'error',
        message: 'Failed to create slide',
      });
    }
  }

  /**
   * Convert a generated slide image to editable elements (async, fire-and-forget)
   * This runs in the background and updates the canvas if successful
   */
  private async convertSlideToElements(canvasId: number, imageUrl: string): Promise<void> {
    try {
      console.log(`[CanvaAIService] Starting background conversion for canvas ${canvasId}...`);

      const result = await imageToElementsService.convertImageToElements({
        imageUrl,
        canvasWidth: 1067,
        canvasHeight: 600,
      });

      if (result.status === 'success' && result.elements.length > 0) {
        console.log(
          `[CanvaAIService] Conversion successful! Replacing with ${result.elements.length} editable elements`,
        );

        // Replace background image with extracted, editable elements
        handleUpdateCanvasElements(canvasId, result.elements, result.backgroundColor);

        // Queue image generation for any image elements found in the slide
        if (result.imageElementPrompts.size > 0) {
          console.log(
            `[CanvaAIService] Queueing ${result.imageElementPrompts.size} image generations for canvas ${canvasId}`,
          );
          imageGenerationService.queueBatchImageGeneration(canvasId, result.imageElementPrompts);
        }
      } else {
        console.log(
          '[CanvaAIService] Conversion returned no elements, keeping background image',
          result.error,
        );
      }
    } catch (error) {
      console.error(
        '[CanvaAIService] Background conversion failed, keeping background image:',
        error,
      );
      // Graceful degradation - slide remains as background image
    }
  }

  /**
   * Add a placeholder slide canvas (blank with loading state)
   * Returns both the canvas ID and the placeholder element ID
   */
  private addPlaceholderSlideCanvas(insertAfterCanvasId: number): {
    canvasId: number;
    elementId: string;
  } {
    // Record history for undo support
    recordHistory();

    const currentCanvases = canvases.value;
    const maxId = currentCanvases.reduce((max, canvas) => Math.max(max, canvas.canvasId), 0);
    const newId = maxId + 1;
    const elementId = `slide_img_${newId}_${Date.now()}`;

    const newCanvas = {
      canvasId: newId,
      content: `New Slide ${newId}`,
      color: '#F8F5FF', // Light purple background while loading
      elements: [
        {
          elementId,
          type: 'image' as const,
          style: {
            position: 'absolute' as const,
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#F8F5FF', // Light purple placeholder
            zIndex: 1,
          },
        },
      ],
    };

    // Find where to insert
    const insertIndex = currentCanvases.findIndex(c => c.canvasId === insertAfterCanvasId);

    let newCanvases;
    if (insertIndex >= 0) {
      // Insert after the specified canvas
      newCanvases = [
        ...currentCanvases.slice(0, insertIndex + 1),
        newCanvas,
        ...currentCanvases.slice(insertIndex + 1),
      ];
    } else {
      // Append at the end
      newCanvases = [...currentCanvases, newCanvas];
    }

    canvases.value = newCanvases;

    return { canvasId: newId, elementId };
  }

  /**
   * Add a new canvas with a generated slide image as a selectable element
   */
  private addGeneratedSlideCanvas(imageUrl: string, insertAfterCanvasId: number): number {
    // Record history for undo support
    recordHistory();

    const currentCanvases = canvases.value;
    const maxId = currentCanvases.reduce((max, canvas) => Math.max(max, canvas.canvasId), 0);
    const newId = maxId + 1;

    console.log('[CanvaAIService] Creating new canvas:', {
      currentCanvasCount: currentCanvases.length,
      currentCanvasIds: currentCanvases.map(c => c.canvasId),
      maxId,
      newId,
      insertAfterCanvasId,
    });

    const newCanvas = {
      canvasId: newId,
      content: `Generated Slide ${newId}`,
      color: '#FFFFFF',
      elements: [
        {
          elementId: `slide_img_${newId}_${Date.now()}`,
          type: 'image' as const,
          style: {
            position: 'absolute' as const,
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1,
          },
        },
      ],
    };

    // Find where to insert
    const insertIndex = currentCanvases.findIndex(c => c.canvasId === insertAfterCanvasId);

    console.log('[CanvaAIService] Insert position:', {
      insertIndex,
      willInsertAtArrayPosition: insertIndex !== -1 ? insertIndex + 1 : currentCanvases.length,
    });

    let newCanvases: typeof currentCanvases;
    if (insertIndex !== -1) {
      // Insert after the specified canvas
      newCanvases = [...currentCanvases];
      newCanvases.splice(insertIndex + 1, 0, newCanvas);
    } else {
      // Append to end if canvas not found
      newCanvases = [...currentCanvases, newCanvas];
    }

    // Update the canvases signal
    canvases.value = newCanvases;

    console.log('[CanvaAIService] Canvas array updated:', {
      newCanvasCount: canvases.value.length,
      newCanvasIds: canvases.value.map(c => c.canvasId),
    });

    // Select the new canvas
    activeCanvasId.value = newId;
    selectedElementId.value = null;
    selectedElementIds.value = new Set();

    console.log('[CanvaAIService] Active canvas set to:', activeCanvasId.value);

    return newId;
  }
}

// Export singleton instance
export const canvaAIService = new CanvaAIService();
