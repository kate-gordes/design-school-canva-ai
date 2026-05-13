import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface PhotosViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function PhotosView({ onShowAllFolders }: PhotosViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const photosCategory = useMemo(() => {
    return getCategory(brandKitData, 'Photos');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!photosCategory || !photosCategory.folders) return [];

    return photosCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [photosCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Photos</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="3u">
        {cleanFolders.length > 0 && (
          <FoldersSection
            folders={cleanFolders}
            simpleVertical={true}
            maxFolders={3}
            onSeeAllClick={() => onShowAllFolders?.(cleanFolders)}
            titleClassName={brandSectionTitleClassName}
          />
        )}

        {photosCategory && photosCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={photosCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No photos available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
