import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSearchParams, useParams } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { batch } from '@preact/signals-react';
import ReactMarkdown from 'react-markdown';
import { PlusIcon, MicrophoneIcon, XIcon, TextIcon } from '@canva/easel/icons';
import canvaAiLogo from '@/assets/icons/side-menu-icons/canva-ai-logo.svg';
import ArrowRightIcon from '@/pages/home/components/Wonderbox/icons/ArrowRightIcon';
import { useDragToDismiss } from '@/hooks/useDragToDismiss';
import { getPortalTarget } from '@/utils/portalTarget';
import {
  addUserMessageToCurrentThread,
  addMessageToThread,
  updateMessageChanges,
  setActiveThreadId,
  activeThreadId,
  elementThreads,
  threadRequestStates,
  setMobileAIInputFocused,
  mobileAIEditMode,
  selectedElementId,
  activeCanvas,
  clearSelection,
  selectedPageId,
  clearPageSelection,
  activeRequests,
  toggleChange,
  canvases,
  activeCanvasId,
  hasUnsupportedSelection,
  pendingOperations,
  addThreadReference,
  findCanvasIdForElement,
  selectedElementType,
  useDeferredNavigation,
  hasSelection,
  currentEditorMode,
  pendingMobileAIPrompt,
  setPendingMobileAIPrompt,
} from '@/store';
import type { ChatMessage } from '@/store';
import { captureImageThumbnail, docsSelectedText, clearDocsSelectedText } from '@/store';
import { MiniElementPreview } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/MiniElementPreview';
import { MiniCanvas } from '@/pages/Editor/components/PageNavigator/MiniCanvas';
import { canvaAIService, docsAIService, interactivePageAIService } from '@/services/canva-ai';
import { AIProgressIndicator } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/AIProgressIndicator';
import { ThreadReferenceCard } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/ThreadReferenceCard';
import { LearningContentSuggestions } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/LearningContentSuggestions';
import { DesignSchoolThinkingTip } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/DesignSchoolThinkingTip';
import { LearningContentLoading } from '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/LearningContentLoading';
import {
  isLogoDesignHowToPrompt,
  requestLogoDesignLearningContent,
} from '@/services/design-school';
import '@/pages/Editor/components/ObjectPanel/content/CanvaAIContent/CanvaAIContent.css';
import styles from './MobileCanvaAIPanel.module.css';

interface MobileCanvaAIPanelProps {
  onClose: () => void;
}

// Render markdown content with ReactMarkdown
const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      // Style links
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.markdownLink}>
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

// Pending Operations Indicator — shows live operation descriptions during streaming
const PendingOperationsIndicator = ({ requestId }: { requestId: string }): React.ReactNode => {
  const allOps = pendingOperations.value;
  const pending = Array.from(allOps.values()).filter(
    op => op.requestId === requestId && op.status === 'in_progress',
  );
  if (pending.length === 0) return null;

  return (
    <div className="canva-ai-pending-operations">
      {pending.map(op => (
        <div key={op.id} className="canva-ai-pending-item">
          <span className="canva-ai-pending-text">{op.description}</span>
        </div>
      ))}
    </div>
  );
};

