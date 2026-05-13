import { AIService } from '@canva-ct/genai';
import type { ToolDefinition } from '@canva-ct/genai';
import type { ElementData } from '@/store/signals/canvasState';
import type { ImageToElementsResult, ImageToElementsRequest } from './types';
import { IMAGE_TO_ELEMENTS_SYSTEM_PROMPT, buildImageToElementsUserPrompt } from './prompt';

// Create AI service instance configured for vision analysis
const aiService = new AIService({
  defaultModel: 'anthropic/claude-opus-4.5',
});

/**
 * Tool definition that enforces the ElementData structure
 * This ensures Claude returns data in the exact format needed for canvas elements
 */
const imageToElementsTool: ToolDefinition = {
  name: 'image_to_elements_structure',
  description:
    'Analyzes an image of a design and extracts the structural information of visual elements, converting them into a structured array of elements with positioning, styling, and content details',
  parameters: {
    type: 'object',
    properties: {
      elements: {
        type: 'array',
        description: 'Array of visual elements found in the design',
        items: {
          type: 'object',
          properties: {
            elementId: {
              type: 'string',
              description: 'Unique identifier for the element (snake_case format)',
            },
            type: {
              type: 'string',
              enum: ['image', 'shape', 'text', 'video'],
              description: 'Type of the visual element',
            },
            content: {
              type: 'string',
              description:
                'Text content of the element (for text elements) or detailed image description for regeneration (for image elements)',
            },
            style: {
              type: 'object',
              description:
                'CSS-like styling properties for the element (React.CSSProperties compatible). Can include any valid CSS property as key-value pairs where keys are camelCase CSS property names and values are strings representing CSS values.',
              additionalProperties: {
                type: 'string',
                description:
                  'Any CSS property value as a string (e.g., "20px", "#000000", "bold", "center", etc.)',
              },
            },
          },
          required: ['elementId', 'type'],
        },
      },
    },
    required: ['elements'],
  },
};

/**
 * Service for converting slide images into editable canvas elements
 * Uses Gemini 3 with tool-based structured output
 */
class ImageToElementsService {
  private readonly canvasWidth = 1067;
  private readonly canvasHeight = 600;

