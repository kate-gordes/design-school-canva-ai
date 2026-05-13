/**
 * Centralized Brand Kit State Management
 *
 * This file serves as the single source of truth for:
 * - Which categories should show empty states vs real content
 * - Brand kit configurations and metadata
 * - Category availability and content status
 */

import type { BrandKitName } from '@/pages/home/Brand/data';

/**
 * Category content status types
 */
export type CategoryContentStatus =
  | 'empty' // Should show EmptyBrandKitSection
  | 'has_content' // Has real assets to display
  | 'placeholder'; // Has 1 asset that's likely a placeholder - treat as empty

/**
 * Brand kit category configuration
 */
export interface CategoryConfig {
  /** The category name as it appears in data */
  categoryName: string;
  /** Content status determines UI behavior */
  contentStatus: CategoryContentStatus;
  /** Number of actual assets (for debugging/reference) */
  assetCount: number;
  /** Whether this category should be shown in navigation */
  showInNav: boolean;
  /** Custom empty state message (optional) */
  customEmptyMessage?: {
    title: string;
    description: string;
  };
}

/**
 * Complete brand kit configuration
 */
export interface BrandKitConfig {
  /** Brand kit display name */
  name: string;
  /** Brand kit logo URL (empty string means use default Canva logo) */
  logoUrl: string;
  /** All categories in this brand kit */
  categories: Record<string, CategoryConfig>;
  /** Total assets across all categories */
  totalAssets: number;
  /** Whether this brand kit is available for selection */
  isAvailable: boolean;
}

/**
 * MASTER BRAND KIT STATE CONFIGURATION
 *
 * This is the single source of truth for all brand kit states.
 * Based on data analysis from scraped JSON files.
 */
