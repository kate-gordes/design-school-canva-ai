import { Box, Rows, Text } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import DesignSection from '@/pages/home/components/DesignSection';
import type { ProjectDesign } from '@/pages/home/components/CardThumbnails';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory, getBrandKitImageUrl } from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';
import type { BrandKitAsset, Folder } from '@/pages/home/Brand/data';
import { useMemo } from 'react';

import FoldersSection from '@/pages/home/components/FoldersSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';
export default function Motion(): React.ReactNode {
  const { brandKitData } = useAppContext();

  // Get Motion category from the selected brand kit
  const motionCategory = useMemo(() => {
    return getCategory(brandKitData, 'Motion');
  }, [brandKitData]);

  // Clean up folder names and transform to FolderData format
  const cleanFolders: FolderData[] = useMemo(() => {
    if (!motionCategory || !motionCategory.folders) return [];

    // Remove duplicates and clean names
    const uniqueFolders = new Map<string, Folder>();

    motionCategory.folders.forEach((folder: Folder) => {
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
  }, [motionCategory]);

  // Transform JSON assets to ProjectDesign format for DesignSection
  const motionDesigns: (ProjectDesign & { imageUrl?: string })[] = useMemo(() => {
    if (!motionCategory || !motionCategory.assets) return [];

    return motionCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      doctype: 'Video',
      private: false,
      lastModified: asset.uploadedDate || 'Recently added',
      imageUrl: getBrandKitImageUrl(asset.thumbnailUrl),
    }));
  }, [motionCategory]);

  const assetCount = motionCategory?.assetCount || 0;

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="Motion"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new motion asset')}
          onMoreClick={() => console.log('More options')}
        />

        <FoldersSection folders={cleanFolders} showHeading={true} />

        <Box width="full">
          {motionDesigns.length > 0 ? (
            <DesignSection
              title={`Assets (${motionDesigns.length})`}
              designs={motionDesigns}
              hideActions={true}
              borderlessThumbnail
            />
          ) : (
            <Box padding="6u">
              <Text tone="secondary">No motion assets available ({assetCount} assets)</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Rows>
  );
}
