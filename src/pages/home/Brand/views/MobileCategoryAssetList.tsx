import React, { useMemo } from 'react';
import { Box, Rows, Text } from '@canva/easel';
import { useAppContext } from '@/hooks/useAppContext';
import {
  getCategory,
  getBrandKitImageUrl,
  type BrandKitAsset,
  type Folder,
} from '@/pages/home/Brand/data';
import MobileBrandAssetRow from '../components/MobileBrandAssetRow';

interface MobileCategoryAssetListProps {
  categoryName: string;
}

export default function MobileCategoryAssetList({
  categoryName,
}: MobileCategoryAssetListProps): React.ReactNode {
  const { brandKitData } = useAppContext();

  const category = useMemo(
    () => getCategory(brandKitData, categoryName),
    [brandKitData, categoryName],
  );

  const folders = useMemo<Folder[]>(() => {
    if (!category?.folders) return [];
    const unique = new Map<string, Folder>();
    category.folders.forEach((folder: Folder) => {
      const cleanName = folder.name
        .replace(/\+12LW⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+12LW/g, '')
        .replace(/\+⁠\(opens in a new tab or window\)/g, '')
        .replace(/\+$/g, '')
        .trim();
      if (!cleanName || cleanName === '+') return;
      if (!unique.has(cleanName) || (unique.get(cleanName)?.itemCount || 0) < folder.itemCount) {
        unique.set(cleanName, { ...folder, name: cleanName });
      }
    });
    return Array.from(unique.values());
  }, [category]);

  const assets = useMemo<BrandKitAsset[]>(() => category?.assets ?? [], [category]);

  if (folders.length === 0 && assets.length === 0) {
    return (
      <Box paddingX="2u" paddingY="4u">
        <Text tone="secondary">No {categoryName.toLowerCase()} available.</Text>
      </Box>
    );
  }

  return (
    <Box paddingX="2u" paddingBottom="4u">
      <Rows spacing="1u">
        {folders.map(folder => (
          <MobileBrandAssetRow
            key={folder.id}
            title={folder.name}
            folderMeta={{ itemCount: folder.itemCount }}
          />
        ))}
        {assets.map(asset => (
          <MobileBrandAssetRow
            key={asset.id}
            title={asset.title || asset.filename}
            thumbnailUrl={getBrandKitImageUrl(asset.thumbnailUrl)}
          />
        ))}
      </Rows>
    </Box>
  );
}
