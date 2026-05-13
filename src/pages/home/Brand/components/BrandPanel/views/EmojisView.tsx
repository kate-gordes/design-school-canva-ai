import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle, { BrandSectionTitle } from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface EmojisViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function EmojisView({ onShowAllFolders }: EmojisViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const emojisCategory = useMemo(() => {
    return getCategory(brandKitData, 'Emojis');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!emojisCategory || !emojisCategory.folders) return [];

    return emojisCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [emojisCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Emojis</BrandPanelTitle>
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

        {emojisCategory && emojisCategory.assets?.length > 0 ? (
          <Rows spacing="2u">
            <BrandSectionTitle>Assets ({emojisCategory.assets.length})</BrandSectionTitle>
            <BrandAssetGrid assets={emojisCategory.assets} />
          </Rows>
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No emojis available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
