import { fal } from '@canva-ct/genai/fal';

// Image generation result
export interface FalImageResult {
  url: string;
  width: number;
  height: number;
}

/**
 * Fal.ai Image Service
 * Uses fal-ai/nano-banana-pro for generation and fal-ai/nano-banana-pro/edit for editing
 * Accessed through the @canva-ct/genai package
 */
export class FalImageService {
  /**
   * Generate a NEW image from a text prompt
   * Use this when creating a completely new image (no reference)
   */
  async generateImage(
    prompt: string,
    options?: {
      width?: number;
      height?: number;
    },
  ): Promise<FalImageResult> {
    const width = options?.width || 1024;
    const height = options?.height || 768;

    console.log('[FalImageService] Generating new image:', { prompt, width, height });

    try {
      const result = await fal.subscribe('fal-ai/nano-banana-pro', {
        input: {
          prompt,
          image_size: { width, height },
          num_images: 1,
        },
        logs: true,
        onQueueUpdate: update => {
          if (update.status === 'IN_PROGRESS') {
            console.log('[FalImageService] Progress: Processing...');
          }
        },
      });

      const imageData = result.data as {
        images?: Array<{ url: string; width?: number; height?: number }>;
      };

      if (!imageData.images || imageData.images.length === 0) {
        throw new Error('No images returned from Fal.ai');
      }

      const image = imageData.images[0];
      console.log('[FalImageService] Image generated successfully:', image.url);

      return {
        url: image.url,
        width: image.width || width,
        height: image.height || height,
      };
    } catch (error) {
      console.error('[FalImageService] Error generating image:', error);
      throw error;
    }
  }

  /**
   * Edit an EXISTING image using a prompt
   * Use this when transforming/modifying an existing image
   */
  async editImage(
    imageUrl: string,
    prompt: string,
    options?: {
      strength?: number; // How much to change (0-1, default 0.75)
    },
  ): Promise<FalImageResult> {
    console.log('[FalImageService] Editing existing image:', { imageUrl, prompt });

    try {
      // Use nano-banana-pro/edit for fast image editing
      const result = await fal.subscribe('fal-ai/nano-banana-pro/edit', {
        input: {
          image_urls: [imageUrl],
          prompt,
          strength: options?.strength || 0.75,
        },
        logs: true,
        onQueueUpdate: update => {
          if (update.status === 'IN_PROGRESS') {
            console.log('[FalImageService] Edit progress: Processing...');
          }
        },
      });

      const imageData = result.data as {
        images?: Array<{ url: string; width?: number; height?: number }>;
      };

      if (!imageData.images || imageData.images.length === 0) {
        throw new Error('No images returned from Fal.ai edit');
      }

      const image = imageData.images[0];
      console.log('[FalImageService] Image edited successfully:', image.url);

      return {
        url: image.url,
        width: image.width || 1024,
        height: image.height || 768,
      };
    } catch (error) {
      console.error('[FalImageService] Error editing image:', error);
      throw error;
    }
  }

  /**
   * Generate a slide/presentation image
   * Uses wider aspect ratio suitable for slides
   * Optionally accepts a reference image to maintain visual consistency
   */
  async generateSlideImage(prompt: string, referenceImageUrl?: string): Promise<FalImageResult> {
    // If we have a reference image, use the edit endpoint to maintain style consistency
    if (referenceImageUrl) {
      console.log('[FalImageService] Generating slide with reference image for style consistency');
      return this.editImage(referenceImageUrl, prompt, {
        strength: 0.85, // Higher strength to allow more creative freedom while keeping style
      });
    }

    // No reference image, generate from scratch
    return this.generateImage(prompt, {
      width: 1920,
      height: 1080,
    });
  }
}

// Export singleton instance
export const falImageService = new FalImageService();
