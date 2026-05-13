import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';

interface IconsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function IconsView(_props: IconsViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const iconsCategory = useMemo(() => {
    let category = getCategory(brandKitData, 'Icons');
    if (!category) {
      category = getCategory(brandKitData, 'UI');
    }
    return category;
  }, [brandKitData]);

  return (
    <Box width="full">
      <BrandPanelTitle>Icons</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="3u">
        {iconsCategory && iconsCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={iconsCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No icons available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
