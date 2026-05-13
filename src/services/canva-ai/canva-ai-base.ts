import { AIService } from '@canva-ct/genai';
import type { AIMessage, ToolDefinition } from '@canva-ct/genai';
import type { AIServiceCallbacks, AIHistoryEntry } from './types';

// Create shared AIService instance
const aiService = new AIService({ defaultModel: 'anthropic/claude-opus-4.5' });

// Base class for AI services
export abstract class CanvaAIBaseService {
  protected isProcessing = false;
  private _cancelledRequestId: string | null = null;

  public cancelCurrentRequest(requestId: string): void {
    this._cancelledRequestId = requestId;
    this.isProcessing = false;
  }

  public isRequestCancelled(requestId: string): boolean {
    return this._cancelledRequestId === requestId;
  }

  protected clearCancellation(): void {
    this._cancelledRequestId = null;
  }

  // Abstract methods that subclasses must implement
  protected abstract getTools(): ToolDefinition[];
  protected abstract getSystemPrompt(context: unknown): string;
  protected abstract getModelConfig(): {
    model: string;
    temperature: number;
    maxTokens: number;
    stream?: boolean; // Default: true. Set to false for tool-only calls like routing
  };

  // Common method to invoke AI with tools
  protected async invokeAI(
    input: string,
    context: unknown,
    callbacks: AIServiceCallbacks,
    history?: AIHistoryEntry[],
  ): Promise<void> {
    if (this.isProcessing) {
      console.log('Already processing a request');
      return;
    }

    this.isProcessing = true;
    this.clearCancellation();

    try {
      const systemPrompt = this.getSystemPrompt(context);
      const tools = this.getTools();
      const { model, temperature, maxTokens, stream = true } = this.getModelConfig();

      // Build messages array for AIService
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

      // Add system message if provided
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      // Add history messages
      if (history) {
        messages.push(
          ...history.map(msg => ({
            role: msg.role === 'user' ? ('user' as const) : ('assistant' as const),
            content: msg.content,
          })),
        );
      }

      // Add current input as user message
      messages.push({ role: 'user', content: input });

      // Use AIService for chat
      await aiService.chat(
        {
          messages,
          model,
          temperature,
          max_tokens: maxTokens,
          tools,
          stream, // Configurable: true for chat, false for routing
        },
        {
          onMessage: (message: AIMessage) => {
            console.log(`[CanvaAI] Received message:`, message.type);

            switch (message.type) {
              case 'on_chat_model_stream':
                if (
                  message.content
                  && typeof message.content === 'string'
                  && message.content.length > 0
                ) {
                  callbacks.onStream?.(message.content);
                }
                break;

              case 'on_chat_model_end':
                console.log(`[CanvaAI] Model generation completed`);
                callbacks.onModelEnd?.();
                break;

              case 'on_tool_start':
                console.log(`[CanvaAI] Tool started:`, message.tool_name);
                callbacks.onToolStart?.(message.tool_name || '');
                break;

              case 'on_tool_end':
                console.log(`[CanvaAI] Tool completed:`, {
                  toolName: message.tool_name,
                  content: message.content,
                });

                if (message.tool_name && message.content) {
                  const result = this.parseToolResult(message.content, message.tool_name);
                  if (result) {
                    callbacks.onToolEnd?.(message.tool_name, result);
                  }
                }
                break;

              case 'complete':
                console.log(`[CanvaAI] Received explicit complete message`);
                callbacks.onComplete?.();
                break;

              case 'error':
                console.error(`[CanvaAI] Error message:`, message.content);
                callbacks.onError?.(new Error((message.content as string) || 'Unknown error'));
                break;
            }
          },
          onError: error => {
            console.error(`[CanvaAI] Error:`, error);
            callbacks.onError?.(error);
          },
          onComplete: () => {
            console.log(`[CanvaAI] Stream completed`);
            callbacks.onComplete?.();
          },
        },
      );
    } catch (error) {
      console.error(`[CanvaAI] Error in AI invocation:`, error);
      callbacks.onError?.(error as Error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Parse tool results based on tool name
  protected parseToolResult(content: unknown, toolName: string): unknown {
    try {
      // Handle string content
      if (typeof content === 'string') {
        try {
          const parsed = JSON.parse(content);
          // If it's a generic wrapper, unwrap it
          if (parsed.type === 'generic' && parsed.output) {
            return parsed.output;
          }
          return parsed;
        } catch {
          return { message: content };
        }
      }

      // Handle object content
      if (content && typeof content === 'object') {
        // Handle wrapped responses
        if ((content as Record<string, unknown>).type === 'generic') {
          return (content as Record<string, unknown>).output;
        }

        // Handle direct responses
        return content;
      }

      return null;
    } catch (error) {
      console.error(`Failed to parse tool result for ${toolName}:`, error);
      return null;
    }
  }

  // Helper to sanitize data (remove base64 images)
  protected sanitizeData(data: unknown): unknown {
    if (!data) return data;

    if (typeof data === 'string') {
      // Check for url() wrapped base64 images
      if (data.includes("url('data:image") || data.includes('url("data:image')) {
        return '[BASE64 IMAGE URL REMOVED]';
      }
      // Check for base64 image data markers
      if (data.includes('data:image') && data.length > 200) {
        return '[BASE64 IMAGE DATA REMOVED]';
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (typeof data === 'object') {
      const sanitized: Record<string, unknown> = {};
      for (const key in data as Record<string, unknown>) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          sanitized[key] = this.sanitizeData((data as Record<string, unknown>)[key]);
        }
      }
      return sanitized;
    }

    return data;
  }
}
