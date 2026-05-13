import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import BrandAssetGrid from './BrandAssetGrid';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';

interface ScriptMarksViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function ScriptMarksView(_props: ScriptMarksViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const scriptMarksCategory = useMemo(() => {
    return getCategory(brandKitData, 'Script Marks');
  }, [brandKitData]);

  return (
    <Box width="full">
      <BrandPanelTitle>Script Marks</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="3u">
        {scriptMarksCategory && scriptMarksCategory.assets?.length > 0 ? (
          <BrandAssetGrid assets={scriptMarksCategory.assets} />
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No script marks available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
