import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { batch } from '@preact/signals-react';
import ReactMarkdown from 'react-markdown';
import {
  addUserMessageToCurrentThread,
  updateMessageChanges,
  setActiveThreadId,
  activeThreadId,
  presentationTitle,
  activeCanvasId,
  selectedElement,
  selectedElementId,
  selectedElementType,
  hasSelection,
  hasUnsupportedSelection,
  clearSelection,
  clearPageSelection,
  selectedPageId,
  activeRequests,
  toggleChange,
  canvases,
  getPendingOperationsForRequest,
  pendingOperations,
  addMessageToThread,
  addThreadReference,
  elementThreads,
  threadRequestStates,
  findCanvasIdForElement,
} from '@/store';
import { MiniCanvas } from '@/pages/Editor/components/PageNavigator/MiniCanvas';
import { MiniElementPreview } from './MiniElementPreview';
import type { ChatMessage, ChangeRecord } from '@/store';
import { captureImageThumbnail } from '@/store';
import {
  docsSelectedText,
  clearDocsSelectedText,
  useSelectionChip,
  useDeferredNavigation,
  inputVariant,
  currentEditorMode,
} from '@/store';
import {
  canvaAIService,
  docsAIService,
  interactivePageAIService,
  generateDocsTitle,
} from '@/services/canva-ai';
import { setupAuth } from '@canva-ct/genai';
import { docsTitle, docsTitleGenerated, blocks } from '@/store/signals/documentState';
import {
  MagicPencilIcon,
  MagicWandIcon,
  BoldIcon,
  MagicSwitchIcon,
  MagicRollerIcon,
  TextShortIcon,
  BriefcaseIcon,
  MagicPhotoBackgroundIcon,
  MagicPhotoIcon,
  ImageIcon,
  ImagePlusIcon,
  LayoutIcon,
  BrushSparklesIcon,
  LightBulbIcon,
  ClockRotateLeftIcon,
  ChartBarIcon,
  DockLeftIcon,
} from '@canva/easel/icons';
import { AIProgressIndicator } from './AIProgressIndicator';
import { ThreadReferenceCard } from './ThreadReferenceCard';
import { SlidePickerMessage } from './SlidePickerMessage';
import { LearningContentSuggestions } from './LearningContentSuggestions';
import { LearningContentLoading } from './LearningContentLoading';
import { DesignSchoolThinkingTip } from './DesignSchoolThinkingTip';
import {
  isLogoDesignHowToPrompt,
  requestLogoDesignLearningContent,
} from '@/services/design-school';
import './CanvaAIContent.css';

// Suggestion pill types and data
interface SuggestionPill {
  id: string;
  label: string;
  prompt: string;
}

// Blank slide: no elements yet
const BLANK_DESIGN_SUGGESTIONS: SuggestionPill[] = [
  {
    id: 'design-page',
    label: 'Design this page',
    prompt: 'Design this page for me. Make it visually striking and eye-catching.',
  },
  {
    id: 'gen-background',
    label: 'Generate background',
    prompt: 'Generate an AI background image for this page',
  },
  {
    id: 'create-layout',
    label: 'Create a layout',
    prompt: 'Create a professional layout with headline, body text, and image placeholders',
  },
];

const SELECTION_SUGGESTIONS: SuggestionPill[] = [
  { id: 'tone', label: 'Change tone of voice', prompt: 'Change the tone of voice' },
  { id: 'style', label: 'Change style', prompt: 'Change the style' },
  { id: 'background', label: 'Generate background', prompt: 'Generate a background' },
];

const TEXT_SUGGESTIONS: SuggestionPill[] = [
  { id: 'rewrite', label: 'Rewrite text', prompt: 'Rewrite this text in a different way' },
  { id: 'shorten', label: 'Make it shorter', prompt: 'Make this text shorter and more concise' },
  {
    id: 'formal',
    label: 'Make it formal',
    prompt: 'Rewrite this text in a more formal and professional tone',
  },
];

const IMAGE_SUGGESTIONS: SuggestionPill[] = [
  { id: 'remove-bg', label: 'Remove background', prompt: 'Remove the background from this image' },
  {
    id: 'enhance',
    label: 'Enhance image',
    prompt: 'Enhance and improve the quality of this image',
  },
  { id: 'stylize', label: 'Stylize image', prompt: 'Apply an artistic style to this image' },
];

const DOCS_SUGGESTIONS: SuggestionPill[] = [
  { id: 'expand', label: 'Expand content', prompt: 'Expand and add more detail to the document' },
  { id: 'summarize', label: 'Summarize', prompt: 'Summarize the document content concisely' },
  { id: 'proofread', label: 'Proofread', prompt: 'Proofread the document and fix any errors' },
];

const DOCS_TEXT_SELECTION_SUGGESTIONS: SuggestionPill[] = [
  {
    id: 'improve',
    label: 'Suggest improvements',
    prompt: 'Suggest improvements for the selected text',
  },
  { id: 'rewrite-sel', label: 'Rewrite text', prompt: 'Rewrite the selected text' },
  { id: 'shorten-sel', label: 'Shorten text', prompt: 'Shorten the selected text' },
];

