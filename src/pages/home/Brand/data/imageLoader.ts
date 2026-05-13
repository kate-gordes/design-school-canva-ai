import { cdn } from '@/utils/cdn';

export function getBrandKitImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '/placeholder.png';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith('images/')
    ? imagePath.substring('images/'.length)
    : imagePath;

  return cdn(`brand-images/${cleanPath}`);
}

/**
 * Preloads a brand kit image
 * @param imagePath - Relative path from brandKits.json
 */
export function preloadBrandKitImage(imagePath: string): void {
  if (!imagePath) return;

  const img = new Image();
  img.src = getBrandKitImageUrl(imagePath);
}

/**
 * Batch preload multiple images
 * @param imagePaths - Array of relative paths
 */
export function preloadBrandKitImages(imagePaths: string[]): void {
  imagePaths.forEach(preloadBrandKitImage);
}
