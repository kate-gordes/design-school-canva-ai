import { falImageService } from '../canva-ai/fal-image-service';
import {
  setElementLoadingState,
  updateElementBackgroundImage,
  clearPendingImagePrompt,
} from '@/store/signals/canvasState';

/**
 * Queued image generation item
 */
interface QueuedItem {
  canvasId: number;
  elementId: string;
  prompt: string;
  retryCount: number;
}

/**
 * Service for queuing and processing image generation requests
 * Limits concurrent requests to prevent API overload
 * Uses Fal.ai for image generation
 */
class ImageGenerationService {
  private queue: QueuedItem[] = [];
  private processing: Set<string> = new Set();
  private readonly maxConcurrent = 2;
  private readonly maxRetries = 2;
  private pendingPromises: Map<
    string,
    { resolve: (url: string) => void; reject: (error: Error) => void }
  > = new Map();

  /**
   * Generate a single image - convenience method that returns a Promise
   * Useful for simple one-off image generation without managing element state
   * @param prompt - The prompt for image generation
   */
  async generateImage(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      console.log(`🎨 [ImageGeneration] Simple generation request: ${tempId}`);

      // Store resolve/reject callbacks for this request
      this.pendingPromises.set(tempId, { resolve, reject });

      // Add to queue with a special marker (canvasId = -1 means no canvas state updates)
      this.queue.push({
        canvasId: -1,
        elementId: tempId,
        prompt,
        retryCount: 0,
      });

      // Process queue
      this.processQueue();
    });
  }

  /**
   * Queue an image generation request for an element
   */
  async queueImageGeneration(canvasId: number, elementId: string, prompt: string): Promise<void> {
    console.log(`🎨 [ImageGeneration] Queuing image generation for element ${elementId}`);

    // Set initial loading state
    setElementLoadingState(elementId, {
      status: 'loading',
      message: 'Waiting in queue...',
    });

    // Add to queue
    this.queue.push({
      canvasId,
      elementId,
      prompt,
      retryCount: 0,
    });

    // Process queue
    this.processQueue();
  }

  /**
   * Queue multiple image generations at once
   */
  async queueBatchImageGeneration(
    canvasId: number,
    imagePrompts: Map<string, string>,
  ): Promise<void> {
    console.log(`🎨 [ImageGeneration] Queuing batch of ${imagePrompts.size} image generations`);

    for (const [elementId, prompt] of imagePrompts) {
      // Set initial loading state
      setElementLoadingState(elementId, {
        status: 'loading',
        message: 'Waiting in queue...',
      });

      // Add to queue
      this.queue.push({
        canvasId,
        elementId,
        prompt,
        retryCount: 0,
      });
    }

    // Process queue
    this.processQueue();
  }

  /**
   * Process the queue, respecting concurrency limits
   */
  private processQueue(): void {
    // Check if we can process more items
    while (this.processing.size < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (item) {
        this.processItem(item);
      }
    }
  }

  /**
   * Process a single queue item (generate image)
   */
  private async processItem(item: QueuedItem): Promise<void> {
    const { canvasId, elementId, prompt, retryCount } = item;
    const isSimpleGeneration = canvasId === -1;
    const pendingPromise = this.pendingPromises.get(elementId);

    // Mark as processing
    this.processing.add(elementId);

    // Update loading state (only for canvas-bound elements)
    if (!isSimpleGeneration) {
      setElementLoadingState(elementId, {
        status: 'loading',
        message: 'Generating image...',
      });
    }

    console.log(`🎨 [ImageGeneration] Generating image for element ${elementId}`);

    try {
      // Use Fal.ai service to generate image
      const result = await falImageService.generateImage(this.buildImagePrompt(prompt), {
        width: 800,
        height: 600,
      });

      if (!result.url) {
        throw new Error('No image URL returned from Fal.ai');
      }

      console.log(`✅ [ImageGeneration] Image generated for element ${elementId}`, {
        canvasId,
        imageUrlLength: result.url.length,
      });

      if (isSimpleGeneration && pendingPromise) {
        // Resolve the Promise for simple generation
        pendingPromise.resolve(result.url);
        this.pendingPromises.delete(elementId);
      } else {
        // Update the element with the generated image
        console.log(
          `🔄 [ImageGeneration] Calling updateElementBackgroundImage for canvas ${canvasId}, element ${elementId}`,
        );
        updateElementBackgroundImage(canvasId, elementId, result.url);
        // Clear loading state
        setElementLoadingState(elementId, null);
        // Clear pending image prompt (marks generation as complete)
        clearPendingImagePrompt(elementId);
        console.log(`✅ [ImageGeneration] Element ${elementId} background updated`);
      }
    } catch (error) {
      console.error(`❌ [ImageGeneration] Error generating image for ${elementId}:`, error);

      // Retry logic
      if (retryCount < this.maxRetries) {
        console.log(
          `🔄 [ImageGeneration] Retrying image generation for ${elementId} (attempt ${retryCount + 2}/${this.maxRetries + 1})`,
        );

        // Re-queue with incremented retry count
        this.queue.push({
          ...item,
          retryCount: retryCount + 1,
        });

        // Update loading state to show retry (only for canvas-bound elements)
        if (!isSimpleGeneration) {
          setElementLoadingState(elementId, {
            status: 'loading',
            message: `Retrying... (${retryCount + 2}/${this.maxRetries + 1})`,
          });
        }
      } else {
        // Max retries exceeded
        const errorObj = error instanceof Error ? error : new Error('Failed to generate image');

        if (isSimpleGeneration && pendingPromise) {
          // Reject the Promise for simple generation
          pendingPromise.reject(errorObj);
          this.pendingPromises.delete(elementId);
        } else {
          // Set error state for canvas-bound elements
          setElementLoadingState(elementId, {
            status: 'error',
            message: errorObj.message,
          });
        }
      }
    } finally {
      // Mark as no longer processing
      this.processing.delete(elementId);

      // Continue processing queue
      this.processQueue();
    }
  }

  /**
   * Build the image generation prompt with additional context
   * IMPORTANT: This prompt explicitly instructs the AI to create standalone images,
   * NOT slide-like images with text overlays or design elements
   */
  private buildImagePrompt(description: string): string {
    return `Create a standalone image based on this description:

${description}

CRITICAL REQUIREMENTS:
- Create a STANDALONE IMAGE, NOT a presentation slide
- Do NOT include ANY text, titles, captions, labels, or watermarks
- Do NOT include slide design elements (borders, frames, text boxes, bullet points)
- Do NOT include UI elements or decorative slide borders
- Focus ONLY on the visual subject matter described above
- The image will be PLACED ON a slide - it should not look like a slide itself

Style requirements:
- High quality and professional appearance
- Good composition and visual balance
- Clear subject matter with clean background integration`;
  }

  /**
   * Get the current queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Get the number of items currently being processed
   */
  getProcessingCount(): number {
    return this.processing.size;
  }

  /**
   * Cancel all pending generations for a specific canvas
   */
  cancelCanvasGenerations(canvasId: number): void {
    // Remove from queue
    this.queue = this.queue.filter(item => {
      if (item.canvasId === canvasId) {
        // Clear loading state
        setElementLoadingState(item.elementId, null);
        return false;
      }
      return true;
    });

    console.log(`🚫 [ImageGeneration] Cancelled pending generations for canvas ${canvasId}`);
  }

  /**
   * Retry a failed image generation
   */
  retryImageGeneration(canvasId: number, elementId: string, prompt: string): void {
    console.log(`🔄 [ImageGeneration] Manual retry for element ${elementId}`);

    // Clear error state and re-queue
    setElementLoadingState(elementId, {
      status: 'loading',
      message: 'Retrying...',
    });

    this.queue.push({
      canvasId,
      elementId,
      prompt,
      retryCount: 0,
    });

    this.processQueue();
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();
