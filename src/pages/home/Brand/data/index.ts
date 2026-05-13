/**
 * 🎯 Brand Kit Data - Single Entry Point
 *
 * This is the ONLY file you need to import for all brand kit data access.
 * Everything else is implementation details.
 *
 * @example
 * ```ts
 * import {
 *   getBrandKit,
 *   shouldShowEmptyState,
 *   getAllBrandKits,
 *   useBrandKitState
 * } from '@/pages/home/Brand/data';
 *
 * // Get a specific brand kit
 * const canvaBrandKit = getBrandKit('Canva Brand Kit');
 *
 * // Check if category should show empty state
 * const isEmpty = shouldShowEmptyState('People Brand Kit', 'Icons');
 *
 * // Use in React component
 * const { shouldShowEmptyState, emptyMessage } = useBrandKitState('Icons');
 * ```
 */

// Re-export everything from internal modules
export * from './types';
export * from './state';
export * from './images';
export * from './hooks';
export * from './imageLoader';

// Import all the data and state management
import brandKitsData from '@/assets/brand-kits/brandKits.json';
const { BRAND_KITS_DATA } = brandKitsData;
import {
  BRAND_KIT_STATE,
  shouldShowEmptyState as _shouldShowEmptyState,
  getCategoryConfig as _getCategoryConfig,
  getBrandKitConfig as _getBrandKitConfig,
  getEmptyStateMessage as _getEmptyStateMessage,
  getNavigationCategories as _getNavigationCategories,
  type BrandKitName,
  type CategoryConfig,
  type BrandKitConfig,
} from './state';

// Export types for external use
export type {
  BrandKitName,
  CategoryConfig,
  BrandKitConfig,
  BrandKit,
  Category,
  BrandKitAsset,
  Folder,
} from './types';

/**
 * 🎯 MAIN API - Use these functions for all brand kit operations
 */

/**
 * Get all available brand kit names
 */
export function getAllBrandKitNames(): BrandKitName[] {
  return Object.keys(BRAND_KIT_STATE) as BrandKitName[];
}

/**
 * Get a specific brand kit by name
 */
export function getBrandKit(name: BrandKitName): any | null {
  return BRAND_KITS_DATA[name] || null;
}

/**
 * Get all brand kits data
 */
export function getAllBrandKits(): Record<string, any> {
  return BRAND_KITS_DATA;
}

/**
 * Check if a category should show empty state
 */
export function shouldShowEmptyState(brandKitName: BrandKitName, categoryName: string): boolean {
  return _shouldShowEmptyState(brandKitName, categoryName);
}

/**
 * Get category configuration
 */
export function getCategoryConfig(
  brandKitName: BrandKitName,
  categoryName: string,
): CategoryConfig | null {
  return _getCategoryConfig(brandKitName, categoryName);
}

/**
 * Get brand kit configuration
 */
export function getBrandKitConfig(brandKitName: BrandKitName): BrandKitConfig | null {
  return _getBrandKitConfig(brandKitName);
}

/**
 * Get empty state message for a category
 */
export function getEmptyStateMessage(
  brandKitName: BrandKitName,
  categoryName: string,
): {
  title: string;
  description: string;
} {
  return _getEmptyStateMessage(brandKitName, categoryName);
}

/**
 * Get navigation categories for a brand kit
 */
export function getNavigationCategories(brandKitName: BrandKitName): CategoryConfig[] {
  return _getNavigationCategories(brandKitName);
}

/**
 * Get brand kit logo URL
 */
export function getBrandKitLogo(brandKitName: BrandKitName): string {
  const config = getBrandKitConfig(brandKitName);
  return config?.logoUrl || '';
}

/**
 * Get a specific category from a brand kit
 */
export function getCategory(brandKit: any | null, categoryName: string): any | null {
  if (!brandKit || !brandKit.categories) return null;
  return brandKit.categories.find((cat: any) => cat.categoryName === categoryName) || null;
}

/**
 * Get categories by section from a brand kit
 */
export function getCategoriesBySection(brandKit: any | null, section: string): any[] {
  if (!brandKit || !brandKit.categories) return [];
  return brandKit.categories.filter((cat: any) => cat.section === section);
}

/**
 * Convert category name to view ID
 */
export function categoryNameToViewId(categoryName: string): string {
  return categoryName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * 🎯 REACT HOOKS - Use these in React components
 */

// Re-export hooks from hooks module (to avoid circular dependencies)
export { useBrandKitState, useCategoryEmptyState } from './hooks';

/**
 * 🎯 UTILITIES
 */

/**
 * Debug function to log brand kit information
 */
export function debugBrandKit(brandKitName?: BrandKitName): void {
  if (brandKitName) {
    console.group(`🔍 Brand Kit Debug: ${brandKitName}`);
    console.log('Configuration:', getBrandKitConfig(brandKitName));
    console.log('Raw Data:', getBrandKit(brandKitName));
    console.log('Navigation Categories:', getNavigationCategories(brandKitName));
    console.groupEnd();
  } else {
    console.group('🔍 All Brand Kits Debug');
    getAllBrandKitNames().forEach(name => {
      console.log(`${name}:`, {
        config: getBrandKitConfig(name),
        totalAssets: getBrandKitConfig(name)?.totalAssets || 0,
      });
    });
    console.groupEnd();
  }
}

/**
 * 🎯 CONSTANTS
 */

/**
 * Available brand kit names as a constant array
 */
export const AVAILABLE_BRAND_KITS: readonly BrandKitName[] = getAllBrandKitNames();

/**
 * Default brand kit (first available)
 */
export const DEFAULT_BRAND_KIT: BrandKitName = AVAILABLE_BRAND_KITS[0];

/**
 * 🎯 MIGRATION HELPERS
 *
 * These help migrate from the old scattered file structure
 */

/**
 * @deprecated Use getBrandKit() instead
 */
export function getBrandKitByName(name: string): any | null {
  console.warn('getBrandKitByName is deprecated. Use getBrandKit() instead.');
  return getBrandKit(name as BrandKitName);
}

/**
 * @deprecated Use getAllBrandKitNames() instead
 */
export function getAvailableBrandKitNames(): readonly string[] {
  console.warn('getAvailableBrandKitNames is deprecated. Use getAllBrandKitNames() instead.');
  return getAllBrandKitNames();
}
