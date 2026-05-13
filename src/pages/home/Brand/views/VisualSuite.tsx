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

import FoldersSection from '@/pages/home/components/FoldersSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';

import { useMemo } from 'react';
export default function VisualSuite(): React.ReactNode {
  const { brandKitData } = useAppContext();

  // Get Visual Suite category from the selected brand kit
  const visualSuiteCategory = useMemo(() => {
    return getCategory(brandKitData, 'Visual Suite');
  }, [brandKitData]);

  // Clean up folder names and transform to FolderData format
  const cleanFolders: FolderData[] = useMemo(() => {
    if (!visualSuiteCategory || !visualSuiteCategory.folders) return [];

    const uniqueFolders = new Map<string, Folder>();

    visualSuiteCategory.folders.forEach((folder: Folder) => {
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
  }, [visualSuiteCategory]);

  // Transform JSON assets to ProjectDesign format for DesignSection
  const visualSuiteDesigns: (ProjectDesign & { imageUrl?: string })[] = useMemo(() => {
    if (!visualSuiteCategory || !visualSuiteCategory.assets) return [];

    return visualSuiteCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      doctype: 'Design',
      private: false,
      lastModified: asset.uploadedDate || 'Recently added',
      imageUrl: getBrandKitImageUrl(asset.thumbnailUrl),
    }));
  }, [visualSuiteCategory]);

  const assetCount = visualSuiteCategory?.assetCount || 0;

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="Visual Suite"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new visual suite asset')}
          onMoreClick={() => console.log('More options')}
        />

        <FoldersSection folders={cleanFolders} showHeading={true} />

        <Box width="full">
          {visualSuiteDesigns.length > 0 ? (
            <DesignSection
              title={`Assets (${visualSuiteDesigns.length})`}
              designs={visualSuiteDesigns}
              hideActions={true}
              borderlessThumbnail
            />
          ) : (
            <Box padding="6u">
              <Text tone="secondary">No Visual Suite assets available ({assetCount} assets)</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Rows>
  );
}
