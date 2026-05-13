import { Box, Rows, Text } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import LogoAssetsSection from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import { useAppContext } from '@/hooks/useAppContext';
import { useCategoryEmptyState } from '@/hooks/useBrandKitState';
import {
  getCategory,
  getCategoryImage,
  type BrandKitAsset,
  type Folder,
  getBrandKitImageUrl,
} from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';
import { useMemo } from 'react';

import FoldersSection from '@/pages/home/components/FoldersSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';
import EmptyBrandKitSection from '@/pages/home/Brand/components/EmptyBrandKitSection';
export default function Graphics(): React.ReactNode {
  const { brandKitData, selectedBrandKit } = useAppContext();

  // Use centralized empty state management
  const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Graphics');
  // Get Graphics category from the selected brand kit
  const graphicsCategory = useMemo(() => {
    return getCategory(brandKitData, 'Graphics');
  }, [brandKitData]);

  // Clean up folder names and transform to FolderData format
  const cleanFolders: FolderData[] = useMemo(() => {
    if (!graphicsCategory || !graphicsCategory.folders) return [];

    const uniqueFolders = new Map<string, Folder>();

    graphicsCategory.folders.forEach((folder: Folder) => {
      const cleanName = folder.name
        .replace(/\+⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+$/g, '')
        .trim();

      if (!cleanName || cleanName === '+') return;

      if (
        !uniqueFolders.has(cleanName)
        || (uniqueFolders.get(cleanName)?.itemCount || 0) < folder.itemCount
      ) {
        uniqueFolders.set(cleanName, { ...folder, name: cleanName });
      }
    });

    return Array.from(uniqueFolders.values()).map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [graphicsCategory]);

  // Transform JSON assets to LogoAsset format
  const graphicsAssets: LogoAsset[] = useMemo(() => {
    if (!graphicsCategory || !graphicsCategory.assets) return [];

    return graphicsCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      image: getBrandKitImageUrl(asset.thumbnailUrl),
      type: asset.type,
      timestamp: asset.uploadedDate || 'Recently added',
    }));
  }, [graphicsCategory]);

  const assetCount = graphicsCategory?.assetCount || 0;

  // Empty state is now managed centrally

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        {shouldShowEmptyState ? (
          <EmptyBrandKitSection
            categoryName="Graphics"
            imageUrl={getCategoryImage(selectedBrandKit, 'Graphics')}
            title={emptyStateMessage.title}
            description={emptyStateMessage.description}
            buttonText="Show who I can ask"
            onButtonClick={() => console.log('Show who I can ask clicked')}
          />
        ) : (
          <>
            <BrandHeader
              title="Graphics"
              showAddNew={false}
              showMore={false}
              onAddNewClick={() => console.log('Add new graphic')}
              onMoreClick={() => console.log('More options')}
            />

            <FoldersSection folders={cleanFolders} showHeading={true} />

            <Box width="full">
              {graphicsAssets.length > 0 ? (
                <LogoAssetsSection
                  assets={graphicsAssets}
                  onAssetClick={assetId => console.log('Asset clicked:', assetId)}
                />
              ) : (
                <Box padding="6u">
                  <Rows spacing="2u">
                    <Text>No graphics available in this brand kit.</Text>
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
