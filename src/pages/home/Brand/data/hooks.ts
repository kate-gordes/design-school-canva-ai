/**
 * 🎯 React Hooks for Brand Kit State
 *
 * Separated from state.ts to avoid circular dependencies
 */

import { useMemo } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import {
  shouldShowEmptyState,
  getCategoryConfig,
  getBrandKitConfig,
  getEmptyStateMessage,
  getNavigationCategories,
  type CategoryConfig,
  type BrandKitConfig,
  type BrandKitName,
} from './state';

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
 * const brandKitState = useBrandKitState();
 * if (brandKitState.shouldShowEmptyState('Icons')) {
 *   // Show empty state
 * }
 * ```
 */
export function useBrandKitState(): UseBrandKitStateReturn {
  const { selectedBrandKit } = useAppContext();

  // Memoize brand kit configuration
  const brandKitConfig = useMemo(() => {
    return getBrandKitConfig(selectedBrandKit as BrandKitName);
  }, [selectedBrandKit]);

  // Memoize navigation categories
  const navigationCategories = useMemo(() => {
    return getNavigationCategories(selectedBrandKit as BrandKitName);
  }, [selectedBrandKit]);

  // Create memoized helper functions bound to current brand kit
  const boundHelpers = useMemo(
    () => ({
      shouldShowEmptyState: (categoryName: string) =>
        shouldShowEmptyState(selectedBrandKit as BrandKitName, categoryName),

      getCategoryConfig: (categoryName: string) =>
        getCategoryConfig(selectedBrandKit as BrandKitName, categoryName),

      getEmptyStateMessage: (categoryName: string) =>
        getEmptyStateMessage(selectedBrandKit as BrandKitName, categoryName),
    }),
    [selectedBrandKit],
  );

  return {
    selectedBrandKit: selectedBrandKit as BrandKitName,
    brandKitConfig,
    shouldShowEmptyState: boundHelpers.shouldShowEmptyState,
    getCategoryConfig: boundHelpers.getCategoryConfig,
    getEmptyStateMessage: boundHelpers.getEmptyStateMessage,
    navigationCategories,
    logoUrl: brandKitConfig?.logoUrl || '',
    totalAssets: brandKitConfig?.totalAssets || 0,
    isAvailable: brandKitConfig?.isAvailable || false,
  };
}

/**
 * Hook for checking empty state of a specific category
 * Useful for components that only need to know about one category
 *
 * @example
 * ```tsx
 * const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Icons');
 *
 * return (
 *   <div>
 *     {shouldShowEmptyState ? (
 *       <EmptyState title={emptyStateMessage.title} />
 *     ) : (
 *       <CategoryContent />
 *     )}
 *   </div>
 * );
 * ```
 */
export function useCategoryEmptyState(categoryName: string): {
  shouldShowEmptyState: boolean;
  emptyStateMessage: { title: string; description: string };
  categoryConfig: CategoryConfig | null;
} {
  const { selectedBrandKit } = useAppContext();

  return useMemo(
    () => ({
      shouldShowEmptyState: shouldShowEmptyState(selectedBrandKit as BrandKitName, categoryName),
      emptyStateMessage: getEmptyStateMessage(selectedBrandKit as BrandKitName, categoryName),
      categoryConfig: getCategoryConfig(selectedBrandKit as BrandKitName, categoryName),
    }),
    [selectedBrandKit, categoryName],
  );
}