const CANVA_AI_CAPABILITIES_CONTENT = `Here's what I can help you with:

**Create & Generate**

- Design presentations, posts, posters, flyers, and more
- Generate AI images and backgrounds

**Edit & Style**

- Add, move, resize, rotate, or delete elements
- Change colors, fonts, opacity, and alignment
- Edit image content with AI
- Adjust typography (font, size, spacing, alignment)

**Things I can't do yet**

- Curved text, shadows, or text effects
- No charts, tables

What will we design together today?`;

const INFO_PILL_SUGGESTIONS: SuggestionPill[] = [
  { id: 'recent-design', label: 'Start from recent design', prompt: 'Start from a recent design' },
  { id: 'generate-chart', label: 'Generate chart', prompt: 'Generate a chart' },
];

const getSuggestionsForElement = (
  elementType: string | undefined,
  isUnsupported: boolean,
  isBlankCanvas: boolean,
): SuggestionPill[] => {
  // Unsupported elements get page/design-level suggestions
  if (isUnsupported) {
    return BLANK_DESIGN_SUGGESTIONS;
  }
  switch (elementType) {
    case 'text':
      return TEXT_SUGGESTIONS;
    case 'image':
      return IMAGE_SUGGESTIONS;
    default:
      return BLANK_DESIGN_SUGGESTIONS;
  }
};

// Helper function to get user-friendly label for element types
const getElementLabel = (type: string): string => {
  switch (type) {
    case 'text':
      return 'Selected text';
    case 'image':
      return 'Selected image';
    case 'shape':
      return 'Selected shape';
    case 'video':
      return 'Selected video';
    case 'html':
      return 'Selected element';
    default:
      return 'Selected element';
  }
};

