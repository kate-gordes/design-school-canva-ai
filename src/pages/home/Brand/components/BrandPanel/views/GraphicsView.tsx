import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface GraphicsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function GraphicsView({
  onShowAllFolders,
}: GraphicsViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const graphicsCategory = useMemo(() => {
    return getCategory(brandKitData, 'Graphics');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!graphicsCategory || !graphicsCategory.folders) return [];

    return graphicsCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [graphicsCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Graphics</BrandPanelTitle>
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

        {graphicsCategory && graphicsCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={graphicsCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No graphics available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
