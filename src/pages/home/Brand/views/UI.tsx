import { Box, Rows, Text } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import DesignSection from '@/pages/home/components/DesignSection';
import type { ProjectDesign } from '@/pages/home/components/CardThumbnails';
import { useAppContext } from '@/hooks/useAppContext';
import {
  getCategory,
  type BrandKitAsset,
  type Folder,
  getBrandKitImageUrl,
} from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';
import { useMemo } from 'react';

import FoldersSection from '@/pages/home/components/FoldersSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';
export default function UI(): React.ReactNode {
  const { brandKitData, selectedBrandKit } = useAppContext();

  // Get UI category from the selected brand kit
  const uiCategory = useMemo(() => {
    return getCategory(brandKitData, 'UI');
  }, [brandKitData]);

  // Clean up folder names and transform to FolderData format
  const cleanFolders: FolderData[] = useMemo(() => {
    if (!uiCategory || !uiCategory.folders) return [];

    const uniqueFolders = new Map<string, Folder>();

    uiCategory.folders.forEach((folder: Folder) => {
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
  }, [uiCategory]);

  // Transform JSON assets to ProjectDesign format for DesignSection
  const uiDesigns: (ProjectDesign & { imageUrl?: string })[] = useMemo(() => {
    if (!uiCategory || !uiCategory.assets) return [];

    return uiCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      doctype: 'Design',
      private: false,
      lastModified: asset.uploadedDate || 'Recently added',
      imageUrl: getBrandKitImageUrl(asset.thumbnailUrl),
    }));
  }, [uiCategory]);

  const assetCount = uiCategory?.assetCount || 0;

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="UI"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new UI element')}
          onMoreClick={() => console.log('More options')}
        />

        <FoldersSection folders={cleanFolders} showHeading={true} />

        <Box width="full">
          {uiDesigns.length > 0 ? (
            <DesignSection
              title={`Assets (${uiDesigns.length})`}
              designs={uiDesigns}
              hideActions={true}
              borderlessThumbnail
            />
          ) : (
            <Box padding="6u">
              <Text tone="secondary">No UI assets available ({assetCount} assets)</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Rows>
  );
}