export default function MobileCanvaAIPanel({ onClose }: MobileCanvaAIPanelProps): React.ReactNode {
  useSignals();

  const [searchParams, setSearchParams] = useSearchParams();
  const { doctype } = useParams();
  const editorMode = currentEditorMode.value;
  const isDocsMode = (doctype ?? 'presentation').toLowerCase() === 'docs' || editorMode === 'docs';
  const isInteractivePageMode =
    (doctype ?? 'presentation').toLowerCase() === 'interactive-page'
    || editorMode === 'interactive-page';
  // Select the appropriate AI service (docs/interactive-page use different services)
  const aiService = isInteractivePageMode
    ? interactivePageAIService
    : isDocsMode
      ? docsAIService
      : canvaAIService;
  const [inputValue, setInputValue] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [hasTriggeredCreate, setHasTriggeredCreate] = useState(false);

  // Deferred navigation: tracks whether the user has explicitly committed to an element thread
  const deferredNav = useDeferredNavigation.value && !isDocsMode && !isInteractivePageMode;
  const [committedThreadId, setCommittedThreadId] = useState<string | null>(null);

  // Compute thread ID synchronously on mount to check for existing messages
  // This ensures we know if the thread has content before deciding on auto-focus
  const getThreadIdForSelection = () => {
    // Docs mode always uses 'docs' thread (no element/page selection)
    if (isDocsMode) return 'docs';
    // Interactive page mode uses its own thread
    if (isInteractivePageMode) return 'interactive-page';
    const elementId = selectedElementId.value;
    const pageId = selectedPageId.value;
    const isUnsupported = hasUnsupportedSelection.value;
    // Unsupported elements use presentation thread
    if (elementId && !isUnsupported) return elementId;
    if (pageId !== null && !isUnsupported) return `page:${pageId}`;
    return 'presentation';
  };

  const getMessagesForThread = (threadId: string) => {
    return elementThreads.value[threadId]?.messages ?? [];
  };

  const [wantsExpandedChat, setWantsExpandedChat] = useState(() => {
    // When deferred nav is on, check the effective thread (presentation until committed)
    const selThread = getThreadIdForSelection();
    const effectiveThread =
      deferredNav && selThread !== 'presentation' ? 'presentation' : selThread;
    const hasMessages = getMessagesForThread(effectiveThread).length > 0;
    return hasMessages;
  });
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track if we should auto-focus (for element, page, or presentation level with no messages)
  // Uses direct thread lookup to ensure we check the correct thread on mount
  const shouldAutoFocus = useRef(
    (() => {
      const selThread = getThreadIdForSelection();
      const effectiveThread =
        deferredNav && selThread !== 'presentation' ? 'presentation' : selThread;
      const hasMessages = getMessagesForThread(effectiveThread).length > 0;
      return !hasMessages;
    })(),
  );

  // Get current selection state
  const currentElementId = selectedElementId.value;
  const currentPageId = selectedPageId.value;
  const isUnsupported = hasUnsupportedSelection.value;
  // Convert canvas ID to page number (1-indexed array position) for MiniCanvas
  const pageNumber = canvases.value.findIndex(c => c.canvasId === activeCanvasId.value) + 1 || 1;

  // Compute the thread ID that selection alone would produce
  const selectionThreadId = isDocsMode
    ? 'docs'
    : isInteractivePageMode
      ? 'interactive-page'
      : currentElementId && !isUnsupported
        ? currentElementId
        : currentPageId !== null && !isUnsupported
          ? `page:${currentPageId}`
          : 'presentation';

  // Derive effective thread ID:
  // - Deferred nav OFF → use selectionThreadId (current behavior)
  // - Deferred nav ON + committed matches selection → stay on element thread
  // - Deferred nav ON + no commit → use 'presentation' (show main thread)
  const threadId = !deferredNav
    ? selectionThreadId
    : committedThreadId !== null && committedThreadId === selectionThreadId
      ? committedThreadId
      : 'presentation';

  // Reset committedThreadId when the selection changes to a different element
  useEffect(() => {
    if (!deferredNav) return;
    if (committedThreadId !== null && selectionThreadId !== committedThreadId) {
      setCommittedThreadId(null);
    }
  }, [deferredNav, selectionThreadId, committedThreadId]);

  // Sync active thread ID immediately so handleSubmit uses the correct thread
  if (activeThreadId.value !== threadId) {
    setActiveThreadId(threadId);
  }

  // Get messages directly using local threadId (not from activeThreadId)
  const messages = elementThreads.value[threadId]?.messages ?? [];

  // Render-time dedupe for Design School learning content — see the
  // matching block in `CanvaAIContent` (desktop). Pin display to the
  // FIRST message *index* in the thread that carries learning content
  // (loaded or still loading). Indexed (not id-keyed) so id collisions
  // can never re-introduce duplicate cards.
  const learningContentDisplayIndex = messages.findIndex(
    msg => msg.learningContent || msg.learningContentLoading,
  );

  // Get thread state directly using local threadId (not from activeThreadId)
  const defaultThreadState = {
    isStreaming: false,
    streamingContent: '',
    isDesigning: false,
    designingMessage: '',
    currentRequestId: null,
    error: null,
    isGeneratingImage: false,
    imageGenerationMessage: '',
    designProgress: null,
  };
  const threadState = threadRequestStates.value[threadId] ?? defaultThreadState;
  // When deferred nav is active and an element is selected (but not committed),
  // check streaming on the selection thread so the input unlocks for element requests
  // while the main thread is still processing.
  const streamingThreadId =
    deferredNav && selectionThreadId !== threadId ? selectionThreadId : threadId;
  const streamingThreadState =
    streamingThreadId !== threadId
      ? (threadRequestStates.value[streamingThreadId] ?? defaultThreadState)
      : threadState;
  const isCurrentThreadStreaming = streamingThreadState.isStreaming;
  const streamingContent = threadState.streamingContent;
  const currentRequestId = threadState.currentRequestId;
  const isGeneratingImage = threadState.isGeneratingImage;
  const imageGenerationMessage = threadState.imageGenerationMessage;

  // Docs text selection state
  const docsSelection = isDocsMode ? docsSelectedText.value : null;

  // Compute selectedElement locally from canvasState
  const currentElement =
    activeCanvas.value?.elements?.find(el => el.elementId === currentElementId) || null;

  // Get keyboard state from the signal
  const keyboardOpen = mobileAIEditMode.value.keyboardOpen;

  // Collapse to compact mode when keyboard is open
  const showExpandedChat = wantsExpandedChat && !keyboardOpen;

  // Update expanded state based on messages - same behavior for page and element selection
  useEffect(() => {
    if (messages.length > 0) {
      setWantsExpandedChat(true);
    } else {
      setWantsExpandedChat(false);
    }
  }, [currentElement, currentPageId, messages.length]);

  // Track compact input focus state for hiding other UI elements
  const [isCompactInputFocused, setIsCompactInputFocused] = useState(false);

  // Update global signals when compact input focus changes
  useEffect(() => {
    const showCompact = (currentElement || currentPageId !== null) && !showExpandedChat;
    setMobileAIInputFocused(showCompact && isCompactInputFocused);
  }, [currentElement, currentPageId, showExpandedChat, isCompactInputFocused]);

  // Drag-to-dismiss hook for full panel mode
  const { dragHandleProps, panelStyle } = useDragToDismiss({
    onDismiss: onClose,
    panelHeight: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
  });

  // Pick up a prompt that was typed into the Canva AI flyout's
  // `MobileWonderbox` in `MobilePrimaryNav`. That surface can't call our
  // `handleSubmit` directly because this panel mounts only when
  // `aiPanelOpen` flips to `true`; instead it stashes the trimmed prompt
  // on the `pendingMobileAIPrompt` signal and opens us, and we drain it
  // here on the very next effect tick.
  //
  // React 18 StrictMode runs `useEffect` twice on mount in dev. Both
  // invocations share the same closure, so without a guard we'd call
  // `handleSubmit` twice and end up with two user messages, two AI
  // responses, and two stacked Design School card sets in the thread. The
  // ref tracks the most recently consumed prompt; we reset it whenever
  // the signal goes back to `null` so a *legitimate* re-submit of the
  // same string later in the session still goes through.
  const pendingPrompt = pendingMobileAIPrompt.value;
  const consumedPromptRef = useRef<string | null>(null);
  useEffect(() => {
    if (!pendingPrompt) {
      consumedPromptRef.current = null;
      return;
    }
    if (consumedPromptRef.current === pendingPrompt) return;
    consumedPromptRef.current = pendingPrompt;
    setPendingMobileAIPrompt(null);
    handleSubmit(pendingPrompt);
    // `handleSubmit` is intentionally omitted from deps: it's recreated on
    // every render and we only want this effect to fire on signal change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Handle ?create query param - auto-trigger request from home page
  useEffect(() => {
    const shouldCreate = searchParams.has('create');
    if (shouldCreate && !hasTriggeredCreate && !isCurrentThreadStreaming) {
      // Get the last user message from the current mode's thread
      const sourceThread = isDocsMode ? 'docs' : 'presentation';
      const presentationMessages = elementThreads.value[sourceThread]?.messages ?? [];
      const lastUserMessage = [...presentationMessages].reverse().find(m => m.role === 'user');

      if (lastUserMessage) {
        setHasTriggeredCreate(true);

        // Remove the ?create param from URL
        searchParams.delete('create');
        setSearchParams(searchParams, { replace: true });

        // Expand chat to show the response
        setWantsExpandedChat(true);

        // Trigger the AI request with the message from home page
        aiService.processRequest(lastUserMessage.content, {
          onComplete: completedRequestId => {
            const request = activeRequests.value.get(completedRequestId);
            if (request?.changes && request.changes.length > 0) {
              setExpandedChanges(prev => new Set([...prev, completedRequestId]));
            }
          },
          onError: error => {
            console.error('[MobileCanvaAI] Error from home page request:', error);
          },
        });
      }
    }
  }, [searchParams, hasTriggeredCreate, isCurrentThreadStreaming, setSearchParams]);

  // Transfer focus from proxy input to real input on mount (iOS keyboard trick)
  // When shouldAutoFocus is true and keyboard is already open (from proxy),
  // focusing the real input keeps the keyboard open
  useEffect(() => {
    if (shouldAutoFocus.current && inputRef.current) {
      // Use requestAnimationFrame to ensure component is fully rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, []);

  const handleGoToThread = (goToThreadId: string) => {
    // In deferred nav mode, also commit to the target thread
    if (deferredNav) {
      setCommittedThreadId(goToThreadId);
    }

    batch(() => {
      if (goToThreadId.startsWith('page:')) {
        const pageId = parseInt(goToThreadId.replace('page:', ''), 10);
        const canvas = canvases.value.find(c => c.canvasId === pageId);
        if (canvas) {
          activeCanvasId.value = canvas.canvasId;
          selectedElementId.value = null;
          selectedElementType.value = null;
          selectedPageId.value = pageId;
        }
      } else {
        // Element thread — find which canvas owns this element
        const canvasId = findCanvasIdForElement(goToThreadId);
        if (canvasId != null) {
          activeCanvasId.value = canvasId;
        }
        // Find element data and select it
        for (const canvas of canvases.value) {
          const element = canvas.elements?.find(el => el.elementId === goToThreadId);
          if (element) {
            selectedElementId.value = element.elementId;
            selectedElementType.value = element.type;
            selectedPageId.value = null;
            break;
          }
        }
      }
    });
  };

  const handleSubmit = async (messageOverride?: string) => {
    // Allow callers (e.g. the `pendingMobileAIPrompt` handoff from
    // `MobilePrimaryNav`'s wonderbox) to submit a prompt without first
    // routing it through `inputValue` state. Falls back to the input field
    // when no override is provided.
    const candidate = messageOverride ?? inputValue;
    if (candidate.trim() && !isCurrentThreadStreaming) {
      const userMessage = candidate.trim();

      // Capture docs text selection before clearing
      const capturedDocsSelection = docsSelection ? { ...docsSelection } : null;

      if (isDocsMode) {
        // Docs mode: add message to docs thread directly
        addMessageToThread(userMessage, 'user', 'docs', {
          quotedText: capturedDocsSelection?.text,
        });
        if (capturedDocsSelection) {
          clearDocsSelectedText();
        }
      } else if (
        deferredNav
        && threadId === 'presentation'
        && selectionThreadId !== 'presentation'
      ) {
        // Deferred navigation: we're on the design thread with an element selected.
        // Commit to the element thread on submit.
        const targetThread = selectionThreadId;

        // Capture snapshot of selected element before sending
        const elementSnapshot = isUnsupported ? undefined : captureImageThumbnail(currentElement);

        // Commit: navigate to element thread
        setCommittedThreadId(targetThread);
        setActiveThreadId(targetThread);

        // Add user message to the element's thread (not presentation)
        addMessageToThread(userMessage, 'user', targetThread, { elementSnapshot });

        // Add thread reference card to presentation thread
        const element = currentElement;
        const isPageThread = targetThread.startsWith('page:');
        let label: string;
        if (isPageThread) {
          label = `Page ${pageNumber}`;
        } else if (element?.type === 'text' && element.content) {
          const preview =
            element.content.length > 30
              ? element.content.substring(0, 30) + '...'
              : element.content;
          label = `Text: ${preview}`;
        } else {
          label = element ? getElementLabel(element.type) : 'Element';
        }
        const type = isPageThread ? 'page' : (element?.type ?? 'element');

        let thumbnailUrl: string | undefined;
        if (element?.type === 'image') {
          const bgImage = element.style?.backgroundImage;
          const urlMatch =
            typeof bgImage === 'string' ? bgImage.match(/url\(['"]?([^'"]+)['"]?\)/) : null;
          thumbnailUrl = urlMatch?.[1];
        }

        addThreadReference(
          targetThread,
          type,
          label,
          thumbnailUrl,
          isPageThread ? pageNumber : undefined,
        );
      } else {
        // Capture snapshot of selected element before sending (for images)
        // Don't capture for unsupported elements - treat as presentation level
        const elementSnapshot = isUnsupported ? undefined : captureImageThumbnail(currentElement);
        // Add message to current element's thread with snapshot
        addUserMessageToCurrentThread(userMessage, { elementSnapshot });

        // Add a thread reference card to the presentation thread (deduped per threadId)
        if (threadId !== 'presentation') {
          const element = currentElement;
          const isPageThread = threadId.startsWith('page:');
          let label: string;
          if (isPageThread) {
            label = `Page ${pageNumber}`;
          } else if (element?.type === 'text' && element.content) {
            const preview =
              element.content.length > 30
                ? element.content.substring(0, 30) + '...'
                : element.content;
            label = `Text: ${preview}`;
          } else {
            label = element ? getElementLabel(element.type) : 'Element';
          }
          const type = isPageThread ? 'page' : (element?.type ?? 'element');

          let thumbnailUrl: string | undefined;
          if (element?.type === 'image') {
            const bgImage = element.style?.backgroundImage;
            const urlMatch =
              typeof bgImage === 'string' ? bgImage.match(/url\(['"]?([^'"]+)['"]?\)/) : null;
            thumbnailUrl = urlMatch?.[1];
          }

          addThreadReference(
            threadId,
            type,
            label,
            thumbnailUrl,
            isPageThread ? pageNumber : undefined,
          );
        }
      }
      const shouldSuggestLogoLessons = isLogoDesignHowToPrompt(userMessage);
      const learningTargetThreadId = activeThreadId.value;

      setInputValue('');

      // Always expand to full chat view after submit
      if (!wantsExpandedChat) {
        setWantsExpandedChat(true);
      }

      // Always blur input after submit to dismiss keyboard and show expanded view
      setTimeout(() => {
        inputRef.current?.blur();
      }, 50);

      // Service manages all streaming state per-thread
      // Callbacks are optional for component-specific behavior
      const selectedContext = capturedDocsSelection
        ? { blockId: capturedDocsSelection.blockId, selectedText: capturedDocsSelection.text }
        : undefined;

      try {
        const requestId = await aiService.processRequest(
          userMessage,
          {
            onNotification: message => {
              console.log('[CanvaAI Mobile] Notification:', message);
            },
            onToolStart: toolName => {
              console.log('[CanvaAI Mobile] Tool started:', toolName);
            },
            onToolEnd: (toolName, result) => {
              console.log('[CanvaAI Mobile] Tool completed:', toolName, result);
            },
            onComplete: completedRequestId => {
              // Auto-expand changes for this new message
              const request = activeRequests.value.get(completedRequestId);
              if (request?.changes && request.changes.length > 0) {
                setExpandedChanges(prev => new Set([...prev, completedRequestId]));
              }
              if (shouldSuggestLogoLessons) {
                // `requestLogoDesignLearningContent` owns the full
                // dedupe + placeholder + content swap flow with a
                // synchronous race guard, so the cards never duplicate
                // even if `onComplete` fires more than once for the same
                // prompt (StrictMode, double-tap Send, retries).
                requestLogoDesignLearningContent(learningTargetThreadId);
              }
            },
            onError: error => {
              console.error('[CanvaAI Mobile] Error:', error);
            },
          },
          undefined,
          selectedContext,
        );
      } catch (error) {
        console.error('[MobileCanvaAIPanel] Error processing request:', error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleToggleChange = (messageId: string, requestId: string, changeId: string) => {
    // Toggle the change in the aiRequests state (this applies/reverts the change)
    toggleChange(requestId, changeId);

    // Update the message's changes to reflect the new state
    const request = activeRequests.value.get(requestId);
    if (request) {
      updateMessageChanges(activeThreadId.value, messageId, request.changes);
    }
  };

  const toggleChangesExpanded = (requestId: string) => {
    setExpandedChanges(prev => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  };

  const renderMessageChanges = (msg: ChatMessage) => {
    if (!msg.changes || msg.changes.length === 0) return null;

    return (
      <div className={styles.changesListSimple}>
        {msg.changes.map(change => (
          <div key={change.id} className={styles.changeItemSimple}>
            • {change.description}
          </div>
        ))}
      </div>
    );
  };

  // Determine if this message should show the avatar
  const shouldShowAvatar = (index: number, currentRole: string) => {
    if (currentRole !== 'assistant') return false;
    if (index === 0) return true;
    for (let i = index - 1; i >= 0; i--) {
      const prevRole = messages[i].role;
      if (prevRole === 'element') continue;
      return prevRole !== 'assistant';
    }
    return true;
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    // Skip element messages - we show current selection separately
    if (msg.role === 'element') {
      return null;
    }

    // Render thread reference cards (compact mode for mobile)
    if (msg.threadRef) {
      return (
        <ThreadReferenceCard
          key={msg.id}
          threadRef={msg.threadRef}
          onGoToThread={handleGoToThread}
          compact
        />
      );
    }

    if (msg.role === 'user') {
      return (
        <div key={msg.id} className={styles.userMessageWrapper}>
          <div className={styles.userMessage}>
            {msg.content}
            {msg.quotedText && (
              <div className="canva-ai-quoted-text">
                {msg.quotedText.length > 250
                  ? msg.quotedText.substring(0, 250) + '...'
                  : msg.quotedText}
              </div>
            )}
            {msg.elementSnapshot?.thumbnailUrl && (
              <img
                src={msg.elementSnapshot.thumbnailUrl}
                alt={msg.elementSnapshot.label}
                className={styles.messageThumbnail}
              />
            )}
          </div>
        </div>
      );
    }

    const showAvatar = shouldShowAvatar(index, msg.role);

    return (
      <React.Fragment key={msg.id}>
        <div className="canva-ai-assistant-message">
          {showAvatar && (
            <div className="canva-ai-assistant-avatar">
              <img src={canvaAiLogo} alt="Canva AI" className="canva-ai-assistant-avatar-icon" />
            </div>
          )}
          <div className={`canva-ai-assistant-content ${showAvatar ? 'with-avatar' : 'no-avatar'}`}>
            {msg.content && (
              <div className="canva-ai-assistant-text">
                <MarkdownContent content={msg.content} />
              </div>
            )}
            {index === learningContentDisplayIndex && msg.learningContentLoading && (
              <LearningContentLoading />
            )}
            {index === learningContentDisplayIndex
              && msg.learningContent
              && msg.learningContent.length > 0 && (
                <LearningContentSuggestions items={msg.learningContent} />
              )}
            {msg.designSummary && (
              <AIProgressIndicator
                designProgress={null}
                designSummary={msg.designSummary}
                isStreaming={false}
                threadId={threadId}
              />
            )}
          </div>
        </div>
        {!msg.designSummary && renderMessageChanges(msg)}
      </React.Fragment>
    );
  };

  const renderStreamingMessage = () => {
    // Only show streaming in the current thread (state from store)
    if (!isCurrentThreadStreaming) return null;

    return (
      <>
        {/* Streaming text with avatar */}
        {streamingContent && (
          <div className="canva-ai-assistant-message">
            <div className="canva-ai-assistant-avatar">
              <img src={canvaAiLogo} alt="Canva AI" className="canva-ai-assistant-avatar-icon" />
            </div>
            <div className="canva-ai-assistant-content with-avatar">
              <div className="canva-ai-assistant-text">
                <MarkdownContent content={streamingContent} />
              </div>
            </div>
          </div>
        )}
        {/* Progress indicator — standalone below text, or with avatar if no text yet */}
        <div className={streamingContent ? 'ai-progress-standalone' : 'canva-ai-assistant-message'}>
          {!streamingContent && (
            <div className="canva-ai-assistant-avatar">
              <img src={canvaAiLogo} alt="Canva AI" className="canva-ai-assistant-avatar-icon" />
            </div>
          )}
          <div className={streamingContent ? undefined : 'canva-ai-assistant-content with-avatar'}>
            <AIProgressIndicator
              designProgress={threadState.designProgress}
              isStreaming={true}
              threadId={threadId}
            />
            {/*
             * Bite-sized Design School tip that fills the AI's wait
             * time with a piece of just-in-time presentation-design
             * learning. Mirrors the desktop placement (rendered next
             * to the "Thinking…" indicator inside the streaming
             * progress slot). Tip is selected once per mount inside
             * `DesignSchoolThinkingTip`, so it stays put for the
             * duration of this thinking session.
             */}
            <DesignSchoolThinkingTip />
          </div>
        </div>
        {/* Pending operations indicator */}
        {currentRequestId && <PendingOperationsIndicator requestId={currentRequestId} />}
      </>
    );
  };

  // Get display label for the selected element type
  const getElementLabel = (type: string) => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'image':
        return 'Image';
      case 'shape':
        return 'Shape';
      case 'video':
        return 'Video';
      case 'html':
        return 'Element';
      default:
        return 'Element';
    }
  };

  // Render selection bar content: text elements show icon + truncated content,
  // other elements show thumbnail preview + type label
  const isTextElement = currentElement?.type === 'text';
  const textPreview =
    isTextElement && currentElement?.content
      ? currentElement.content.length > 25
        ? currentElement.content.substring(0, 25) + '…'
        : currentElement.content
      : '';

  const renderSelectionBarContent = () => {
    if (isTextElement) {
      return (
        <>
          <TextIcon size="small" />
          <span className={styles.selectionBarLabel}>Selected text: {textPreview}</span>
        </>
      );
    }
    return (
      <>
        <div className={styles.thumbnailBar}>
          <MiniElementPreview element={currentElement!} />
        </div>
        <span className={styles.selectionBarLabel}>
          Selected {getElementLabel(currentElement!.type).toLowerCase()}
        </span>
      </>
    );
  };

  // Determine thumbnail aspect ratio based on element dimensions
  const getThumbnailClass = () => {
    if (!currentElement) return styles.thumbnailLandscape;
    const width =
      typeof currentElement.style?.width === 'number' ? currentElement.style.width : 200;
    const height =
      typeof currentElement.style?.height === 'number' ? currentElement.style.height : 100;
    const aspectRatio = width / height;

    if (aspectRatio > 1.2) return styles.thumbnailLandscape;
    if (aspectRatio < 0.8) return styles.thumbnailPortrait;
    return styles.thumbnailSquare;
  };

  // Show compact selection panel when there's an element or page selection and chat isn't expanded yet
  // Unsupported elements should NOT show element selection (treat as presentation level)
  const showCompactElementSelection = currentElement && !isUnsupported && !showExpandedChat;
  const showCompactPageSelection = currentPageId !== null && !currentElement && !showExpandedChat;
  // Show compact presentation input when no element/page is selected, or when unsupported element is selected
  // Docs mode skips compact input entirely — goes straight to full panel
  const showCompactPresentationInput =
    ((!currentElement && currentPageId === null) || isUnsupported)
    && !showExpandedChat
    && !isDocsMode;

  // Page selection mode: compact card with page thumbnail
  // Portal to document.body for proper z-index stacking with ResizeHandlesPortal
  if (showCompactPageSelection) {
    return ReactDOM.createPortal(
      <div className={styles.selectionPanel} data-keyboard-open={keyboardOpen ? 'true' : 'false'}>
        {/* Full-width selection bar */}
        <div className={styles.selectionChipWrapper}>
          <div className={styles.selectionBar}>
            <div className={styles.thumbnailBar}>
              <MiniCanvas pageNumber={pageNumber} doctype="presentation" />
            </div>
            <span className={styles.selectionBarLabel}>Selected page</span>
            <button
              type="button"
              className={styles.selectionBarClose}
              onClick={clearPageSelection}
              aria-label="Remove page selection"
            >
              <XIcon size="small" />
            </button>
          </div>
        </div>
        <div className={styles.inputRow}>
          <button className={styles.iconButton} aria-label="Add attachment">
            <PlusIcon size="medium" />
          </button>

          <input
            ref={inputRef}
            type="text"
            className={styles.textInput}
            placeholder={
              isCurrentThreadStreaming ? 'Processing...' : 'How do you want to edit this page?'
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsInputFocused(true);
              setIsCompactInputFocused(true);
              setTimeout(() => {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }, 100);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              setIsCompactInputFocused(false);
              if (mobileAIEditMode.value.keyboardOpen) {
                setWantsExpandedChat(true);
              }
            }}
            autoFocus={shouldAutoFocus.current}
            disabled={isCurrentThreadStreaming}
          />

          {inputValue.trim().length > 0 ? (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              aria-label="Send message"
              disabled={isCurrentThreadStreaming}
            >
              <ArrowRightIcon size={20} />
            </button>
          ) : (
            <button className={styles.iconButton} aria-label="Voice input">
              <MicrophoneIcon size="medium" />
            </button>
          )}
        </div>
      </div>,
      getPortalTarget(),
    );
  }

  // Element selection mode: minimal compact card with no overlay/header
  // Portal to document.body for proper z-index stacking with ResizeHandlesPortal
  if (showCompactElementSelection) {
    return ReactDOM.createPortal(
      <div className={styles.selectionPanel} data-keyboard-open={keyboardOpen ? 'true' : 'false'}>
        {/* Full-width selection bar */}
        <div className={styles.selectionChipWrapper}>
          <div className={styles.selectionBar}>
            {renderSelectionBarContent()}
            <button
              type="button"
              className={styles.selectionBarClose}
              onClick={clearSelection}
              aria-label={`Remove ${getElementLabel(currentElement.type)} selection`}
            >
              <XIcon size="small" />
            </button>
          </div>
        </div>
        <div className={styles.inputRow}>
          <button className={styles.iconButton} aria-label="Add attachment">
            <PlusIcon size="medium" />
          </button>

          <input
            ref={inputRef}
            type="text"
            className={styles.textInput}
            placeholder={
              isCurrentThreadStreaming ? 'Processing...' : 'How would you like to edit this?'
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsInputFocused(true);
              setIsCompactInputFocused(true);
              setTimeout(() => {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }, 100);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              setIsCompactInputFocused(false);
              if (mobileAIEditMode.value.keyboardOpen) {
                setWantsExpandedChat(true);
              }
            }}
            autoFocus={shouldAutoFocus.current}
            disabled={isCurrentThreadStreaming}
          />

          {inputValue.trim().length > 0 ? (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              aria-label="Send message"
              disabled={isCurrentThreadStreaming}
            >
              <ArrowRightIcon size={20} />
            </button>
          ) : (
            <button className={styles.iconButton} aria-label="Voice input">
              <MicrophoneIcon size="medium" />
            </button>
          )}
        </div>
      </div>,
      getPortalTarget(),
    );
  }

  // Presentation level mode (no element/page selected): compact input without chip
  // Portal to document.body for proper z-index stacking with ResizeHandlesPortal
  if (showCompactPresentationInput) {
    return ReactDOM.createPortal(
      <div className={styles.selectionPanel} data-keyboard-open={keyboardOpen ? 'true' : 'false'}>
        <div className={styles.inputRow}>
          <button className={styles.iconButton} aria-label="Add attachment">
            <PlusIcon size="medium" />
          </button>

          <input
            ref={inputRef}
            type="text"
            className={styles.textInput}
            placeholder={
              isCurrentThreadStreaming
                ? 'Processing...'
                : isDocsMode
                  ? 'Ask me anything'
                  : 'What do you want to create?'
            }
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsInputFocused(true);
              setIsCompactInputFocused(true);
              setTimeout(() => {
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
              }, 100);
            }}
            onBlur={() => {
              setIsInputFocused(false);
              setIsCompactInputFocused(false);
              // Only expand if keyboard was actually open (user deliberately closed it)
              if (mobileAIEditMode.value.keyboardOpen) {
                setWantsExpandedChat(true);
              }
            }}
            autoFocus={shouldAutoFocus.current}
            disabled={isCurrentThreadStreaming}
          />

          {inputValue.trim().length > 0 ? (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              aria-label="Send message"
              disabled={isCurrentThreadStreaming}
            >
              <ArrowRightIcon size={20} />
            </button>
          ) : (
            <button className={styles.iconButton} aria-label="Voice input">
              <MicrophoneIcon size="medium" />
            </button>
          )}
        </div>
      </div>,
      getPortalTarget(),
    );
  }

  // Full panel mode: with drag handle, chat history, and optional selection chip
  // Backdrop only covers top toolbar area - canvas remains interactive for element selection
  // Portal to document.body for proper z-index stacking with ResizeHandlesPortal
  return ReactDOM.createPortal(
    <>
      <div className={styles.toolbarBackdrop} onClick={onClose} />
      <div className={styles.panel} style={panelStyle}>
        <div className={styles.dragHandle} {...dragHandleProps}>
          <div className={styles.dragIndicator} />
        </div>

        {/* Thread header — only when committed to a subthread (not presentation) */}
        {!isDocsMode && threadId !== 'presentation' && currentElement && !isUnsupported && (
          <div className={styles.threadHeader}>
            {isTextElement ? (
              <TextIcon size="small" />
            ) : (
              <div className={styles.thumbnailBar}>
                <MiniElementPreview element={currentElement} />
              </div>
            )}
            <span className={styles.threadHeaderLabel}>
              {isTextElement
                ? `Selected text: ${textPreview}`
                : `Selected ${getElementLabel(currentElement.type).toLowerCase()}`}
            </span>
            <button
              type="button"
              className={styles.threadHeaderClose}
              onClick={() => {
                if (deferredNav) setCommittedThreadId(null);
                clearSelection();
              }}
              aria-label={`Dismiss ${getElementLabel(currentElement.type)} selection`}
            >
              <XIcon size="small" />
            </button>
          </div>
        )}
        {!isDocsMode
          && threadId !== 'presentation'
          && currentPageId !== null
          && !currentElement
          && !isUnsupported && (
            <div className={styles.threadHeader}>
              <div className={styles.thumbnailBar}>
                <MiniCanvas pageNumber={pageNumber} doctype="presentation" />
              </div>
              <span className={styles.threadHeaderLabel}>Selected page</span>
              <button
                type="button"
                className={styles.threadHeaderClose}
                onClick={() => {
                  if (deferredNav) setCommittedThreadId(null);
                  clearPageSelection();
                }}
                aria-label="Dismiss page selection"
              >
                <XIcon size="small" />
              </button>
            </div>
          )}

        <div className={styles.chatArea} ref={chatAreaRef}>
          {messages.length === 0 && !isCurrentThreadStreaming && !isGeneratingImage ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateText}>
                Ask me anything about your design or how I can help you create something amazing!
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => renderMessage(msg, index))}
              {renderStreamingMessage()}
              {/* Image generation indicator - persists after streaming ends until FAL completes */}
              {isGeneratingImage && !isCurrentThreadStreaming && (
                <div className="canva-ai-assistant-message">
                  <div className="canva-ai-assistant-avatar">
                    <img
                      src={canvaAiLogo}
                      alt="Canva AI"
                      className="canva-ai-assistant-avatar-icon"
                    />
                  </div>
                  <div className="canva-ai-assistant-content with-avatar">
                    <span className="canva-ai-designing-text">
                      {imageGenerationMessage || 'Creating image...'}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className={isInputFocused ? styles.inputAreaFocused : styles.inputArea}>
          {/* Selection chip above input — before committing to subthread */}
          {!isDocsMode && threadId === 'presentation' && currentElement && !isUnsupported && (
            <div className={styles.selectionBar}>
              {renderSelectionBarContent()}
              <button
                type="button"
                className={styles.selectionBarClose}
                onClick={clearSelection}
                aria-label={`Remove ${getElementLabel(currentElement.type)} selection`}
              >
                <XIcon size="small" />
              </button>
            </div>
          )}
          {!isDocsMode
            && threadId === 'presentation'
            && currentPageId !== null
            && !currentElement
            && !isUnsupported && (
              <div className={styles.selectionBar}>
                <div className={styles.thumbnailBar}>
                  <MiniCanvas pageNumber={pageNumber} doctype="presentation" />
                </div>
                <span className={styles.selectionBarLabel}>Selected page</span>
                <button
                  type="button"
                  className={styles.selectionBarClose}
                  onClick={clearPageSelection}
                  aria-label="Remove page selection"
                >
                  <XIcon size="small" />
                </button>
              </div>
            )}
          {/* Show docs text selection chip */}
          {docsSelection && (
            <div className="canva-ai-26-selected-design-chip">
              <div className="canva-ai-26-chip-thumbnail canva-ai-26-chip-thumbnail--docs-text">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 6h16M4 12h10M4 18h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="canva-ai-26-chip-label">
                {docsSelection.text.length > 25
                  ? docsSelection.text.substring(0, 25) + '...'
                  : docsSelection.text}
              </span>
              <button
                type="button"
                className={styles.chipCloseButton}
                onClick={() => {
                  clearDocsSelectedText();
                  window.getSelection()?.removeAllRanges();
                }}
                aria-label="Remove text selection"
              >
                <XIcon size="small" />
              </button>
            </div>
          )}
          <div className={styles.inputRow}>
            <button className={styles.iconButton} aria-label="Add attachment">
              <PlusIcon size="medium" />
            </button>

            <input
              ref={inputRef}
              type="text"
              className={styles.textInput}
              placeholder={
                isCurrentThreadStreaming
                  ? 'Processing...'
                  : (currentElement && !isUnsupported) || (currentPageId !== null && !isUnsupported)
                    ? 'How would you like to edit this?'
                    : 'Ask me anything'
              }
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              disabled={isCurrentThreadStreaming}
            />

            {inputValue.trim().length > 0 ? (
              <button
                className={styles.submitButton}
                onClick={handleSubmit}
                aria-label="Send message"
                disabled={isCurrentThreadStreaming}
              >
                <ArrowRightIcon size={20} />
              </button>
            ) : (
              <button className={styles.iconButton} aria-label="Voice input">
                <MicrophoneIcon size="medium" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    getPortalTarget(),
  );
}
