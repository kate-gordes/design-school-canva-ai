import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { brandSectionTitleClassName } from './brandPanelTitleStyles';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory, type BrandKitAsset, type Folder } from '@/pages/home/Brand/data';
import FoldersSection from '@/pages/Home/components/FoldersSection';
import type { FolderData } from '@/pages/Home/components/FoldersSection';

interface LogosViewProps {
  onShowAllFolders?: (folders: FolderData[]) => void;
}

export default function LogosView({ onShowAllFolders }: LogosViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const logosCategory = useMemo(() => {
    return getCategory(brandKitData, 'Logos');
  }, [brandKitData]);

  const cleanFolders: FolderData[] = useMemo(() => {
    if (!logosCategory || !logosCategory.folders) return [];

    const uniqueFolders = new Map<string, Folder>();
    logosCategory.folders.forEach((folder: Folder) => {
      const cleanName = folder.name
        .replace(/\+12LW⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+12LW/g, '')
        .replace(/\+⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+$/g, '')
        .trim();

      if (!cleanName || cleanName === '+') return;

      if (
        !uniqueFolders.has(cleanName)
        || (uniqueFolders.get(cleanName)?.itemCount || 0) < folder.itemCount
      ) {
        uniqueFolders.set(cleanName, { ...folder, name: cleanName });
      }
    });

    return Array.from(uniqueFolders.values()).map(folder => ({
      id: folder.id,
      name: folder.name,
      isPrivate: false,
      itemCount: folder.itemCount,
    }));
  }, [logosCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Logos</BrandPanelTitle>
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

        {logosCategory && logosCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={logosCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No logos available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
