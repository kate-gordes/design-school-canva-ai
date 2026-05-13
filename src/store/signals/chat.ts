import { signal, computed } from '@preact/signals-react';
import type { ChangeRecord } from './aiRequests';
import type { ElementData } from './canvasState';
import type { LearningItem } from '@/data/designSchoolCatalog';

// --- Design Progress Types ---
export type ActionStepStatus = 'in_progress' | 'completed';

export interface ActionStep {
  id: string;
  toolName: string;
  displayName: string;
  status: ActionStepStatus;
  startedAt: number;
  completedAt?: number;
}

export interface DesignProgress {
  actions: ActionStep[];
  requestStartTime: number;
  requestEndTime?: number;
  isExpanded: boolean;
}

// --- Tool Display Name Mapping ---
const TOOL_DISPLAY_NAMES: Record<string, { active: string; completed: string }> = {
  update_element_style: { active: 'Updating style', completed: 'Updated style' },
  update_element_content: { active: 'Updating content', completed: 'Updated content' },
  update_canvas_background: { active: 'Adding background', completed: 'Added background' },
  generate_image: { active: 'Generating image', completed: 'Generated image' },
  edit_image: { active: 'Editing image', completed: 'Edited image' },
  add_element: { active: 'Adding element', completed: 'Added element' },
  delete_element: { active: 'Removing element', completed: 'Removed element' },
  batch_update: { active: 'Updating elements', completed: 'Updated elements' },
  generate_slide: { active: 'Generating slide', completed: 'Generated slide' },
  create_slide_with_data: { active: 'Creating slide', completed: 'Created slide' },
  create_multiple_slides: { active: 'Creating slides', completed: 'Created slides' },
  update_document: { active: 'Updating document', completed: 'Updated document' },
  update_block: { active: 'Updating block', completed: 'Updated block' },
  insert_block: { active: 'Inserting block', completed: 'Inserted block' },
  delete_block: { active: 'Deleting block', completed: 'Deleted block' },
  find_and_replace: { active: 'Editing page', completed: 'Edited page' },
  update_html: { active: 'Rewriting page', completed: 'Rewrote page' },
};

export const getToolDisplayName = (toolName: string, phase: 'active' | 'completed'): string => {
  const entry = TOOL_DISPLAY_NAMES[toolName];
  if (!entry) {
    // Fallback: capitalize tool name
    const label = toolName.replace(/_/g, ' ');
    return phase === 'active'
      ? label.charAt(0).toUpperCase() + label.slice(1) + '...'
      : label.charAt(0).toUpperCase() + label.slice(1);
  }
  return entry[phase];
};

// Snapshot of element at message creation time (for image-related requests)
export type ElementSnapshot = {
  type: 'text' | 'shape' | 'image' | 'video' | 'html';
  label: string; // e.g., "Image", "Photo"
  thumbnailUrl?: string; // backgroundImage URL for images
  style?: {
    width: number | string;
    height: number | string;
    borderRadius?: number;
  };
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'element' | 'thread-ref';
  content: string;
  elementType?: 'text' | 'shape' | 'image';
  elementId?: string;
  timestamp: Date;
  // For assistant messages - track changes made
  changes?: ChangeRecord[];
  requestId?: string;
  // Snapshot of element at message creation time
  elementSnapshot?: ElementSnapshot;
  // Quoted text from docs text selection
  quotedText?: string;
  // Design progress summary (persisted on completed assistant messages)
  designSummary?: {
    durationSeconds: number;
    actionCount: number;
    actions: Array<{ displayName: string; toolName: string }>;
  };
  // Thread reference - links to another thread from the main thread
  threadRef?: {
    threadId: string;
    elementType: string; // 'text' | 'image' | 'shape' | 'video' | 'html' | 'page'
    elementLabel: string; // "Image", "Text: content...", "Page 1", etc.
    thumbnailUrl?: string; // Background image URL for image elements
    pageNumber?: number; // 1-indexed page number for page threads
  };
  // Slide picker - prompts user to select a slide thumbnail
  slidePickerData?: {
    excludeCanvasId: number; // The current slide's canvasId — excluded from the picker
  };
  // Design School learning content - rendered as a card group below the message
  learningContent?: LearningItem[];
  // While true, render a gradient/shimmer skeleton (with the
  // "Serving up Design School recommendations" header) instead of the real
  // `learningContent` cards. The placeholder message is added the moment the
  // AI reply finishes, then `setMessageLearningContent` swaps the cards in.
  learningContentLoading?: boolean;
};

