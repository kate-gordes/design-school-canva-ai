import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface UIViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function UIView({ onShowAllFolders }: UIViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const uiCategory = useMemo(() => {
    return getCategory(brandKitData, 'UI');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!uiCategory || !uiCategory.folders) return [];

    return uiCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [uiCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>UI</BrandPanelTitle>
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

        {uiCategory && uiCategory.assets?.length > 0 ? (
          <>
            <Text size="medium" weight="bold">
              Assets ({uiCategory.assets.length})
            </Text>
            <BrandAssetGrid assets={uiCategory.assets} />
          </>
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No UI elements available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
