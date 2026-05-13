import { signal, computed } from '@preact/signals-react';

// Types for chat threads (separate from editor threads)
export type ChatThreadId = string;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatThreadData {
  threadId: ChatThreadId;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
  initialQuery: string; // The query that created this thread
}

export interface ChatThreadRequestState {
  isStreaming: boolean;
  streamingContent: string;
  currentRequestId: string | null;
  error: string | null;
}

const defaultChatThreadRequestState: ChatThreadRequestState = {
  isStreaming: false,
  streamingContent: '',
  currentRequestId: null,
  error: null,
};

// --- Chat Thread Signals ---

// Map of chat thread ID → thread data
export const chatThreads = signal<Record<ChatThreadId, ChatThreadData>>({});

// Per-thread streaming/request state
export const chatThreadRequestStates = signal<Record<ChatThreadId, ChatThreadRequestState>>({});

// Currently active chat thread ID
export const activeChatThreadId = signal<ChatThreadId | null>(null);

// --- Computed Values ---

// Get the active chat thread
export const activeChatThread = computed<ChatThreadData | null>(() => {
  const threadId = activeChatThreadId.value;
  if (!threadId) return null;
  return chatThreads.value[threadId] ?? null;
});

// Get messages for the active chat thread
export const activeChatThreadMessages = computed<ChatMessage[]>(() => {
  return activeChatThread.value?.messages ?? [];
});

// Get request state for the active chat thread
export const activeChatThreadRequestState = computed<ChatThreadRequestState>(() => {
  const threadId = activeChatThreadId.value;
  if (!threadId) return defaultChatThreadRequestState;
  return chatThreadRequestStates.value[threadId] ?? defaultChatThreadRequestState;
});

// Convenience computed values for active thread
export const isActiveChatThreadStreaming = computed(
  () => activeChatThreadRequestState.value.isStreaming,
);
export const activeChatStreamingContent = computed(
  () => activeChatThreadRequestState.value.streamingContent,
);

// --- Actions ---

/**
 * Generate a unique ID for a chat thread
 */
export const generateChatThreadId = (): string => {
  return `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Create a new chat thread with an initial user message
 */
export const createChatThread = (threadId: ChatThreadId, initialQuery: string): ChatThreadData => {
  const now = new Date();

  const newThread: ChatThreadData = {
    threadId,
    messages: [
      {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: initialQuery,
        timestamp: now,
      },
    ],
    createdAt: now,
    lastUpdated: now,
    initialQuery,
  };

  chatThreads.value = {
    ...chatThreads.value,
    [threadId]: newThread,
  };

  return newThread;
};

/**
 * Get or create a chat thread
 */
export const getOrCreateChatThread = (
  threadId: ChatThreadId,
  initialQuery?: string,
): ChatThreadData => {
  const existing = chatThreads.value[threadId];
  if (existing) {
    return existing;
  }

  return createChatThread(threadId, initialQuery ?? '');
};

/**
 * Set the active chat thread ID
 */
export const setActiveChatThreadId = (threadId: ChatThreadId | null): void => {
  activeChatThreadId.value = threadId;
};

/**
 * Add a message to a specific chat thread
 */
export const addMessageToChatThread = (
  threadId: ChatThreadId,
  content: string,
  role: 'user' | 'assistant',
): void => {
  const thread = chatThreads.value[threadId];
  if (!thread) {
    console.warn(`[ChatThread] Thread not found: ${threadId}`);
    return;
  }

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    role,
    content,
    timestamp: new Date(),
  };

  chatThreads.value = {
    ...chatThreads.value,
    [threadId]: {
      ...thread,
      messages: [...thread.messages, newMessage],
      lastUpdated: new Date(),
    },
  };
};

/**
 * Get request state for a specific chat thread
 */
export const getChatThreadRequestState = (threadId: ChatThreadId): ChatThreadRequestState => {
  return chatThreadRequestStates.value[threadId] ?? defaultChatThreadRequestState;
};

/**
 * Update request state for a specific chat thread
 */
export const updateChatThreadRequestState = (
  threadId: ChatThreadId,
  updates: Partial<ChatThreadRequestState>,
): void => {
  const current = chatThreadRequestStates.value[threadId] ?? defaultChatThreadRequestState;
  chatThreadRequestStates.value = {
    ...chatThreadRequestStates.value,
    [threadId]: { ...current, ...updates },
  };
};

/**
 * Start streaming for a chat thread
 */
export const startChatStreaming = (threadId: ChatThreadId, requestId: string): void => {
  updateChatThreadRequestState(threadId, {
    isStreaming: true,
    streamingContent: '',
    currentRequestId: requestId,
    error: null,
  });
};

/**
 * Append streaming content for a chat thread
 */
export const appendChatStreamingContent = (threadId: ChatThreadId, content: string): void => {
  const current = chatThreadRequestStates.value[threadId];
  if (current) {
    updateChatThreadRequestState(threadId, {
      streamingContent: current.streamingContent + content,
    });
  }
};

/**
 * End streaming for a chat thread (complete or error)
 */
export const endChatStreaming = (threadId: ChatThreadId, error?: string): void => {
  updateChatThreadRequestState(threadId, {
    isStreaming: false,
    streamingContent: '',
    currentRequestId: null,
    error: error ?? null,
  });
};

/**
 * Delete a chat thread
 */
export const deleteChatThread = (threadId: ChatThreadId): void => {
  const { [threadId]: _removed, ...rest } = chatThreads.value;
  chatThreads.value = rest;

  // Also clear request state
  const { [threadId]: _removedState, ...restStates } = chatThreadRequestStates.value;
  chatThreadRequestStates.value = restStates;

  // Clear active thread if it was deleted
  if (activeChatThreadId.value === threadId) {
    activeChatThreadId.value = null;
  }
};

/**
 * Clear all chat threads (for testing/reset)
 */
export const clearAllChatThreads = (): void => {
  chatThreads.value = {};
  chatThreadRequestStates.value = {};
  activeChatThreadId.value = null;
};
