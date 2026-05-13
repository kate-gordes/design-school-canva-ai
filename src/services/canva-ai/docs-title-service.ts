import { AIService } from '@canva-ct/genai';
import type { AIMessage } from '@canva-ct/genai';

// Dedicated AIService instance — the shared one in canva-ai-base.ts is
// module-private and its base class has an isProcessing guard that could conflict.
const titleAIService = new AIService({ defaultModel: 'google/gemini-3-flash-preview' });

/**
 * Generate a short descriptive title for a docs document based on the user's
 * first AI prompt and the current document content.
 *
 * Returns the title string on success, or null on failure (caller keeps default).
 */
export async function generateDocsTitle(
  userPrompt: string,
  documentContent: string,
): Promise<string | null> {
  try {
    const trimmedContent = documentContent.slice(0, 500);

    const messages: Array<{ role: 'system' | 'user'; content: string }> = [
      {
        role: 'system',
        content:
          'Generate a short, descriptive document title (3-7 words). Return ONLY the title text, nothing else. No quotes, no punctuation at the end, no explanation.',
      },
      {
        role: 'user',
        content: `User request: ${userPrompt}\n\nDocument content so far:\n${trimmedContent}`,
      },
    ];

    let titleText = '';

    await titleAIService.chat(
      {
        messages,
        model: 'google/gemini-3-flash-preview',
        temperature: 0.3,
        max_tokens: 64,
        stream: false,
        tools: [],
      },
      {
        onMessage: (message: AIMessage) => {
          // With stream: false, content arrives as a single on_chat_model_end message
          if (
            (message.type === 'on_chat_model_end' || message.type === 'on_chat_model_stream')
            && message.content
            && typeof message.content === 'string'
          ) {
            titleText += message.content;
          }
        },
        onError: (error: Error) => {
          console.error('[DocsTitle] Error generating title:', error);
        },
        onComplete: (response?: unknown) => {
          // onComplete receives the full AIResponse when stream: false
          if (!titleText && response && typeof response === 'object') {
            const content = (response as { content?: string }).content;
            if (content && typeof content === 'string') {
              titleText = content;
            }
          }
        },
      },
    );

    const cleaned = titleText.trim().replace(/^["']|["']$/g, '');
    return cleaned || null;
  } catch (error) {
    console.error('[DocsTitle] Failed to generate title:', error);
    return null;
  }
}