export const BRAND_KIT_STATE: Record<BrandKitName, BrandKitConfig> = {
  'Canva Brand Kit': {
    name: 'Canva Brand Kit',
    logoUrl: '', // Empty = use Easel CanvaLetterLogoFilledColorIcon
    totalAssets: 507,
    isAvailable: true,
    categories: {
      'All assets': {
        categoryName: 'All assets',
        contentStatus: 'has_content',
        assetCount: 14,
        showInNav: true,
      },
      'Guidelines': {
        categoryName: 'Guidelines',
        contentStatus: 'has_content',
        assetCount: 143,
        showInNav: true,
      },
      'Logos': {
        categoryName: 'Logos',
        contentStatus: 'has_content',
        assetCount: 89,
        showInNav: true,
      },
      'Colors': {
        categoryName: 'Colors',
        contentStatus: 'has_content',
        assetCount: 12,
        showInNav: true,
      },
      'Fonts': {
        categoryName: 'Fonts',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Brand Voice': {
        categoryName: 'Brand Voice',
        contentStatus: 'has_content',
        assetCount: 31,
        showInNav: true,
      },
      'Photography': {
        categoryName: 'Photography',
        contentStatus: 'has_content',
        assetCount: 45,
        showInNav: true,
      },
      'UI': { categoryName: 'UI', contentStatus: 'has_content', assetCount: 89, showInNav: true },
      'Canva Photos': {
        categoryName: 'Canva Photos',
        contentStatus: 'has_content',
        assetCount: 12,
        showInNav: true,
      },
      'Visual Suite': {
        categoryName: 'Visual Suite',
        contentStatus: 'has_content',
        assetCount: 23,
        showInNav: true,
      },
      'Canva Values': {
        categoryName: 'Canva Values',
        contentStatus: 'has_content',
        assetCount: 15,
        showInNav: true,
      },
      'Motion': {
        categoryName: 'Motion',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Script Marks': {
        categoryName: 'Script Marks',
        contentStatus: 'has_content',
        assetCount: 6,
        showInNav: true,
      },
      'Stickers': {
        categoryName: 'Stickers',
        contentStatus: 'has_content',
        assetCount: 6,
        showInNav: true,
      },
      'Emojis': {
        categoryName: 'Emojis',
        contentStatus: 'has_content',
        assetCount: 5,
        showInNav: true,
      },
      'Charts': {
        categoryName: 'Charts',
        contentStatus: 'has_content',
        assetCount: 1,
        showInNav: true,
      },
    },
  },

  'People Brand Kit': {
    name: 'People Brand Kit',
    logoUrl: 'images/People_Brand_Kit/People_logo.png',
    totalAssets: 191,
    isAvailable: true,
    categories: {
      'All assets': {
        categoryName: 'All assets',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Guidelines': {
        categoryName: 'Guidelines',
        contentStatus: 'empty',
        assetCount: 0,
        showInNav: true,
      },
      'Logos': {
        categoryName: 'Logos',
        contentStatus: 'has_content',
        assetCount: 4,
        showInNav: true,
      },
      'Colors': { categoryName: 'Colors', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Fonts': { categoryName: 'Fonts', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Brand Voice': {
        categoryName: 'Brand Voice',
        contentStatus: 'empty',
        assetCount: 0,
        showInNav: true,
      },
      'Photos': {
        categoryName: 'Photos',
        contentStatus: 'has_content',
        assetCount: 101,
        showInNav: true,
      },
      'Graphics': {
        categoryName: 'Graphics',
        contentStatus: 'has_content',
        assetCount: 78,
        showInNav: true,
      },
      'Icons': {
        categoryName: 'Icons',
        contentStatus: 'empty',
        assetCount: 0,
        showInNav: true,
        customEmptyMessage: {
          title: 'Stay on brand, together',
          description:
            'Ask your admin to add brand assets so you and everyone can create with consistency.',
        },
      },
      'Charts': { categoryName: 'Charts', contentStatus: 'empty', assetCount: 0, showInNav: true },
    },
  },

  'Canva Developers': {
    name: 'Canva Developers',
    logoUrl: 'images/Canva_Developers/Canva_Developers_Logos_4_1762477404865.png',
    totalAssets: 80,
    isAvailable: true,
    categories: {
      'All assets': {
        categoryName: 'All assets',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Logos': {
        categoryName: 'Logos',
        contentStatus: 'has_content',
        assetCount: 3,
        showInNav: true,
      },
      'Colors': { categoryName: 'Colors', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Fonts': { categoryName: 'Fonts', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Brand Voice': {
        categoryName: 'Brand Voice',
        contentStatus: 'placeholder',
        assetCount: 1,
        showInNav: true,
      },
      'Photos': {
        categoryName: 'Photos',
        contentStatus: 'has_content',
        assetCount: 24,
        showInNav: true,
      },
      'Graphics': {
        categoryName: 'Graphics',
        contentStatus: 'has_content',
        assetCount: 35,
        showInNav: true,
      },
      'Icons': {
        categoryName: 'Icons',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Charts': {
        categoryName: 'Charts',
        contentStatus: 'empty',
        assetCount: 1,
        showInNav: true,
        customEmptyMessage: {
          title: 'Communicate on brand with chart styles',
          description:
            'Ask your admin to define the default look of your charts, so your data always looks on brand.',
        },
      },
    },
  },

  'Canva China': {
    name: 'Canva China',
    logoUrl: 'images/Canva_China/Canva_China_Logos_1_1762478348158.png',
    totalAssets: 15,
    isAvailable: true,
    categories: {
      'All assets': {
        categoryName: 'All assets',
        contentStatus: 'has_content',
        assetCount: 8,
        showInNav: true,
      },
      'Logos': {
        categoryName: 'Logos',
        contentStatus: 'has_content',
        assetCount: 2,
        showInNav: true,
      },
      'Colors': { categoryName: 'Colors', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Fonts': { categoryName: 'Fonts', contentStatus: 'empty', assetCount: 0, showInNav: true },
      'Brand Voice': {
        categoryName: 'Brand Voice',
        contentStatus: 'placeholder',
        assetCount: 1,
        showInNav: true,
      },
      'Photos': {
        categoryName: 'Photos',
        contentStatus: 'empty',
        assetCount: 1,
        showInNav: true,
        customEmptyMessage: {
          title: 'Stay on brand, together',
          description:
            'Ask your admin to add brand assets so you and everyone can create with consistency.',
        },
      },
      'Graphics': {
        categoryName: 'Graphics',
        contentStatus: 'empty',
        assetCount: 1,
        showInNav: true,
        customEmptyMessage: {
          title: 'Stay on brand, together',
          description:
            'Ask your admin to add brand assets so you and everyone can create with consistency.',
        },
      },
      'Icons': {
        categoryName: 'Icons',
        contentStatus: 'empty',
        assetCount: 1,
        showInNav: true,
        customEmptyMessage: {
          title: 'Stay on brand, together',
          description:
            'Ask your admin to add brand assets so you and everyone can create with consistency.',
        },
      },
      'Charts': {
        categoryName: 'Charts',
        contentStatus: 'placeholder',
        assetCount: 1,
        showInNav: true,
      },
    },
  },
};

/**
 * UTILITY FUNCTIONS FOR BRAND KIT STATE
 */

/**
 * Check if a category should show empty state
 */
export function shouldShowEmptyState(brandKitName: BrandKitName, categoryName: string): boolean {
  const brandKit = BRAND_KIT_STATE[brandKitName];
  const category = brandKit?.categories[categoryName];

  if (!category) return false;

  return category.contentStatus === 'empty' || category.contentStatus === 'placeholder';
}

/**
 * Get category configuration
 */
export function getCategoryConfig(
  brandKitName: BrandKitName,
  categoryName: string,
): CategoryConfig | null {
  const brandKit = BRAND_KIT_STATE[brandKitName];
  return brandKit?.categories[categoryName] || null;
}

/**
 * Get brand kit configuration
 */
export function getBrandKitConfig(brandKitName: BrandKitName): BrandKitConfig | null {
  return BRAND_KIT_STATE[brandKitName] || null;
}

/**
 * Get all available brand kit names
 */
export function getAvailableBrandKitNames(): BrandKitName[] {
  return Object.keys(BRAND_KIT_STATE).filter(
    name => BRAND_KIT_STATE[name as BrandKitName].isAvailable,
  ) as BrandKitName[];
}

/**
 * Get categories that should show in navigation for a brand kit
 */
export function getNavigationCategories(brandKitName: BrandKitName): CategoryConfig[] {
  const brandKit = BRAND_KIT_STATE[brandKitName];
  if (!brandKit) return [];

  return Object.values(brandKit.categories).filter(category => category.showInNav);
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
  const category = getCategoryConfig(brandKitName, categoryName);

  if (category?.customEmptyMessage) {
    return category.customEmptyMessage;
  }

  // Default empty state message
  return {
    title: 'Stay on brand, together',
    description:
      'Ask your admin to add brand assets so you and everyone can create with consistency.',
  };
}

/**
 * Debug function to log brand kit state
 */
export function debugBrandKitState(brandKitName?: BrandKitName): void {
  if (brandKitName) {
    console.log(`Brand Kit State for ${brandKitName}:`, BRAND_KIT_STATE[brandKitName]);
  } else {
    console.log('All Brand Kit States:', BRAND_KIT_STATE);
  }
}

/**
 * 🎯 REACT HOOKS
 *
 * Note: React hooks are now in hooks.ts to avoid circular dependencies
 */

/**
 * Hook return type
 */
export interface UseBrandKitStateReturn {
  /** Current selected brand kit name */
  selectedBrandKit: BrandKitName;
  /** Current brand kit configuration */
  brandKitConfig: BrandKitConfig | null;
  /** Function to check if a category should show empty state */
  shouldShowEmptyState: (categoryName: string) => boolean;
  /** Function to get category configuration */
  getCategoryConfig: (categoryName: string) => CategoryConfig | null;
  /** Function to get empty state message for a category */
  getEmptyStateMessage: (categoryName: string) => { title: string; description: string };
  /** Categories that should show in navigation */
  navigationCategories: CategoryConfig[];
  /** Brand kit logo URL */
  logoUrl: string;
  /** Total assets in current brand kit */
  totalAssets: number;
  /** Whether current brand kit is available */
  isAvailable: boolean;
}

/**
 * Custom hook for brand kit state management
 *
 * @example
 * ```tsx
 * const { shouldShowEmptyState, emptyMessage } = useBrandKitState();
 * ```
 */
export function useBrandKitState(): UseBrandKitStateReturn {
  // This will be implemented when we fix the circular dependency
  throw new Error('useBrandKitState will be implemented in the main index.ts file');
}

/**
 * Hook for checking empty state of a specific category
 * Useful for components that only need to know about one category
 *
 * @example
 * ```tsx
 * const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Icons');
 * ```
 */
export function useCategoryEmptyState(categoryName: string): {
  shouldShowEmptyState: boolean;
  emptyStateMessage: { title: string; description: string };
  categoryConfig: CategoryConfig | null;
} {
  // This will be implemented when we fix the circular dependency
  throw new Error('useCategoryEmptyState will be implemented in the main index.ts file');
}