/**
 * Capture a thumbnail snapshot of an element for preserving in chat history.
 * Currently captures image elements with their thumbnail URL.
 */
export const captureImageThumbnail = (element: ElementData | null): ElementSnapshot | undefined => {
  if (!element) return undefined;

  // Only capture for image elements (based on requirements)
  if (element.type !== 'image') return undefined;

  const bgImage = element.style?.backgroundImage;
  // Extract URL from "url('...')" format
  const urlMatch = typeof bgImage === 'string' ? bgImage.match(/url\(['"]?([^'"]+)['"]?\)/) : null;

  return {
    type: element.type,
    label: 'Image',
    thumbnailUrl: urlMatch?.[1],
    style: {
      width: element.style?.width ?? 200,
      height: element.style?.height ?? 100,
      borderRadius: element.style?.borderRadius as number | undefined,
    },
  };
};

// --- Thread-per-element types ---
export type ThreadId = string; // elementId or 'global'

/**
 * Monotonic counter appended to `Date.now()` so message ids stay unique
 * even when two messages are appended in the same millisecond (which is
 * common during the Design School flow: a user message, an assistant
 * placeholder, and the user's next message can all land in one tick).
 *
 * Pure timestamp ids would collide and break id-based React keys / any
 * downstream dedupe logic (e.g. the chat view's render-time dedupe of
 * Design School learning-content cards).
 */
let nextMessageIdCounter = 0;
const generateMessageId = (): string => {
  nextMessageIdCounter += 1;
  return `${Date.now()}-${nextMessageIdCounter}`;
};

export interface ThreadData {
  threadId: ThreadId;
  messages: ChatMessage[];
  lastUpdated: Date;
  elementType?: 'text' | 'shape' | 'image' | 'video' | 'html';
}

export type ThreadsMap = Record<ThreadId, ThreadData>;

// --- Thread Request State (per-thread streaming/processing state) ---
export interface ThreadRequestState {
  isStreaming: boolean;
  streamingContent: string;
  isDesigning: boolean; // Tool is executing
  designingMessage: string; // What the AI is currently doing (e.g., "Editing image...")
  currentRequestId: string | null;
  error: string | null;
  // Image generation tracking (persists after streaming ends)
  isGeneratingImage: boolean;
  imageGenerationMessage: string;
  // Design progress tracking (multi-phase indicator)
  designProgress: DesignProgress | null;
}

