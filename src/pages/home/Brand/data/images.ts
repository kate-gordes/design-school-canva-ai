/**
 * Category thumbnail images for each brand kit
 * Maps brand kit name -> category name -> image path
 */

// Brand card images (moved to CDN)
import { cdn } from '@/utils/cdn';

const BrandCardImage_Logos = cdn('brand-cards/BrandCardImage_Logos.png');
const BrandCardImage_Colors = cdn('brand-cards/BrandCardImage_Colors.png');
const BrandCardImage_Fonts = cdn('brand-cards/BrandCardImage_Fonts.png');
const BrandCardImage_Emojis = cdn('brand-cards/BrandCardImage_Emojis.png');
const BrandCardImage_Photography = cdn('brand-cards/BrandCardImage_Photography.png');
const BrandCardImage_Motion = cdn('brand-cards/BrandCardImage_Motion.png');
const BrandCardImage_UI = cdn('brand-cards/BrandCardImage_UI.png');
const BrandCardImage_Charts = cdn('brand-cards/BrandCardImage_Charts.png');
const BrandCardImage_BrandVoice = cdn('brand-cards/BrandCardImage_BrandVoice.png');
const BrandCardImage_VisualSuite = cdn('brand-cards/BrandCardImage_VisualSuite.png');
const BrandCardImage_Stickers = cdn('brand-cards/BrandCardImage_Stickers.png');
const BrandCardImage_ScriptMarks = cdn('brand-cards/BrandCardImage_ScriptMarks.png');
const BrandCardImage_CanvaPhotos = cdn('brand-cards/BrandCardImage_CanvaPhotos.png');
const BrandCardImage_CoreValues = cdn('brand-cards/BrandCardImage_CoreValues.png');

// External image URLs from actual brand kit data
const SHARED_LOGOS_IMAGE =
  'https://content-management-files.canva.com/assets/en/1337ffc4-739e-440d-8b8b-6229a8743ce7';
const SHARED_COLORS_IMAGE =
  'https://content-management-files.canva.com/assets/en/1c43d5f0-6dc6-4b6d-bc03-5141b85be370';
const SHARED_FONTS_IMAGE =
  'https://content-management-files.canva.com/assets/en/79b2f121-b27b-431e-8585-74e942d31238';
const SHARED_BRAND_VOICE_IMAGE =
  'https://content-management-files.canva.com/assets/en/d945248a-8477-4c36-852a-a8d557eb0282';
const SHARED_PHOTOS_IMAGE =
  'https://content-management-files.canva.com/assets/en/5b06fc2b-ae03-44fb-867f-32f56a058587';
const SHARED_GRAPHICS_IMAGE =
  'https://content-management-files.canva.com/assets/en/7024bee1-e7b8-4440-93a0-49ba08348909';
const SHARED_ICONS_IMAGE =
  'https://content-management-files.canva.com/assets/en/910b0ad4-2dd2-4b10-97e1-3bd3aa37ee83';
const SHARED_CHARTS_IMAGE =
  'https://content-management-files.canva.com/assets/en/65bb2124-51c4-4124-a8d6-c1e078f3e6cc';

export type CategoryImageMap = Record<string, string>;
export type BrandKitImageMap = Record<string, CategoryImageMap>;

/**
 * Category images for Canva Brand Kit
 * Based on the first screenshot showing Canva's category thumbnails
 */
const canvaBrandKitImages: CategoryImageMap = {
  'All assets': BrandCardImage_Logos, // Default fallback
  'Guidelines': BrandCardImage_BrandVoice,
  'Logos': BrandCardImage_Logos,
  'Colors': BrandCardImage_Colors,
  'Fonts': BrandCardImage_Fonts,
  'Emojis': BrandCardImage_Emojis,
  'Photography': BrandCardImage_Photography,
  'Motion': BrandCardImage_Motion,
  'UI': BrandCardImage_UI,
  'Visual Suite': BrandCardImage_VisualSuite,
  'Brand Voice': BrandCardImage_BrandVoice,
  'Charts': BrandCardImage_Charts,
  'Canva Values': BrandCardImage_CoreValues,
  'Stickers': BrandCardImage_Stickers,
  'Script Marks': BrandCardImage_ScriptMarks,
  'Canva Photos': BrandCardImage_CanvaPhotos,
};

