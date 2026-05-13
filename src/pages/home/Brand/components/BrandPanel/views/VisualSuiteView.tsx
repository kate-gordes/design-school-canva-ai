import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface VisualSuiteViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function VisualSuiteView({
  onShowAllFolders,
}: VisualSuiteViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const visualSuiteCategory = useMemo(() => {
    return getCategory(brandKitData, 'Visual Suite');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!visualSuiteCategory || !visualSuiteCategory.folders) return [];

    return visualSuiteCategory.folders.map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [visualSuiteCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Visual Suite</BrandPanelTitle>
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

        {visualSuiteCategory && visualSuiteCategory.assets?.length > 0 ? (
          <>
            <Text size="medium" weight="bold">
              Assets ({visualSuiteCategory.assets.length})
            </Text>
            <BrandAssetGrid assets={visualSuiteCategory.assets} />
          </>
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No visual suite assets available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
