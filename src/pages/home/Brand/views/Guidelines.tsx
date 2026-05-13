import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import LogoAssetsSection from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import { Box, Rows } from '@canva/easel';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory, getBrandKitImageUrl, type BrandKitAsset } from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';

import { useMemo } from 'react';
export default function Guidelines(): React.ReactNode {
  const { brandKitData } = useAppContext();
  // Get Guidelines category from the selected brand kit
  const guidelinesCategory = useMemo(() => {
    return getCategory(brandKitData, 'Guidelines');
  }, [brandKitData]);

  // Transform JSON assets to LogoAsset format
  const guidelinesAssets: LogoAsset[] = useMemo(() => {
    if (!guidelinesCategory || !guidelinesCategory.assets) return [];

    return guidelinesCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      image: getBrandKitImageUrl(asset.thumbnailUrl),
      type: asset.type,
      timestamp: asset.uploadedDate || 'Recently added',
    }));
  }, [guidelinesCategory]);

  const assetCount = guidelinesCategory?.assetCount || 0;

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <Box width="full"></Box>
      </Box>
    </Rows>
  );
}