const defaultThreadRequestState: ThreadRequestState = {
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

// --- Thread signals ---
export const elementThreads = signal<ThreadsMap>({});

// Per-thread request state (streaming, designing, etc.)
export const threadRequestStates = signal<Record<ThreadId, ThreadRequestState>>({});

// Active thread ID - set by components based on selected element
export const activeThreadId = signal<ThreadId>('global');

// Current thread messages computed from active thread
export const currentThreadMessages = computed<ChatMessage[]>(() => {
  const threadId = activeThreadId.value;
  return elementThreads.value[threadId]?.messages ?? [];
});

// Current thread request state computed from active thread
export const currentThreadRequestState = computed<ThreadRequestState>(() => {
  const threadId = activeThreadId.value;
  return threadRequestStates.value[threadId] ?? defaultThreadRequestState;
});

// Convenience computed values for current thread
export const isCurrentThreadStreaming = computed(() => currentThreadRequestState.value.isStreaming);
export const currentThreadStreamingContent = computed(
  () => currentThreadRequestState.value.streamingContent,
);
export const isCurrentThreadDesigning = computed(() => currentThreadRequestState.value.isDesigning);
export const currentThreadDesigningMessage = computed(
  () => currentThreadRequestState.value.designingMessage,
);
export const isCurrentThreadGeneratingImage = computed(
  () => currentThreadRequestState.value.isGeneratingImage,
);
export const currentThreadImageGenerationMessage = computed(
  () => currentThreadRequestState.value.imageGenerationMessage,
);

/**
 * Set the active thread ID (called when element selection changes)
 */
export const setActiveThreadId = (threadId: ThreadId | null): void => {
  activeThreadId.value = threadId ?? 'global';
};

// --- Thread Request State Management ---

/**
 * Get request state for a specific thread
 */
export const getThreadRequestState = (threadId: ThreadId): ThreadRequestState => {
  return threadRequestStates.value[threadId] ?? defaultThreadRequestState;
};

/**
 * Update request state for a specific thread
 */
export const updateThreadRequestState = (
  threadId: ThreadId,
  updates: Partial<ThreadRequestState>,
): void => {
  const current = threadRequestStates.value[threadId] ?? defaultThreadRequestState;
  threadRequestStates.value = {
    ...threadRequestStates.value,
    [threadId]: { ...current, ...updates },
  };
};

/**
 * Start streaming for a thread
 */
export const startThreadStreaming = (threadId: ThreadId, requestId: string): void => {
  updateThreadRequestState(threadId, {
    isStreaming: true,
    streamingContent: '',
    currentRequestId: requestId,
    error: null,
  });
};

/**
 * Append streaming content for a thread
 */
export const appendThreadStreamingContent = (threadId: ThreadId, content: string): void => {
  const current = threadRequestStates.value[threadId];
  if (current) {
    updateThreadRequestState(threadId, {
      streamingContent: current.streamingContent + content,
    });
  }
};

/**
 * Set designing state for a thread (tool executing)
 */
export const setThreadDesigning = (
  threadId: ThreadId,
  isDesigning: boolean,
  message?: string,
): void => {
  updateThreadRequestState(threadId, {
    isDesigning,
    designingMessage: message ?? (isDesigning ? 'Designing...' : ''),
  });
};

/**
 * Update the designing message for a thread (used by notify tool)
 */
export const setThreadDesigningMessage = (threadId: ThreadId, message: string): void => {
  updateThreadRequestState(threadId, {
    isDesigning: true,
    designingMessage: message,
  });
};

/**
 * Set image generating state for a thread (called when FAL image generation starts)
 * This persists even after streaming ends, until FAL completes
 */
export const setThreadImageGenerating = (
  threadId: ThreadId,
  isGenerating: boolean,
  message?: string,
): void => {
  updateThreadRequestState(threadId, {
    isGeneratingImage: isGenerating,
    imageGenerationMessage: message ?? (isGenerating ? 'Creating image...' : ''),
  });
};

/**
 * End streaming for a thread (complete or error)
 */
export const endThreadStreaming = (threadId: ThreadId, error?: string): void => {
  updateThreadRequestState(threadId, {
    isStreaming: false,
    streamingContent: '',
    isDesigning: false,
    designingMessage: '',
    currentRequestId: null,
    error: error ?? null,
    designProgress: null,
  });
};

/**
 * Clear request state for a thread
 */
export const clearThreadRequestState = (threadId: ThreadId): void => {
  const { [threadId]: _removed, ...rest } = threadRequestStates.value;
  threadRequestStates.value = rest;
};

// --- Thread management functions ---

/**
 * Get or create a thread for an element (or global)
 */
export const getOrCreateThread = (threadId: ThreadId): ThreadData => {
  const existing = elementThreads.value[threadId];
  if (existing) {
    return existing;
  }

  const newThread: ThreadData = {
    threadId,
    messages: [],
    lastUpdated: new Date(),
  };

  elementThreads.value = {
    ...elementThreads.value,
    [threadId]: newThread,
  };

  return newThread;
};

/**
 * Add a message to a specific thread.
 *
 * Returns the new message's id so callers can address it later — used by the
 * Design School "loading" experience to add a placeholder message and then
 * swap it to real content via `setMessageLearningContent`.
 */
export const addMessageToThread = (
  content: string,
  role: 'user' | 'assistant' | 'thread-ref',
  threadId: ThreadId,
  options?: {
    changes?: ChangeRecord[];
    requestId?: string;
    elementSnapshot?: ElementSnapshot;
    designSummary?: ChatMessage['designSummary'];
    quotedText?: string;
    threadRef?: ChatMessage['threadRef'];
    slidePickerData?: ChatMessage['slidePickerData'];
    learningContent?: ChatMessage['learningContent'];
    learningContentLoading?: ChatMessage['learningContentLoading'];
  },
): string => {
  const newMessage: ChatMessage = {
    id: generateMessageId(),
    role,
    content,
    timestamp: new Date(),
    changes: options?.changes,
    requestId: options?.requestId,
    elementSnapshot: options?.elementSnapshot,
    designSummary: options?.designSummary,
    quotedText: options?.quotedText,
    threadRef: options?.threadRef,
    slidePickerData: options?.slidePickerData,
    learningContent: options?.learningContent,
    learningContentLoading: options?.learningContentLoading,
  };

  const thread = getOrCreateThread(threadId);
  const updatedThread: ThreadData = {
    ...thread,
    messages: [...thread.messages, newMessage],
    lastUpdated: new Date(),
  };

  elementThreads.value = {
    ...elementThreads.value,
    [threadId]: updatedThread,
  };

  return newMessage.id;
};

/**
 * Add a user message to the current active thread
 */
export const addUserMessageToCurrentThread = (
  content: string,
  options?: { elementSnapshot?: ElementSnapshot },
): void => {
  addMessageToThread(content, 'user', activeThreadId.value, options);
};

/**
 * Add an assistant message to the current active thread
 */
export const addAssistantMessageToCurrentThread = (
  content: string,
  options?: { changes?: ChangeRecord[]; requestId?: string },
): void => {
  addMessageToThread(content, 'assistant', activeThreadId.value, options);
};

/**
 * Replace a placeholder learning-content message with the resolved content.
 *
 * Used by the Design School "loading" experience: a message is first added
 * with `learningContentLoading: true` to render the gradient skeleton, then
 * this helper flips the flag off and sets the real `learningContent` array
 * so the cards swap into place without inserting a second message.
 */
export const setMessageLearningContent = (
  threadId: ThreadId,
  messageId: string,
  learningContent: LearningItem[],
): void => {
  const thread = elementThreads.value[threadId];
  if (!thread) return;

  const updatedMessages = thread.messages.map(msg =>
    msg.id === messageId ? { ...msg, learningContent, learningContentLoading: false } : msg,
  );

  elementThreads.value = {
    ...elementThreads.value,
    [threadId]: {
      ...thread,
      messages: updatedMessages,
      lastUpdated: new Date(),
    },
  };
};

/**
 * Update the changes for a message (used for toggling changes)
 */
export const updateMessageChanges = (
  threadId: ThreadId,
  messageId: string,
  changes: ChangeRecord[],
): void => {
  const thread = elementThreads.value[threadId];
  if (!thread) return;

  const updatedMessages = thread.messages.map(msg =>
    msg.id === messageId ? { ...msg, changes } : msg,
  );

  elementThreads.value = {
    ...elementThreads.value,
    [threadId]: {
      ...thread,
      messages: updatedMessages,
      lastUpdated: new Date(),
    },
  };
};

/**
 * Delete a thread (called when element is deleted)
 */
export const deleteThread = (threadId: ThreadId): void => {
  if (threadId === 'global') return; // Never delete global thread

  const { [threadId]: _removed, ...rest } = elementThreads.value;
  elementThreads.value = rest;
};

/**
 * Clear all threads (for testing/reset)
 */
export const clearAllThreads = (): void => {
  elementThreads.value = {};
};

/**
 * Add a thread reference card to the presentation thread.
 * If a card for this thread already exists, moves it to the end
 * so the most recently active subthread always appears last.
 */
export const addThreadReference = (
  threadId: string,
  elementType: string,
  elementLabel: string,
  thumbnailUrl?: string,
  pageNumber?: number,
): void => {
  const presentationThread = elementThreads.value['presentation'];

  // If a reference for this thread already exists, remove it so we can re-add at the end
  if (presentationThread?.messages.some(m => m.threadRef?.threadId === threadId)) {
    const updatedThread: ThreadData = {
      ...presentationThread,
      messages: presentationThread.messages.filter(m => m.threadRef?.threadId !== threadId),
      lastUpdated: new Date(),
    };
    elementThreads.value = {
      ...elementThreads.value,
      presentation: updatedThread,
    };
  }

  addMessageToThread('', 'thread-ref', 'presentation', {
    threadRef: { threadId, elementType, elementLabel, thumbnailUrl, pageNumber },
  });
};

// --- Design Progress Management ---

/**
 * Initialize design progress tracking for a thread
 */
export const initDesignProgress = (threadId: ThreadId): void => {
  updateThreadRequestState(threadId, {
    designProgress: {
      actions: [],
      requestStartTime: Date.now(),
      isExpanded: true,
    },
  });
};

/**
 * Add a design action to the progress tracker
 */
export const addDesignAction = (
  threadId: ThreadId,
  toolName: string,
  displayName: string,
): void => {
  const current = getThreadRequestState(threadId);
  if (!current.designProgress) return;

  const newAction: ActionStep = {
    id: `${toolName}_${Date.now()}`,
    toolName,
    displayName,
    status: 'in_progress',
    startedAt: Date.now(),
  };

  updateThreadRequestState(threadId, {
    designProgress: {
      ...current.designProgress,
      actions: [...current.designProgress.actions, newAction],
    },
  });
};

/**
 * Mark the last matching in-progress action as completed
 */
export const completeDesignAction = (threadId: ThreadId, toolName: string): void => {
  const current = getThreadRequestState(threadId);
  if (!current.designProgress) return;

  const actions = [...current.designProgress.actions];
  // Find last in-progress action matching toolName
  for (let i = actions.length - 1; i >= 0; i--) {
    if (actions[i].toolName === toolName && actions[i].status === 'in_progress') {
      actions[i] = {
        ...actions[i],
        status: 'completed',
        completedAt: Date.now(),
        displayName: getToolDisplayName(toolName, 'completed'),
      };
      break;
    }
  }

  updateThreadRequestState(threadId, {
    designProgress: {
      ...current.designProgress,
      actions,
    },
  });
};

/**
 * Finalize design progress (set end time)
 */
export const finalizeDesignProgress = (threadId: ThreadId): void => {
  const current = getThreadRequestState(threadId);
  if (!current.designProgress) return;

  // Mark any remaining in-progress actions as completed
  const actions = current.designProgress.actions.map(action =>
    action.status === 'in_progress'
      ? {
          ...action,
          status: 'completed' as const,
          completedAt: Date.now(),
          displayName: getToolDisplayName(action.toolName, 'completed'),
        }
      : action,
  );

  updateThreadRequestState(threadId, {
    designProgress: {
      ...current.designProgress,
      actions,
      requestEndTime: Date.now(),
    },
  });
};

/**
 * Toggle the expanded state of the design progress action list
 */
export const toggleDesignProgressExpanded = (threadId: ThreadId): void => {
  const current = getThreadRequestState(threadId);
  if (!current.designProgress) return;

  updateThreadRequestState(threadId, {
    designProgress: {
      ...current.designProgress,
      isExpanded: !current.designProgress.isExpanded,
    },
  });
};

// --- Legacy signals (kept for backwards compatibility) ---
// Chat messages signal - now points to current thread messages
export const chatMessages = signal<ChatMessage[]>([
  {
    id: '1',
    role: 'assistant',
    content:
      "Hello! How can I assist you today? If you'd like to try something out or need help with a project, just let me know!",
    timestamp: new Date(),
  },
]);

// Computed: check if there are any messages
export const hasMessages = computed(() => chatMessages.value.length > 0);

// Actions (legacy - kept for backwards compatibility)
export const addChatMessage = (content: string, role: 'user' | 'assistant') => {
  const newMessage: ChatMessage = {
    id: generateMessageId(),
    role,
    content,
    timestamp: new Date(),
  };
  chatMessages.value = [...chatMessages.value, newMessage];
};

export const addUserMessage = (content: string) => {
  addChatMessage(content, 'user');
};

export const addAssistantMessage = (content: string) => {
  addChatMessage(content, 'assistant');
};

export const addElementChip = (elementType: 'text' | 'shape' | 'image', elementId: string) => {
  const newMessage: ChatMessage = {
    id: generateMessageId(),
    role: 'element',
    content: elementType.charAt(0).toUpperCase() + elementType.slice(1),
    elementType,
    elementId,
    timestamp: new Date(),
  };
  chatMessages.value = [...chatMessages.value, newMessage];
};

export const clearChatMessages = () => {
  chatMessages.value = [];
};
