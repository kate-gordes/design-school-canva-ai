import { Box, Rows, Text } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import DesignSection from '@/pages/home/components/DesignSection';
import type { ProjectDesign } from '@/pages/home/components/CardThumbnails';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory, type BrandKitAsset, getBrandKitImageUrl } from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';

import { useMemo } from 'react';
export default function ScriptMarks(): React.ReactNode {
  const { brandKitData } = useAppContext();

  // Get Script Marks category from the selected brand kit
  const scriptMarksCategory = useMemo(() => {
    return getCategory(brandKitData, 'Script Marks');
  }, [brandKitData]);

  // Transform JSON assets to ProjectDesign format for DesignSection
  const scriptMarksDesigns: (ProjectDesign & { imageUrl?: string })[] = useMemo(() => {
    if (!scriptMarksCategory || !scriptMarksCategory.assets) return [];

    return scriptMarksCategory.assets.map((asset: BrandKitAsset) => ({
      id: asset.id,
      title: asset.title || asset.filename,
      doctype: 'Design',
      private: false,
      lastModified: asset.uploadedDate || 'Recently added',
      imageUrl: getBrandKitImageUrl(asset.thumbnailUrl),
    }));
  }, [scriptMarksCategory]);

  const assetCount = scriptMarksCategory?.assetCount || 0;

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="Script Marks"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new script mark')}
          onMoreClick={() => console.log('More options')}
        />

        <Box width="full">
          {scriptMarksDesigns.length > 0 ? (
            <DesignSection
              title={`Assets (${scriptMarksDesigns.length})`}
              designs={scriptMarksDesigns}
              hideActions={true}
              borderlessThumbnail
            />
          ) : (
            <Box padding="6u">
              <Text tone="secondary">No script marks available ({assetCount} assets)</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Rows>
  );
}
