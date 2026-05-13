import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface PhotographyViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function PhotographyView({
  onShowAllFolders,
}: PhotographyViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const photographyCategory = useMemo(() => {
    return getCategory(brandKitData, 'Photography');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!photographyCategory || !photographyCategory.folders) return [];

    return photographyCategory.folders.map((folder: any) => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [photographyCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Photography</BrandPanelTitle>
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

        {photographyCategory && photographyCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={photographyCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No photography available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
