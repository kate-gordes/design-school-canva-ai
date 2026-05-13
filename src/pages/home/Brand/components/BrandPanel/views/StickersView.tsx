import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface StickersViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function StickersView({
  onShowAllFolders,
}: StickersViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const stickersCategory = useMemo(() => {
    return getCategory(brandKitData, 'Stickers');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!stickersCategory || !stickersCategory.folders) return [];

    return stickersCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [stickersCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Stickers</BrandPanelTitle>
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

        {stickersCategory && stickersCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={stickersCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No stickers available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