// Pending Operations Indicator Component - shimmering text animation
const PendingOperationsIndicator = ({ requestId }: { requestId: string }): React.ReactNode => {
  // Subscribe to the signal by reading .value to ensure reactivity
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

// Render markdown content with ReactMarkdown
const MarkdownContent = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      // Style links
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="canva-ai-markdown-link">
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

export default function CanvaAIContent(): React.ReactNode {
  useSignals();

  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();
  const [prompt, setPrompt] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [expandedChanges, setExpandedChanges] = useState<Set<string>>(new Set());
  const [hasTriggeredCreate, setHasTriggeredCreate] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Detect docs/interactive-page mode from route params + editor mode signal
  const doctype = (params.doctype ?? 'presentation').toLowerCase();
  const editorMode = currentEditorMode.value;
  const isDocsMode = doctype === 'docs' || editorMode === 'docs';
  const isInteractivePageMode = doctype === 'interactive-page' || editorMode === 'interactive-page';

  // Select the appropriate AI service
  const aiService = isInteractivePageMode
    ? interactivePageAIService
    : isDocsMode
      ? docsAIService
      : canvaAIService;

  // Get current selection state
  const currentElementId = selectedElementId.value;
  const currentPageId = selectedPageId.value;
  const isUnsupported = hasUnsupportedSelection.value;

  // Deferred navigation: tracks whether the user has explicitly navigated
  // to an element thread (via submit or thread-ref card click)
  const deferredNav = useDeferredNavigation.value && !isDocsMode && !isInteractivePageMode;
  const [committedThreadId, setCommittedThreadId] = useState<string | null>(null);

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
  // - Deferred nav ON + no commit → use 'presentation' (show chip instead)
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
  // This must happen synchronously before any user interaction
  if (activeThreadId.value !== threadId) {
    setActiveThreadId(threadId);
  }

  // Get thread state directly using local threadId (not from activeThreadId)
  // This ensures we always show the correct messages even during thread transitions
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
  const isDesigning = threadState.isDesigning;
  const currentRequestId = threadState.currentRequestId;
  const isGeneratingImage = threadState.isGeneratingImage;
  const imageGenerationMessage = threadState.imageGenerationMessage;

  // Get messages directly using local threadId (not from activeThreadId)
  const messages = elementThreads.value[threadId]?.messages ?? [];

  // Render-time dedupe for Design School learning content: even with the
  // claim/release race guard in `requestLogoDesignLearningContent`, a
  // thread that already accumulated duplicate messages from a previous
  // session would keep displaying both card sets. Pin display to the
  // FIRST message *index* in the thread that carries learning content
  // (loaded or still loading) — any subsequent message with the same
  // payload renders as plain text only.
  //
  // Indexed (not id-keyed) on purpose: id-based matching is fragile if
  // two messages ever share an id (e.g. a future regression in the id
  // generator), in which case both messages would match and re-introduce
  // the duplicate. Index-based matching can't break that way regardless
  // of id collisions.
  const learningContentDisplayIndex = messages.findIndex(
    msg => msg.learningContent || msg.learningContentLoading,
  );
  // Convert canvas ID to page number (1-indexed array position)
  const pageNumber = canvases.value.findIndex(c => c.canvasId === activeCanvasId.value) + 1 || 1;

  // Show chip when element is selected, but NOT for unsupported elements or docs mode
  // Unsupported elements should show no chip (like presentation level)
  const showSelectedDesign = !isDocsMode && hasSelection.value && !isUnsupported;

  // Docs text selection state
  const docsSelection = isDocsMode ? docsSelectedText.value : null;

  const hasPromptContent = prompt.trim().length > 0;

  // Input variant layout state
  const variant = inputVariant.value;
  const isEmptyState = messages.length === 0;
  const isCenterVariant = variant === 'center' && isEmptyState && !isDocsMode;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Focus textarea when panel opens (skip in docs mode to preserve editor focus)
  useEffect(() => {
    if (isDocsMode) return;
    const focusTimeout = setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(focusTimeout);
  }, []);

  // Initialize GenAI config (fetches baseUrl from playground). Safe to call
  // repeatedly — setupAuth is internally idempotent via configInitPromise.
  useEffect(() => {
    setupAuth().catch(err => console.error('[CanvaAI] setupAuth failed:', err));
  }, []);

  // Handle ?create query param - auto-trigger request from home page
  useEffect(() => {
    const shouldCreate = searchParams.has('create');
    if (shouldCreate && !hasTriggeredCreate && !isCurrentThreadStreaming) {
      // Get the last user message from the appropriate thread
      const sourceThread = isDocsMode ? 'docs' : 'presentation';
      const threadMessages = elementThreads.value[sourceThread]?.messages ?? [];
      const lastUserMessage = [...threadMessages].reverse().find(m => m.role === 'user');

      if (lastUserMessage) {
        setHasTriggeredCreate(true);

        // Remove the ?create param from URL
        searchParams.delete('create');
        setSearchParams(searchParams, { replace: true });

        // Trigger the AI request with the message from home page
        aiService.processRequest(lastUserMessage.content, {
          onComplete: completedRequestId => {
            const request = activeRequests.value.get(completedRequestId);
            if (request?.changes && request.changes.length > 0) {
              setExpandedChanges(prev => new Set([...prev, completedRequestId]));
            }
            if (isDocsMode && !docsTitleGenerated.value) {
              docsTitleGenerated.value = true;
              const docContent = blocks.value.map(b => b.markdown).join('\n');
              generateDocsTitle(lastUserMessage.content, docContent).then(title => {
                if (title) docsTitle.value = title;
              });
            }
          },
          onError: error => {
            console.error('[CanvaAI] Error from home page request:', error);
          },
        });
      }
    }
  }, [
    searchParams,
    hasTriggeredCreate,
    isCurrentThreadStreaming,
    setSearchParams,
    isDocsMode,
    aiService,
  ]);

  const handleNewChat = (): void => {
    const current = elementThreads.value[threadId];
    if (current && current.messages.length > 0) {
      elementThreads.value = {
        ...elementThreads.value,
        [threadId]: { ...current, messages: [] },
      };
    }
    setPrompt('');
    setShowChatList(false);
  };

  const handleSubmit = async () => {
    if (!hasPromptContent || isCurrentThreadStreaming) return;

    const userMessage = prompt.trim();

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
    } else if (deferredNav && threadId === 'presentation' && selectionThreadId !== 'presentation') {
      // Deferred navigation: we're on the design thread with an element selected.
      // Commit to the element thread on submit.
      const targetThread = selectionThreadId;

      // Capture snapshot of selected element before sending
      const elementSnapshot = isUnsupported
        ? undefined
        : captureImageThumbnail(selectedElement.value);

      // Commit: navigate to element thread
      setCommittedThreadId(targetThread);
      setActiveThreadId(targetThread);

      // Add user message to the element's thread (not presentation)
      addMessageToThread(userMessage, 'user', targetThread, { elementSnapshot });

      // Add thread reference card to presentation thread
      const element = selectedElement.value;
      const isPageThread = targetThread.startsWith('page:');
      let label: string;
      if (isPageThread) {
        label = `Page ${pageNumber}`;
      } else if (element?.type === 'text' && element.content) {
        const preview =
          element.content.length > 30 ? element.content.substring(0, 30) + '...' : element.content;
        label = `Text: ${preview}`;
      } else {
        label = element ? getElementLabel(element.type).replace('Selected ', '') : 'Element';
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
      const elementSnapshot = isUnsupported
        ? undefined
        : captureImageThumbnail(selectedElement.value);

      // Add message to current element's thread with snapshot
      addUserMessageToCurrentThread(userMessage, { elementSnapshot });

      // Add a thread reference card to the presentation thread (deduped per threadId)
      if (threadId !== 'presentation') {
        const element = selectedElement.value;
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
          label = element ? getElementLabel(element.type).replace('Selected ', '') : 'Element';
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

    setPrompt('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

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
            console.log('[CanvaAI] Notification:', message);
          },
          onToolStart: toolName => {
            console.log('[CanvaAI] Tool started:', toolName);
          },
          onToolEnd: (toolName, result) => {
            console.log('[CanvaAI] Tool completed:', toolName, result);
          },
          onComplete: completedRequestId => {
            // Auto-expand changes for this new message
            const request = activeRequests.value.get(completedRequestId);
            if (request?.changes && request.changes.length > 0) {
              setExpandedChanges(prev => new Set([...prev, completedRequestId]));
            }
            if (shouldSuggestLogoLessons) {
              // `requestLogoDesignLearningContent` owns the full
              // dedupe + placeholder + swap flow, including a synchronous
              // race guard that prevents duplicate cards when `onComplete`
              // fires more than once for the same prompt (StrictMode,
              // double-clicks, retries).
              requestLogoDesignLearningContent(learningTargetThreadId);
            }
            if (isDocsMode && !docsTitleGenerated.value) {
              docsTitleGenerated.value = true;
              const docContent = blocks.value.map(b => b.markdown).join('\n');
              generateDocsTitle(userMessage, docContent).then(title => {
                if (title) docsTitle.value = title;
              });
            }
          },
          onError: error => {
            console.error('[CanvaAI] Error:', error);
          },
        },
        undefined,
        selectedContext,
      );
    } catch (error) {
      console.error('[CanvaAIContent] Error processing request:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  const handleGoToThread = (goToThreadId: string) => {
    // In deferred nav mode, also commit to the target thread
    if (deferredNav) {
      setCommittedThreadId(goToThreadId);
    }

    // Batch all signal mutations so subscribers (and the sync block) only see
    // the final state — prevents the intermediate "no selection" render that
    // was resetting the thread to 'presentation'.
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

  const getChatTitle = () => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content;
      return content.length > 35 ? content.substring(0, 35) + '...' : content;
    }
    return 'New chat';
  };

  const handlePillClick = async (pill: SuggestionPill) => {
    // Capture docs text selection before clearing
    const capturedDocsSelection = docsSelection ? { ...docsSelection } : null;

    if (isDocsMode) {
      addMessageToThread(pill.prompt, 'user', 'docs', {
        quotedText: capturedDocsSelection?.text,
      });
      if (capturedDocsSelection) {
        clearDocsSelectedText();
      }
    } else if (deferredNav && threadId === 'presentation' && selectionThreadId !== 'presentation') {
      // Deferred navigation: commit to element thread on pill click
      const targetThread = selectionThreadId;

      const elementSnapshot = isUnsupported
        ? undefined
        : captureImageThumbnail(selectedElement.value);

      setCommittedThreadId(targetThread);
      setActiveThreadId(targetThread);

      addMessageToThread(pill.prompt, 'user', targetThread, { elementSnapshot });

      // Add thread reference card to presentation thread
      const element = selectedElement.value;
      const isPageThread = targetThread.startsWith('page:');
      let label: string;
      if (isPageThread) {
        label = `Page ${pageNumber}`;
      } else if (element?.type === 'text' && element.content) {
        const preview =
          element.content.length > 30 ? element.content.substring(0, 30) + '...' : element.content;
        label = `Text: ${preview}`;
      } else {
        label = element ? getElementLabel(element.type).replace('Selected ', '') : 'Element';
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
      const elementSnapshot = isUnsupported
        ? undefined
        : captureImageThumbnail(selectedElement.value);
      addUserMessageToCurrentThread(pill.prompt, { elementSnapshot });

      // Add a thread reference card to the presentation thread (deduped per threadId)
      if (threadId !== 'presentation') {
        const element = selectedElement.value;
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
          label = element ? getElementLabel(element.type).replace('Selected ', '') : 'Element';
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

    const shouldSuggestLogoLessons = isLogoDesignHowToPrompt(pill.prompt);
    const learningTargetThreadId = activeThreadId.value;

    const selectedContext = capturedDocsSelection
      ? { blockId: capturedDocsSelection.blockId, selectedText: capturedDocsSelection.text }
      : undefined;

    try {
      await aiService.processRequest(
        pill.prompt,
        {
          onComplete: completedRequestId => {
            const request = activeRequests.value.get(completedRequestId);
            if (request?.changes && request.changes.length > 0) {
              setExpandedChanges(prev => new Set([...prev, completedRequestId]));
            }
            if (shouldSuggestLogoLessons) {
              // See `handleSubmit` — same dedupe-with-race-guard flow.
              requestLogoDesignLearningContent(learningTargetThreadId);
            }
          },
        },
        undefined,
        selectedContext,
      );
    } catch (error) {
      console.error('[CanvaAIContent] Error processing pill request:', error);
    }
  };

  const handleInfoPillClick = () => {
    addMessageToThread('Tell me what Canva AI can do', 'user', threadId);
    addMessageToThread(CANVA_AI_CAPABILITIES_CONTENT, 'assistant', threadId);
  };

  const renderMessageChanges = (msg: ChatMessage) => {
    if (!msg.changes || msg.changes.length === 0) return null;

    return (
      <div className="canva-ai-changes-list-simple">
        {msg.changes.map(change => (
          <div key={change.id} className="canva-ai-change-item-simple">
            • {change.description}
          </div>
        ))}
      </div>
    );
  };

  const renderThreadIndicator = () => {
    const element = selectedElement.value;

    // Chip mode: header shows contextual thread name based on selection
    if (
      useSelectionChip.value
      && ((element && currentElementId && !isUnsupported)
        || (currentPageId !== null && !isUnsupported))
    ) {
      let threadLabel: string;
      if (element && currentElementId) {
        switch (element.type) {
          case 'text':
            threadLabel = 'Text thread';
            break;
          case 'image':
            threadLabel = 'Image thread';
            break;
          case 'shape':
            threadLabel = 'Shape thread';
            break;
          case 'video':
            threadLabel = 'Video thread';
            break;
          default:
            threadLabel = 'Element thread';
            break;
        }
      } else {
        threadLabel = 'Page thread';
      }
      return (
        <div className="canva-ai-thread-indicator">
          <span className="canva-ai-chat-title">{threadLabel}</span>
        </div>
      );
    }

    // Element selected (not unsupported)
    if (element && currentElementId && !isUnsupported) {
      if (element.type === 'text') {
        const preview = element.content
          ? element.content.length > 25
            ? element.content.substring(0, 25) + '...'
            : element.content
          : 'Text';
        return (
          <div className="canva-ai-thread-indicator">
            <span className="canva-ai-thread-label">Text: {preview}</span>
            <button
              type="button"
              className="canva-ai-thread-dismiss"
              onClick={() => {
                if (deferredNav) setCommittedThreadId(null);
                clearSelection();
                clearPageSelection();
              }}
              aria-label="Dismiss selection"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        );
      }

      if (element.type === 'image') {
        const bgImage = element.style?.backgroundImage;
        const urlMatch =
          typeof bgImage === 'string' ? bgImage.match(/url\(['"]?([^'"]+)['"]?\)/) : null;
        const imageUrl = urlMatch?.[1];
        return (
          <div className="canva-ai-thread-indicator">
            {imageUrl ? (
              <img src={imageUrl} alt="Image" className="canva-ai-thread-thumbnail" />
            ) : (
              <div className="canva-ai-thread-thumbnail canva-ai-thread-thumbnail-placeholder" />
            )}
            <span className="canva-ai-thread-label">Image</span>
            <button
              type="button"
              className="canva-ai-thread-dismiss"
              onClick={() => {
                if (deferredNav) setCommittedThreadId(null);
                clearSelection();
                clearPageSelection();
              }}
              aria-label="Dismiss selection"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        );
      }

      // Shape / video / html / other
      const label = getElementLabel(element.type).replace('Selected ', '');
      return (
        <div className="canva-ai-thread-indicator">
          <div className="canva-ai-thread-thumbnail">
            <MiniElementPreview element={element} />
          </div>
          <span className="canva-ai-thread-label">{label}</span>
          <button
            type="button"
            className="canva-ai-thread-dismiss"
            onClick={() => {
              clearSelection();
              clearPageSelection();
            }}
            aria-label="Dismiss selection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      );
    }

    // Page selected (no element)
    if (currentPageId !== null && !isUnsupported) {
      return (
        <div className="canva-ai-thread-indicator">
          <div className="canva-ai-thread-page-thumbnail">
            <MiniCanvas pageNumber={pageNumber} doctype="presentation" />
          </div>
          <span className="canva-ai-thread-label">Page {pageNumber}</span>
          <button
            type="button"
            className="canva-ai-thread-dismiss"
            onClick={() => {
              clearSelection();
              clearPageSelection();
            }}
            aria-label="Dismiss selection"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      );
    }

    // Nothing selected — design-level thread: show no header
    return null;
  };

  const renderMessage = (msg: ChatMessage, index: number) => {
    if (msg.role === 'element') {
      return null;
    }

    if (msg.threadRef) {
      return (
        <ThreadReferenceCard
          key={msg.id}
          threadRef={msg.threadRef}
          onGoToThread={handleGoToThread}
        />
      );
    }

    // Assistant message with a slide picker attached
    if (msg.slidePickerData) {
      return (
        <React.Fragment key={msg.id}>
          <div className="canva-ai-assistant-message">
            <div className="canva-ai-assistant-content">
              <div className="canva-ai-assistant-text">
                <MarkdownContent content={msg.content} />
              </div>
              <SlidePickerMessage
                excludeCanvasId={msg.slidePickerData.excludeCanvasId}
                onSlideSelect={(canvasId, slideNumber) => {
                  handlePillClick({
                    id: 'match-slide',
                    label: `Slide ${slideNumber}`,
                    prompt: `Match this slide to slide ${slideNumber}`,
                  });
                }}
                disabled={isCurrentThreadStreaming}
              />
            </div>
          </div>
        </React.Fragment>
      );
    }

    if (msg.role === 'user') {
      return (
        <div key={msg.id} className="canva-ai-user-message">
          <div className="canva-ai-user-message-bubble">
            <div className="canva-ai-user-message-text">{msg.content}</div>
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
                className="canva-ai-message-thumbnail"
              />
            )}
          </div>
        </div>
      );
    }

    return (
      <React.Fragment key={msg.id}>
        <div className="canva-ai-assistant-message">
          <div className="canva-ai-assistant-content">
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

  const renderSuggestionPills = (extraClass?: string) => {
    const currentCanvasElements =
      canvases.value.find(c => c.canvasId === activeCanvasId.value)?.elements ?? [];
    const isBlankCanvas = currentCanvasElements.length === 0;

    return (
      <div className={`canva-ai-suggestion-pills ${extraClass ?? ''}`}>
        {variant === 'bottom-info-pill' && !isDocsMode && (
          <button
            className="canva-ai-suggestion-pill"
            onClick={handleInfoPillClick}
            disabled={isCurrentThreadStreaming}
          >
            <span className="canva-ai-pill-icon">
              <LightBulbIcon size="medium" />
            </span>
            Learn what Canva AI can do
          </button>
        )}
        {(variant === 'bottom-info-pill' && !isDocsMode
          ? INFO_PILL_SUGGESTIONS
          : isDocsMode
            ? docsSelection
              ? DOCS_TEXT_SELECTION_SUGGESTIONS
              : DOCS_SUGGESTIONS
            : getSuggestionsForElement(
                selectedElement.value?.type,
                hasUnsupportedSelection.value,
                isBlankCanvas,
              )
        ).map(pill => (
          <button
            key={pill.id}
            className="canva-ai-suggestion-pill"
            onClick={() => handlePillClick(pill)}
            disabled={isCurrentThreadStreaming}
          >
            <span className="canva-ai-pill-icon">
              {/* Blank design pills */}
              {pill.id === 'design-page' && <MagicWandIcon size="medium" />}
              {pill.id === 'gen-background' && <ImageIcon size="medium" />}
              {pill.id === 'create-layout' && <LayoutIcon size="medium" />}
              {/* Non-blank design pills */}
              {pill.id === 'redesign-page' && <MagicWandIcon size="medium" />}
              {pill.id === 'add-background' && <ImagePlusIcon size="medium" />}
              {pill.id === 'change-style' && <MagicRollerIcon size="medium" />}
              {/* Info pill variant icons */}
              {pill.id === 'recent-design' && <ClockRotateLeftIcon size="medium" />}
              {pill.id === 'generate-chart' && <ChartBarIcon size="medium" />}
              {/* Text-specific pill icons */}
              {pill.id === 'rewrite' && <MagicPencilIcon size="medium" />}
              {pill.id === 'shorten' && <TextShortIcon size="medium" />}
              {pill.id === 'formal' && <BriefcaseIcon size="medium" />}
              {/* Image-specific pill icons */}
              {pill.id === 'remove-bg' && <MagicPhotoBackgroundIcon size="medium" />}
              {pill.id === 'enhance' && <MagicPhotoIcon size="medium" />}
              {pill.id === 'stylize' && <BrushSparklesIcon size="medium" />}
              {/* Docs-specific pill icons */}
              {pill.id === 'expand' && <MagicPencilIcon size="medium" />}
              {pill.id === 'summarize' && <TextShortIcon size="medium" />}
              {pill.id === 'proofread' && <MagicWandIcon size="medium" />}
              {/* Docs text selection pill icons */}
              {pill.id === 'improve' && <MagicWandIcon size="medium" />}
              {pill.id === 'rewrite-sel' && <MagicPencilIcon size="medium" />}
              {pill.id === 'shorten-sel' && <TextShortIcon size="medium" />}
            </span>
            {pill.label}
          </button>
        ))}
      </div>
    );
  };

  const renderInputSection = (extraClass?: string) => (
    <div className={`canva-ai-26-input-section ${extraClass ?? ''}`}>
      {((deferredNav && showSelectedDesign && committedThreadId === null)
        || (!deferredNav && useSelectionChip.value && showSelectedDesign)) && (
        <div className="canva-ai-26-selected-design-chip canva-ai-26-selected-design-chip--full">
          <div className="canva-ai-26-chip-thumbnail canva-ai-26-chip-thumbnail--landscape">
            {hasSelection.value && selectedElement.value ? (
              <MiniElementPreview element={selectedElement.value} />
            ) : (
              <MiniCanvas pageNumber={pageNumber} doctype="presentation" />
            )}
          </div>
          <span className="canva-ai-26-chip-label">
            {selectedElement.value
              ? getElementLabel(selectedElement.value.type)
              : selectedPageId.value !== null
                ? 'Page'
                : 'Current design'}
          </span>
          <button
            type="button"
            className="canva-ai-26-chip-close"
            onClick={() => {
              clearSelection();
              clearPageSelection();
            }}
            aria-label="Remove selected design"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
      <div className={`canva-ai-26-input-wrapper ${isFocused ? 'focused' : ''}`}>
        {/* Docs text selection chip */}
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
              className="canva-ai-26-chip-close"
              onClick={() => {
                clearDocsSelectedText();
                window.getSelection()?.removeAllRanges();
              }}
              aria-label="Remove text selection"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="canva-ai-26-textarea"
          placeholder={
            isCurrentThreadStreaming
              ? 'Processing...'
              : isDocsMode
                ? docsSelection
                  ? 'What do you want to do with this text?'
                  : 'What do you want to write or edit?'
                : deferredNav && (showSelectedDesign || committedThreadId !== null)
                  ? 'How do you want to edit this?'
                  : showSelectedDesign
                    ? selectedElement.value
                      ? `How do you want to edit this ${selectedElement.value.type}?`
                      : selectedPageId.value !== null
                        ? 'How do you want to edit this page?'
                        : 'What do you want to change in this design?'
                    : 'Describe your idea'
          }
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          rows={1}
          disabled={isCurrentThreadStreaming}
        />

        {/* Actions row */}
        <div className="canva-ai-26-actions">
          <button
            type="button"
            className="canva-ai-26-plus-button"
            aria-label="Attach media"
            disabled={isCurrentThreadStreaming}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H12.75V19C12.75 19.4142 12.4142 19.75 12 19.75C11.5858 19.75 11.25 19.4142 11.25 19V12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H11.25V5C11.25 4.58579 11.5858 4.25 12 4.25Z"
                fill="#0E1318"
              />
            </svg>
          </button>
          <div className="canva-ai-26-right-actions">
            {!hasPromptContent ? (
              <button
                type="button"
                className="canva-ai-26-voice-button"
                aria-label="Voice input"
                disabled={isCurrentThreadStreaming}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.96484 12.3496C6.37231 12.2751 6.76342 12.5447 6.83789 12.9521C7.29003 15.4256 9.45546 17.2498 12 17.25C14.5444 17.25 16.7106 15.4262 17.1631 12.9531C17.2376 12.5457 17.6287 12.2751 18.0361 12.3496C18.4434 12.4243 18.7132 12.8153 18.6387 13.2227C18.1016 16.1591 15.6897 18.3796 12.75 18.7061V20.25H16.25C16.6642 20.25 17 20.5858 17 21C17 21.4142 16.6642 21.75 16.25 21.75H7.75C7.33594 21.7498 7 21.4141 7 21C7 20.5859 7.33594 20.2502 7.75 20.25H11.25V18.7061C8.31031 18.3793 5.89905 16.1583 5.3623 13.2217C5.28787 12.8143 5.55747 12.4241 5.96484 12.3496ZM12 2C14.2091 2 16 3.79086 16 6V12C16 14.2091 14.2091 16 12 16C9.79102 15.9998 8 14.209 8 12V6C8 3.79097 9.79102 2.00018 12 2ZM12 3.5C10.6194 3.50018 9.5 4.6194 9.5 6V12C9.5 13.3806 10.6194 14.4998 12 14.5C13.3807 14.5 14.5 13.3807 14.5 12V6C14.5 4.61929 13.3807 3.5 12 3.5Z"
                    fill="#0E1318"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className={`canva-ai-26-submit-button ${isCurrentThreadStreaming ? 'disabled' : ''}`}
                onClick={handleSubmit}
                aria-label="Submit"
                disabled={isCurrentThreadStreaming}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12M20 12L14 6M20 12L14 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="canva-ai-chat-view" data-mode={showChatList ? 'list' : 'chat'}>
      {/* Top bar — chat list toggle + new-chat reset. Always visible. */}
      <div className="canva-ai-chat-topbar">
        {showChatList ? (
          <span className="canva-ai-chat-topbar-title">Chats about this design</span>
        ) : (
          <button
            type="button"
            className="canva-ai-chat-topbar-button"
            onClick={() => setShowChatList(v => !v)}
            aria-label="Show chats"
          >
            <DockLeftIcon size="medium" />
          </button>
        )}
        <button
          type="button"
          className="canva-ai-chat-topbar-button"
          onClick={handleNewChat}
          aria-label="New chat"
        >
          {/* Inlined from monorepo src/ui/base/icons/pencil_square/icon-pencil-square.inline.svg — the @canva/easel package ships an older 32×32 pencil-only variant. */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.0859 4.49943H8C6.06728 4.49943 4.50045 6.06682 4.5 7.99943V15.9994C4.50013 17.9323 6.06708 19.4994 8 19.4994H16C17.9328 19.4993 19.4999 17.9322 19.5 15.9994V11.9994H21V15.9994L20.9932 16.2563C20.8637 18.8131 18.8136 20.8631 16.2568 20.9926L16 20.9994H8L7.74316 20.9926C5.18627 20.8632 3.13634 18.8131 3.00684 16.2563L3 15.9994V7.99943C3.00045 5.23839 5.23886 2.99943 8 2.99943H12.0859V4.49943Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.2656 2.73088C18.3745 1.62231 20.1589 1.87429 21.2383 2.95353C22.3176 4.03286 22.5695 5.81725 21.4609 6.92619L14.9844 13.4028C14.509 13.8781 13.923 14.2256 13.2715 14.4242L10.6035 15.2377C9.92526 15.4445 9.25947 15.0341 9.01172 14.4672C8.89629 14.2026 8.86209 13.8901 8.9541 13.5883L9.76758 10.9203C9.96625 10.2688 10.3138 9.68281 10.7891 9.20744L17.2656 2.73088ZM11.8496 10.268C11.5537 10.564 11.3323 10.9342 11.2031 11.3578L10.4883 13.7035L12.834 12.9897C13.2578 12.8605 13.6277 12.6382 13.9238 12.3422L18.1465 8.11857L16.0723 6.04435L11.8496 10.268ZM20.1777 4.01408C19.5259 3.36238 18.7027 3.41525 18.3262 3.79142L16.9561 5.16056L19.0303 7.23478L20.4004 5.86564C20.7766 5.48907 20.8295 4.66589 20.1777 4.01408Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {showChatList ? (
        <div className="canva-ai-chat-list">
          <div className="canva-ai-chat-list-section">Today</div>
          <button
            type="button"
            className="canva-ai-chat-list-item"
            onClick={() => setShowChatList(false)}
          >
            <div className="canva-ai-chat-list-thumb" />
            <div className="canva-ai-chat-list-meta">
              <div className="canva-ai-chat-list-item-title">Greeting Conversation</div>
              <div className="canva-ai-chat-list-item-subtitle">1 hour ago</div>
            </div>
          </button>
          <div className="canva-ai-chat-list-section">This Week</div>
          <button
            type="button"
            className="canva-ai-chat-list-item"
            onClick={() => setShowChatList(false)}
          >
            <div className="canva-ai-chat-list-thumb" />
            <div className="canva-ai-chat-list-meta">
              <div className="canva-ai-chat-list-item-title">Greeting and Introduction</div>
              <div className="canva-ai-chat-list-item-subtitle">1 day ago</div>
            </div>
          </button>
        </div>
      ) : (
        <>
          {/* Header — hidden at design-level thread (no element/page selected) */}
          {(isDocsMode
            || (deferredNav ? committedThreadId !== null : threadId !== 'presentation')) && (
            <div className="canva-ai-chat-header">
              <div className="canva-ai-chat-header-content">
                {isDocsMode ? (
                  <span className="canva-ai-chat-title">{docsTitle.value}</span>
                ) : (
                  renderThreadIndicator()
                )}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div
            className={`canva-ai-chat ${isCenterVariant && !hasSelection.value ? 'canva-ai-chat--center' : ''}`}
          >
            {isCenterVariant && !hasSelection.value ? (
              /* Center variant: title vertically centered, pills + input pinned bottom */
              <>
                <div className="canva-ai-center-title-area">
                  <div className="canva-ai-welcome-title">
                    {isDocsMode ? 'What shall we write?' : 'What will we design today?'}
                  </div>
                </div>

                <div className="canva-ai-center-footer">
                  {!hasPromptContent && renderSuggestionPills('canva-ai-suggestion-pills--center')}
                  {renderInputSection('canva-ai-26-input-section--center')}
                </div>
              </>
            ) : (
              /* Bottom / bottom-info variant: standard layout */
              <>
                <div className="canva-ai-chat-messages" ref={chatAreaRef}>
                  {/* Welcome title - centered in chat area when no messages and no selection */}
                  {messages.length === 0 && (isDocsMode || !hasSelection.value) && (
                    <div className="canva-ai-welcome-title-container">
                      <div className="canva-ai-welcome-title">
                        {isDocsMode ? 'What shall we write?' : 'What will we design today?'}
                      </div>
                      {variant === 'bottom-info' && !isDocsMode && (
                        <div className="canva-ai-welcome-info-text">
                          Edit your design or generate new designs, elements and text with Canva AI.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render messages */}
                  {messages.map((msg, index) => renderMessage(msg, index))}

                  {/* Streaming/Thinking indicator - state from store, per-thread */}
                  {isCurrentThreadStreaming && (
                    <>
                      {streamingContent && (
                        <div className="canva-ai-assistant-message">
                          <div className="canva-ai-assistant-content">
                            <div className="canva-ai-assistant-text">
                              <MarkdownContent content={streamingContent} />
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="ai-progress-standalone">
                        <AIProgressIndicator
                          designProgress={threadState.designProgress}
                          isStreaming={true}
                          threadId={threadId}
                        />
                        {/*
                         * Bite-sized Design School tip shown alongside the
                         * "Thinking…" indicator. Fills the AI's wait time
                         * with a piece of just-in-time presentation-design
                         * learning so the user gets something useful while
                         * the model works. The tip is selected once per
                         * mount (see `DesignSchoolThinkingTip`) so it
                         * stays put for the lifetime of this thinking
                         * session and a fresh one appears next time.
                         */}
                        <DesignSchoolThinkingTip />
                      </div>
                    </>
                  )}

                  {/* Pending operations indicator - state from store, per-thread */}
                  {currentRequestId && isCurrentThreadStreaming && (
                    <PendingOperationsIndicator requestId={currentRequestId} />
                  )}

                  {/* Image generation indicator - persists after streaming ends until FAL completes */}
                  {isGeneratingImage && !isCurrentThreadStreaming && (
                    <div className="canva-ai-assistant-message">
                      <div className="canva-ai-assistant-content">
                        <span className="canva-ai-designing-text">
                          {imageGenerationMessage || 'Creating image...'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestion pills - show only when no messages, input is empty,
                and nothing is selected on canvas (selection chip replaces them). */}
                {messages.length === 0
                  && !hasPromptContent
                  && !hasSelection.value
                  && renderSuggestionPills()}
              </>
            )}
          </div>

          {/* Input Section - only render at bottom for non-center variant */}
          {!(isCenterVariant && !hasSelection.value) && renderInputSection()}
        </>
      )}
    </div>
  );
}
