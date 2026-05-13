import React from 'react';
import { Grid } from '@canva/easel';
import { DesignCard } from '@/pages/home/components/CardThumbnails';
import type { BrandKitAsset } from '@/pages/home/Brand/data';
import { brandKitAssetsToDesigns } from './brandAssetGridUtils';

interface BrandAssetGridProps {
  assets: BrandKitAsset[];
  columns?: number;
  spacing?: string;
}

export default function BrandAssetGrid({
  assets,
  columns = 2,
  spacing = '2u',
}: BrandAssetGridProps): React.ReactNode {
  const designs = brandKitAssetsToDesigns(assets);

  return (
    <Grid columns={columns} spacing={spacing as '1u' | '2u' | '3u'}>
      {designs.map(design => (
        <DesignCard key={design.id} design={design} thumbnailOnly borderlessThumbnail />
      ))}
    </Grid>
  );
}