/**
 * Category images for People Brand Kit
 * Using real thumbnail images from actual brand kit data
 */
const peopleBrandKitImages: CategoryImageMap = {
  'All assets': SHARED_LOGOS_IMAGE, // Use real shared image
  'Guidelines': BrandCardImage_BrandVoice, // Keep local asset for Guidelines
  'Logos': SHARED_LOGOS_IMAGE, // Real logos image
  'Colors': SHARED_COLORS_IMAGE, // Real colors image
  'Fonts': SHARED_FONTS_IMAGE, // Real fonts image
  'Brand Voice': SHARED_BRAND_VOICE_IMAGE, // Real brand voice image
  'Photos': SHARED_PHOTOS_IMAGE, // Real photos image
  'Graphics': SHARED_GRAPHICS_IMAGE, // Real graphics image
  'Icons': SHARED_ICONS_IMAGE, // Real icons image
  'Charts': SHARED_CHARTS_IMAGE, // Real charts image
};

/**
 * Category images for Canva Developers
 * Using real thumbnail images from actual brand kit data
 */
const canvaDevelopersImages: CategoryImageMap = {
  'All assets': SHARED_LOGOS_IMAGE, // Use real shared image
  'Logos': SHARED_LOGOS_IMAGE, // Real logos image
  'Colors': SHARED_COLORS_IMAGE, // Real colors image
  'Fonts': SHARED_FONTS_IMAGE, // Real fonts image
  'Brand Voice': SHARED_BRAND_VOICE_IMAGE, // Real brand voice image
  'Photos': SHARED_PHOTOS_IMAGE, // Real photos image
  'Graphics': SHARED_GRAPHICS_IMAGE, // Real graphics image
  'Icons': SHARED_ICONS_IMAGE, // Real icons image
  'Charts': SHARED_CHARTS_IMAGE, // Real charts image
};

/**
 * Category images for Canva China
 * Using real thumbnail images from actual brand kit data
 */
const canvaChinaImages: CategoryImageMap = {
  'All assets': SHARED_LOGOS_IMAGE, // Use real shared image
  'Logos': SHARED_LOGOS_IMAGE, // Real logos image
  'Colors': SHARED_COLORS_IMAGE, // Real colors image
  'Fonts': SHARED_FONTS_IMAGE, // Real fonts image
  'Brand Voice': SHARED_BRAND_VOICE_IMAGE, // Real brand voice image
  'Photos': SHARED_PHOTOS_IMAGE, // Real photos image
  'Graphics': SHARED_GRAPHICS_IMAGE, // Real graphics image
  'Icons': SHARED_ICONS_IMAGE, // Real icons image
  'Charts': SHARED_CHARTS_IMAGE, // Real charts image
};

/**
 * Master mapping of brand kit names to their category images
 */
export const brandKitCategoryImages: BrandKitImageMap = {
  'Canva Brand Kit': canvaBrandKitImages,
  'People Brand Kit': peopleBrandKitImages,
  'Canva Developers': canvaDevelopersImages,
  'Canva China': canvaChinaImages,
};

/**
 * Get the thumbnail image for a specific category in a brand kit
 * @param brandKitName - Name of the brand kit
 * @param categoryName - Name of the category
 * @returns Image path or fallback image
 */
export function getCategoryImage(brandKitName: string, categoryName: string): string {
  const brandKitImages = brandKitCategoryImages[brandKitName];
  if (!brandKitImages) {
    // Fallback to Canva Brand Kit images if brand kit not found
    return canvaBrandKitImages[categoryName] || BrandCardImage_Logos;
  }

  return brandKitImages[categoryName] || BrandCardImage_Logos;
}

/**
 * Get all category images for a specific brand kit
 * @param brandKitName - Name of the brand kit
 * @returns Object mapping category names to image paths
 */
export function getBrandKitCategoryImages(brandKitName: string): CategoryImageMap {
  return brandKitCategoryImages[brandKitName] || canvaBrandKitImages;
}

/**
 * Check if a brand kit has custom category images defined
 * @param brandKitName - Name of the brand kit
 * @returns True if custom images are defined
 */
export function hasCategoryImages(brandKitName: string): boolean {
  return brandKitName in brandKitCategoryImages;
}
