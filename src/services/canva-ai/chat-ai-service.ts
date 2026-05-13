import type { ToolDefinition } from '@canva-ct/genai';
import { CanvaAIBaseService } from './canva-ai-base';
import type { AIServiceCallbacks, AIHistoryEntry } from './types';
import {
  addMessageToChatThread,
  startChatStreaming,
  appendChatStreamingContent,
  endChatStreaming,
  type ChatThreadId,
} from '@/store/signals/chatThread';

const CHAT_SYSTEM_PROMPT = `You are a friendly and helpful design assistant for Canva. You're conversational and personable - treat users like a creative collaborator, not a search engine.

**How to respond:**

- For casual messages (greetings, small talk): Respond naturally and warmly. Keep it brief and friendly.
- For design questions: Share helpful advice on design principles, color, typography, and layout.
- For research requests: Use web search to find current trends, examples, and inspiration.
- For brainstorming: Help explore ideas with enthusiasm and creativity.

**Keep in mind:**

- Be concise - don't over-explain simple things
- Match the user's energy and tone
- Only search the web when the user is actually asking for information or research
- You're chatting, not writing an encyclopedia article
- If someone wants to create a design, suggest they start a new design project

Do not use emojis unless the user uses them first.`;

/**
 * Chat AI Service
 * Handles conversational AI for the chat page (no design tools)
 */
export class ChatAIService extends CanvaAIBaseService {
  protected getTools(): ToolDefinition[] {
    // No tools for chat - pure conversation
    return [];
  }

  protected getSystemPrompt(): string {
    return CHAT_SYSTEM_PROMPT;
  }

  protected getModelConfig() {
    return {
      model: 'perplexity/sonar-reasoning-pro', // Web search enabled
      temperature: 0.7,
      maxTokens: 2048,
    };
  }

  /**
   * Process a user message in a chat thread
   */
  async processMessage(
    threadId: ChatThreadId,
    userMessage: string,
    history?: AIHistoryEntry[],
  ): Promise<void> {
    const requestId = `chat_req_${Date.now()}`;

    // Start streaming state for this thread
    startChatStreaming(threadId, requestId);

    // Track accumulated content for final message
    let accumulatedContent = '';

    // Guard to prevent double completion
    let completionHandled = false;
    let completionTimer: ReturnType<typeof setTimeout> | null = null;

    // Helper to perform actual completion
    const doComplete = () => {
      if (completionHandled) return;
      completionHandled = true;

      // Clear any pending timer
      if (completionTimer) {
        clearTimeout(completionTimer);
        completionTimer = null;
      }

      // End streaming state
      endChatStreaming(threadId);

      // Add the complete assistant message to the thread
      if (accumulatedContent.trim()) {
        console.log(
          '[ChatAIService] Adding message with content:',
          accumulatedContent.substring(0, 100) + '...',
        );
        addMessageToChatThread(threadId, accumulatedContent.trim(), 'assistant');
      } else {
        console.log('[ChatAIService] No accumulated content, adding fallback');
        addMessageToChatThread(threadId, 'I processed your request.', 'assistant');
      }
    };

    const callbacks: AIServiceCallbacks = {
      onStream: (content: string) => {
        // Don't update after completion
        if (completionHandled) return;

        console.log('[ChatAIService] Received stream chunk:', content.substring(0, 50));
        accumulatedContent += content;
        appendChatStreamingContent(threadId, content);
      },
      onComplete: () => {
        // Use debounce pattern - the base service may call onComplete multiple times
        if (completionTimer) {
          clearTimeout(completionTimer);
        }
        // Schedule completion with a small delay to allow any final content to arrive
        completionTimer = setTimeout(doComplete, 100);
      },
      onError: (error: Error) => {
        if (completionHandled) return;
        completionHandled = true;

        // Clear any pending timer
        if (completionTimer) {
          clearTimeout(completionTimer);
          completionTimer = null;
        }

        console.error('[ChatAIService] Error:', error);
        endChatStreaming(threadId, error.message);
        addMessageToChatThread(
          threadId,
          `Sorry, I encountered an error: ${error.message}`,
          'assistant',
        );
      },
    };

    try {
      console.log('[ChatAIService] Starting AI invocation for thread:', threadId);
      await this.invokeAI(userMessage, null, callbacks, history);
      console.log('[ChatAIService] AI invocation completed');
    } catch (error) {
      if (completionHandled) return;
      completionHandled = true;

      console.error('[ChatAIService] Error processing message:', error);
      endChatStreaming(threadId, (error as Error).message);
      addMessageToChatThread(
        threadId,
        `Sorry, I encountered an error: ${(error as Error).message}`,
        'assistant',
      );
    }
  }

  /**
   * Convert chat thread messages to AI history format
   */
  static convertToHistory(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  ): AIHistoryEntry[] {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));
  }
}

// Export singleton instance
export const chatAIService = new ChatAIService();
