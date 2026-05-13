import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface CanvaValuesViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function CanvaValuesView({
  onShowAllFolders,
}: CanvaValuesViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const canvaValuesCategory = useMemo(() => {
    return getCategory(brandKitData, 'Canva Values');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!canvaValuesCategory || !canvaValuesCategory.folders) return [];

    return canvaValuesCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [canvaValuesCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Canva Values</BrandPanelTitle>
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

        {canvaValuesCategory && canvaValuesCategory.assets?.length > 0 ? (
          <>
            <Text size="medium" weight="bold">
              Assets ({canvaValuesCategory.assets.length})
            </Text>
            <BrandAssetGrid assets={canvaValuesCategory.assets} />
          </>
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No Canva Values available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
