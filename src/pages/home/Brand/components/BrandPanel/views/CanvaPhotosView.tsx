import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';
import type { Folder } from '@/pages/home/Brand/data';

interface CanvaPhotosViewProps {
  onShowAllFolders?: (folders: FolderData[]) => void;
}

export default function CanvaPhotosView({
  onShowAllFolders,
}: CanvaPhotosViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const canvaPhotosCategory = useMemo(() => {
    return getCategory(brandKitData, 'Canva Photos');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!canvaPhotosCategory || !canvaPhotosCategory.folders) return [];

    return canvaPhotosCategory.folders.map((folder: Folder) => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [canvaPhotosCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Canva Photos</BrandPanelTitle>
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

        {canvaPhotosCategory && canvaPhotosCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={canvaPhotosCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No Canva Photos available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
