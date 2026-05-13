import type { ToolDefinition } from '@canva-ct/genai';
import { CanvaAIBaseService } from './canva-ai-base';

export type RoutingDestination = 'presentation' | 'docs' | 'chat';

export interface RoutingResult {
  destination: RoutingDestination;
  confidence?: number;
  reasoning?: string;
}

// Route intent tool definition
const routeIntentTool: ToolDefinition = {
  name: 'route_intent',
  description:
    'Determine where to route a user query based on their intent. Use "presentation" for visual design creation, "docs" for text-heavy document writing, and "chat" for questions, advice, or brainstorming.',
  parameters: {
    type: 'object',
    properties: {
      destination: {
        type: 'string',
        enum: ['presentation', 'docs', 'chat'],
        description:
          '"presentation" for visual design creation (presentations, slides, decks, posters, graphics, images, social media). "docs" for writing text-heavy content (documents, articles, reports, notes, blog posts, essays, documentation, outlines). "chat" for conversations, questions, advice, brainstorming, or general help.',
      },
      reasoning: {
        type: 'string',
        description: 'Brief explanation for the routing decision',
      },
    },
    required: ['destination'],
  },
};

const ROUTING_SYSTEM_PROMPT = `You are an intent classifier for a design application. Your job is to determine whether a user's query should be routed to:

1. **presentation** - For creating visual designs:
   - Creating presentations, slides, or decks
   - Making posters, flyers, or graphics
   - Generating images or illustrations
   - Creating social media posts
   - Any request to "create", "make", "design", "generate" visual content
   - Example queries: "Create a presentation about...", "Make a poster for...", "Generate an image of...", "Design a logo"

2. **docs** - For writing text-heavy content:
   - Writing documents, articles, or reports
   - Creating notes, blog posts, or essays
   - Writing documentation or outlines
   - Any request to "write", "draft", "compose" text-based content
   - Example queries: "Write a blog post about...", "Draft a report on...", "Create an outline for...", "Write meeting notes about..."

3. **chat** - For conversations and advice:
   - Questions about design (trends, best practices, tips)
   - Brainstorming ideas (without immediately creating)
   - General questions, greetings, or help requests
   - Seeking advice or suggestions
   - Conversational starters or open-ended discussion
   - Learning about features or capabilities
   - Example queries: "What are the best colors for...", "Help me brainstorm ideas for...", "How do I...", "What's trending in...", "Let's talk about...", "I need help with...", "Can you help me...", "Hi", "Hello", "Let's chat"

When in doubt:
- If the user wants something MADE/CREATED visually → presentation
- If the user wants to WRITE/DRAFT text-heavy content → docs
- If the user wants to DISCUSS/LEARN/EXPLORE ideas → chat
- If the query is conversational, a greeting, or open-ended → chat
- Only route to "presentation" if there's a clear intent to CREATE something visual
- Only route to "docs" if there's a clear intent to WRITE text-based content

IMPORTANT: You MUST call the route_intent tool with your decision. Do not respond with text.`;

const VALID_DESTINATIONS: RoutingDestination[] = ['presentation', 'docs', 'chat'];

/**
 * Routing Service
 * Determines whether user queries should be routed to presentation, docs, or chat
 */
export class RoutingService extends CanvaAIBaseService {
  private routingResult: RoutingResult | null = null;

  protected getTools(): ToolDefinition[] {
    return [routeIntentTool];
  }

  protected getSystemPrompt(): string {
    return ROUTING_SYSTEM_PROMPT;
  }

  protected getModelConfig() {
    return {
      model: 'google/gemini-3-flash-preview',
      temperature: 0.3, // Lower temperature for consistent routing
      maxTokens: 256, // Low maxTokens for fast responses
      stream: false, // No streaming needed - just execute tool and return
    };
  }

  /**
   * Route a user query to determine the appropriate destination
   */
  async routeQuery(userQuery: string): Promise<RoutingResult> {
    // Reset result
    this.routingResult = null;

    // Create a promise that resolves when we get a tool result
    // Note: Tool events come AFTER on_chat_model_end/onComplete in the stream,
    // so we can't use onComplete as a signal - we must wait for the tool or timeout
    return new Promise<RoutingResult>(resolve => {
      let resolved = false;

      const doResolve = (result: RoutingResult, timeoutId: ReturnType<typeof setTimeout>) => {
        if (resolved) return;
        resolved = true;
        clearTimeout(timeoutId);
        console.log('[RoutingService] Routing result:', result);
        resolve(result);
      };

      // Timeout after 5 seconds - default to presentation
      // Tool results typically come within 1-2 seconds
      const timeoutId = setTimeout(() => {
        console.log('[RoutingService] Timeout waiting for tool result, defaulting to presentation');
        doResolve({ destination: 'presentation' }, timeoutId);
      }, 5000);

      this.invokeAI(userQuery, null, {
        onToolEnd: (toolName, result) => {
          if (toolName === 'route_intent') {
            const toolResult = (result as { data?: unknown })?.data || result;
            const raw = (toolResult as { destination?: string })?.destination;
            const destination: RoutingDestination = VALID_DESTINATIONS.includes(
              raw as RoutingDestination,
            )
              ? (raw as RoutingDestination)
              : 'presentation';
            doResolve(
              {
                destination,
                reasoning: (toolResult as { reasoning?: string })?.reasoning,
              },
              timeoutId,
            );
          }
        },
        // Don't resolve on onComplete - tool events come AFTER stream completion
        onError: error => {
          console.error('[RoutingService] Error during routing:', error);
          doResolve({ destination: 'presentation' }, timeoutId);
        },
      }).catch(error => {
        console.error('[RoutingService] Error routing query:', error);
        doResolve({ destination: 'presentation' }, timeoutId);
      });
    });
  }
}

// Export singleton instance
export const routingService = new RoutingService();
