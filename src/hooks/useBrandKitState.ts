/**
 * @deprecated This file is deprecated. Import hooks directly from @/pages/Brand/data instead.
 *
 * This file exists only for backward compatibility.
 * New code should import from @/pages/Brand/data
 */

// Re-export hooks from the new data system
export {
  useBrandKitState,
  useCategoryEmptyState,
  type UseBrandKitStateReturn,
} from '@/pages/Home/Brand/data';

// Re-export types for backward compatibility
export type { CategoryConfig, BrandKitConfig, BrandKitName } from '@/pages/Home/Brand/data';