  /**
   * Convert a slide image to editable canvas elements
   * @param request - Contains image URL and optional canvas dimensions
   * @returns Elements array and image generation prompts
   */
  async convertImageToElements(request: ImageToElementsRequest): Promise<ImageToElementsResult> {
    const { imageUrl, canvasWidth = this.canvasWidth, canvasHeight = this.canvasHeight } = request;

    try {
      console.log('[ImageToElements] Starting image analysis with tool...');

      // Build the user prompt
      const userPrompt = buildImageToElementsUserPrompt(canvasWidth, canvasHeight);

      // Call Gemini with the tool - elements come back in correct format
      const elements = await this.analyzeImageWithTool(imageUrl, userPrompt);

      console.log(`[ImageToElements] analyzeImageWithTool returned:`, {
        isArray: Array.isArray(elements),
        length: elements?.length ?? 'null/undefined',
        firstElement: elements?.[0]?.elementId ?? 'none',
      });

      if (!elements || elements.length === 0) {
        throw new Error('No elements extracted from image');
      }

      console.log(`[ImageToElements] Extracted ${elements.length} elements`);

      // Extract background color from large shapes before filtering them out
      const backgroundColor = this.extractBackgroundColor(elements);

      // Filter out background shapes (now that we've extracted the color)
      const filteredElements = this.filterBackgroundElements(elements);

      // Extract image prompts from content field for image elements
      const imageElementPrompts = this.extractImagePrompts(filteredElements);

      return {
        elements: filteredElements,
        imageElementPrompts,
        backgroundColor,
        status: 'success',
      };
    } catch (error) {
      console.error('[ImageToElements] Error:', error);
      return {
        elements: [],
        imageElementPrompts: new Map(),
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Analyze image using Gemini with tool-based structured output
   */
  private async analyzeImageWithTool(imageUrl: string, userPrompt: string): Promise<ElementData[]> {
    return new Promise((resolve, reject) => {
      let extractedElements: ElementData[] = [];
      let resolved = false;
      let toolEndReceived = false;

      // Timeout fallback - reject if no tool response within 60 seconds
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log(
            '[ImageToElements] Timeout - toolEndReceived:',
            toolEndReceived,
            'elements:',
            extractedElements.length,
          );
          reject(new Error('Timeout waiting for tool response'));
        }
      }, 60000);

      // Build message with image content
      const imageContent = {
        type: 'image_url' as const,
        image_url: { url: imageUrl },
      };

      aiService.chat(
        {
          messages: [
            {
              role: 'system',
              content: IMAGE_TO_ELEMENTS_SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: [imageContent, { type: 'text' as const, text: userPrompt }] as unknown,
            },
          ],
          model: 'anthropic/claude-opus-4.5',
          max_tokens: 10000,
          tools: [imageToElementsTool],
        },
        {
          onMessage: message => {
            console.log(`[ImageToElements] Message:`, {
              type: message.type,
              tool_name: message.tool_name,
              hasContent: !!message.content,
            });

            if (message.type === 'on_tool_start') {
              console.log(`[ImageToElements] Tool started: ${message.tool_name}`);
            }

            // Check for tool end - handle both direct and wrapped formats
            if (message.type === 'on_tool_end') {
              console.log(`[ImageToElements] Tool ended: ${message.tool_name}`);

              // Only process our specific tool
              if (message.tool_name === 'image_to_elements_structure') {
                console.log('[ImageToElements] Processing image_to_elements_structure result...');

                try {
                  // Parse the tool result
                  let parsed: Record<string, unknown>;

                  if (typeof message.content === 'string') {
                    parsed = JSON.parse(message.content);
                  } else if (message.content && typeof message.content === 'object') {
                    parsed = message.content as Record<string, unknown>;
                  } else {
                    console.error('[ImageToElements] Invalid content:', message.content);
                    return;
                  }

                  // Handle multiple possible structures:
                  // 1. { elements: [...] }
                  // 2. { data: { elements: [...] } }
                  let elements: ElementData[] | undefined;

                  if (parsed.elements && Array.isArray(parsed.elements)) {
                    elements = parsed.elements as ElementData[];
                  } else if (
                    parsed.data
                    && typeof parsed.data === 'object'
                    && (parsed.data as Record<string, unknown>).elements
                    && Array.isArray((parsed.data as Record<string, unknown>).elements)
                  ) {
                    elements = (parsed.data as Record<string, unknown>).elements as ElementData[];
                  }

                  if (elements && elements.length > 0) {
                    // Sanitize IDs - filtering and background extraction happens in convertImageToElements
                    extractedElements = this.sanitizeElements(elements);
                    toolEndReceived = true;

                    console.log(
                      `[ImageToElements] SUCCESS! Extracted ${extractedElements.length} elements`,
                    );
                    // Resolve immediately when we get elements
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(timeout);
                      // Create a copy of the array to avoid any potential reference issues
                      const elementsCopy = [...extractedElements];
                      console.log(
                        `[ImageToElements] Resolving with ${elementsCopy.length} elements`,
                      );
                      resolve(elementsCopy);
                    }
                  } else {
                    console.warn('[ImageToElements] No elements found in parsed response');
                    toolEndReceived = true; // Mark as received even if empty
                  }
                } catch (parseError) {
                  console.error('[ImageToElements] Parse error:', parseError);
                }
              }
            }
          },
          onError: error => {
            console.error('[ImageToElements] API error:', error);
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              reject(error);
            }
          },
          onComplete: () => {
            console.log(
              `[ImageToElements] Stream complete. resolved: ${resolved}, toolEndReceived: ${toolEndReceived}, elements: ${extractedElements.length}`,
            );
            // IMPORTANT: When using tools, onComplete fires BEFORE on_tool_end events arrive.
            // Do NOT resolve here - let on_tool_end or the timeout handle resolution.
            // Only resolve from onComplete if tools already completed with elements.
            if (!resolved && toolEndReceived && extractedElements.length > 0) {
              resolved = true;
              clearTimeout(timeout);
              const elementsCopy = [...extractedElements];
              console.log(
                `[ImageToElements] Resolving from onComplete with ${elementsCopy.length} elements`,
              );
              resolve(elementsCopy);
            } else if (!resolved) {
              console.log(
                `[ImageToElements] onComplete: waiting for tool events (toolEndReceived: ${toolEndReceived})`,
              );
              // Don't resolve yet - tool events may still arrive after onComplete
            }
          },
        },
      );
    });
  }

  /**
   * Extract background color from large shapes that cover most of the canvas
   * This should be called BEFORE filterBackgroundElements
   */
  private extractBackgroundColor(elements: ElementData[]): string | undefined {
    // Look for shapes that cover >90% of the canvas - these are backgrounds
    for (const el of elements) {
      if (el.type !== 'shape') continue;

      const style = el.style || {};
      const width = parseInt(String(style.width).replace('px', ''), 10);
      const height = parseInt(String(style.height).replace('px', ''), 10);

      // If no width/height, skip
      if (isNaN(width) || isNaN(height)) continue;

      // Check if it covers > 90% of the canvas
      const isFullWidth = width > this.canvasWidth * 0.9;
      const isFullHeight = height > this.canvasHeight * 0.9;

      if (isFullWidth && isFullHeight) {
        // Extract background color
        const bgColor = style.backgroundColor || style.background;
        if (bgColor && typeof bgColor === 'string' && bgColor !== 'transparent') {
          console.log(
            `[ImageToElements] Extracted background color: ${bgColor} from shape ${el.elementId}`,
          );
          return bgColor;
        }
      }
    }

    return undefined;
  }

  /**
   * Filter out background shapes that cover most of the canvas
   */
  private filterBackgroundElements(elements: ElementData[]): ElementData[] {
    return elements.filter(el => {
      if (el.type !== 'shape') return true;

      const style = el.style || {};
      const width = parseInt(String(style.width).replace('px', ''), 10);
      const height = parseInt(String(style.height).replace('px', ''), 10);

      // If no width/height, keep it
      if (isNaN(width) || isNaN(height)) return true;

      // Check if it covers > 90% of the canvas
      const isFullWidth = width > this.canvasWidth * 0.9;
      const isFullHeight = height > this.canvasHeight * 0.9;

      if (isFullWidth && isFullHeight) {
        console.log(
          `[ImageToElements] Removing background shape: ${el.elementId} (${width}x${height})`,
        );
        return false;
      }

      return true;
    });
  }

  /**
   * Sanitize element IDs to ensure they are valid snake_case and unique
   */
  private sanitizeElements(elements: ElementData[]): ElementData[] {
    const seenIds = new Set<string>();

    return elements.map(el => {
      // Convert to snake_case: lowercase, replace non-alphanumeric with underscore
      let id = el.elementId.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      // Remove multiple consecutive underscores
      id = id.replace(/_+/g, '_');
      // Remove leading/trailing underscores
      id = id.replace(/^_+|_+$/g, '');

      // Ensure non-empty
      if (!id) id = 'element';

      // Ensure uniqueness
      let uniqueId = id;
      let counter = 1;
      while (seenIds.has(uniqueId)) {
        uniqueId = `${id}_${counter}`;
        counter++;
      }
      seenIds.add(uniqueId);

      if (uniqueId !== el.elementId) {
        console.log(`[ImageToElements] Sanitized ID: ${el.elementId} -> ${uniqueId}`);
      }

      return {
        ...el,
        elementId: uniqueId,
      };
    });
  }

  /**
   * Extract image generation prompts from elements
   * For image elements, the content field contains the description for regeneration
   */
  private extractImagePrompts(elements: ElementData[]): Map<string, string> {
    const imageElementPrompts = new Map<string, string>();

    elements.forEach(element => {
      if (element.type === 'image' && element.content) {
        imageElementPrompts.set(element.elementId, element.content);
        console.log(
          `[ImageToElements] Image prompt for ${element.elementId}: ${element.content.substring(0, 50)}...`,
        );
      }
    });

    console.log(`[ImageToElements] Found ${imageElementPrompts.size} images to generate`);

    return imageElementPrompts;
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return aiService.isConfigured();
  }
}

// Export singleton instance
export const imageToElementsService = new ImageToElementsService();
export type { ImageToElementsResult, ImageToElementsRequest } from './types';
