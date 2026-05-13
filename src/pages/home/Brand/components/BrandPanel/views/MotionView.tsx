import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface MotionViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function MotionView({ onShowAllFolders }: MotionViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const motionCategory = useMemo(() => {
    return getCategory(brandKitData, 'Motion');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!motionCategory || !motionCategory.folders) return [];

    return motionCategory.folders.map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [motionCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Motion</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="3u">
        {cleanFolders.length > 0 ? (
          <FoldersSection
            folders={cleanFolders}
            simpleVertical={true}
            maxFolders={3}
            onSeeAllClick={() => onShowAllFolders?.(cleanFolders)}
            titleClassName={brandSectionTitleClassName}
          />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No motion assets available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
