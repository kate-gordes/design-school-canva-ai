import { Box, Rows, Text } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import LogoAssetsSection from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import { useAppContext } from '@/hooks/useAppContext';
import {
  useCategoryEmptyState,
  getCategoryImage,
  getCategory,
  type BrandKitAsset,
  type Folder,
  getBrandKitImageUrl,
} from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';
import { useMemo } from 'react';

import FoldersSection from '@/pages/home/components/FoldersSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';
import EmptyBrandKitSection from '@/pages/home/Brand/components/EmptyBrandKitSection';
export default function Icons(): React.ReactNode {
  const { brandKitData, selectedBrandKit } = useAppContext();

  // Use centralized empty state management
  const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Icons');

  // Get Icons or UI category from the selected brand kit (fallback to UI for Canva Brand Kit)
  const iconsCategory = useMemo(() => {
    // Try Icons first (available in People, Developers, China)
    let category = getCategory(brandKitData, 'Icons');
    // Fallback to UI for Canva Brand Kit
    if (!category) {
      category = getCategory(brandKitData, 'UI');
    }
    return category;
  }, [brandKitData]);

  // Clean up folder names and transform to FolderData format
  const cleanFolders: FolderData[] = useMemo(() => {
    if (!iconsCategory || !iconsCategory.folders) return [];

    // Remove duplicates and clean names
    const uniqueFolders = new Map<string, Folder>();

    iconsCategory.folders.forEach((folder: Folder) => {
      // Clean up folder names by removing special characters and duplicates
      const cleanName = folder.name
        .replace(/\+⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+$/g, '')
        .trim();

      // Skip empty names or just "+"
      if (!cleanName || cleanName === '+') return;

      // Use the folder with higher item count if duplicate names exist
      if (
        !uniqueFolders.has(cleanName)
        || (uniqueFolders.get(cleanName)?.itemCount || 0) < folder.itemCount
      ) {
        uniqueFolders.set(cleanName, { ...folder, name: cleanName });
      }
    });

    // Transform to FolderData format
    return Array.from(uniqueFolders.values()).map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false, // Assuming public folders
      itemCount: folder.itemCount,
    }));
  }, [iconsCategory]);

  // Transform JSON assets to LogoAsset format
  const iconAssets: LogoAsset[] = useMemo(() => {
    if (!iconsCategory || !iconsCategory.assets) return [];

    return iconsCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      image: getBrandKitImageUrl(asset.thumbnailUrl),
      type: asset.type,
      timestamp: asset.uploadedDate || 'Recently added',
    }));
  }, [iconsCategory]);

  const assetCount = iconsCategory?.assetCount || 0;

  // Empty state is now managed centrally - no need for manual logic

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        {shouldShowEmptyState ? (
          <EmptyBrandKitSection
            categoryName="Icons"
            imageUrl={getCategoryImage(selectedBrandKit, 'Icons')}
            title={emptyStateMessage.title}
            description={emptyStateMessage.description}
            buttonText="Show who I can ask"
            onButtonClick={() => console.log('Show who I can ask clicked')}
          />
        ) : (
          <>
            <BrandHeader
              title="Icons"
              showAddNew={false}
              showMore={false}
              onAddNewClick={() => console.log('Add new icon/UI element')}
              onMoreClick={() => console.log('More options')}
            />

            <FoldersSection folders={cleanFolders} showHeading={true} />

            <Box width="full">
              {iconAssets.length > 0 ? (
                <LogoAssetsSection
                  assets={iconAssets}
                  onAssetClick={assetId => console.log('Asset clicked:', assetId)}
                />
              ) : (
                <Box padding="6u">
                  <Rows spacing="2u">
                    <Text>
                      No {iconsCategory?.categoryName?.toLowerCase() || 'icons'} available in this
                      brand kit.
                    </Text>
                    {assetCount > 0 && (
                      <Text tone="secondary">({assetCount} assets in category)</Text>
                    )}
                  </Rows>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Rows>
  );
}
