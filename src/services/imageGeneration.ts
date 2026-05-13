import { fal } from '@canva-ct/genai/fal';

/**
 * Generated image result
 */
export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

/**
 * Parse aspect ratio string to width/height
 */
function getImageSize(aspectRatio?: string): { width: number; height: number } {
  switch (aspectRatio) {
    case '1:1':
      return { width: 1024, height: 1024 };
    case '4:5':
      return { width: 768, height: 960 };
    case '16:9':
      return { width: 1920, height: 1080 };
    case '9:16':
      return { width: 1080, height: 1920 };
    default:
      return { width: 1024, height: 1024 };
  }
}

/**
 * Service for image generation using fal.ai nano-banana-pro
 */
class ImageGenerationService {
  /**
   * Generate a single image - returns a Promise with the image URL
   * @param prompt - The prompt for image generation
   * @param aspectRatio - Optional aspect ratio (e.g., "1:1", "4:5", "16:9")
   */
  async generateImage(prompt: string, aspectRatio?: string): Promise<string> {
    const { width, height } = getImageSize(aspectRatio);

    console.log('[ImageGeneration] Generating image with fal.ai nano-banana-pro:', {
      prompt,
      width,
      height,
    });

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
            console.log('[ImageGeneration] Progress: Processing...');
          }
        },
      });

      const imageData = result.data as {
        images?: Array<{ url: string; width?: number; height?: number }>;
      };

      if (!imageData.images || imageData.images.length === 0) {
        throw new Error('No images returned from fal.ai');
      }

      const imageUrl = imageData.images[0].url;
      console.log('[ImageGeneration] Image generated successfully');

      return imageUrl;
    } catch (error) {
      console.error('[ImageGeneration] Error generating image:', error);
      throw error;
    }
  }

  /**
   * Generate multiple images from a single prompt (4-up variations)
   * Uses fal.ai's num_images parameter for efficient batch generation
   * @param prompt - The prompt for image generation
   * @param count - Number of variations to generate (default: 4)
   * @param aspectRatio - Optional aspect ratio
   */
  async generateVariations(
    prompt: string,
    count: number = 4,
    aspectRatio?: string,
  ): Promise<GeneratedImage[]> {
    const { width, height } = getImageSize(aspectRatio);

    console.log('[ImageGeneration] Generating variations with fal.ai nano-banana-pro:', {
      prompt,
      count,
      width,
      height,
    });

    try {
      const result = await fal.subscribe('fal-ai/nano-banana-pro', {
        input: {
          prompt,
          image_size: { width, height },
          num_images: count,
        },
        logs: true,
        onQueueUpdate: update => {
          if (update.status === 'IN_PROGRESS') {
            console.log('[ImageGeneration] Progress: Processing variations...');
          }
        },
      });

      const imageData = result.data as {
        images?: Array<{ url: string; width?: number; height?: number }>;
      };

      if (!imageData.images || imageData.images.length === 0) {
        throw new Error('No images returned from fal.ai');
      }

      const generatedImages: GeneratedImage[] = imageData.images.map((img, index) => ({
        id: `gen_${Date.now()}_${index}`,
        url: img.url,
        prompt,
      }));

      console.log(`[ImageGeneration] Generated ${generatedImages.length} variations successfully`);

      return generatedImages;
    } catch (error) {
      console.error('[ImageGeneration] Error generating variations:', error);
      throw error;
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return true; // fal.ai is always configured via @canva-ct/genai
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();
