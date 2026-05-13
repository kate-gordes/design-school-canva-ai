import React from 'react';
import { Box, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';

export default function GuidelinesView(): React.ReactNode {
  return (
    <Box width="full">
      <BrandPanelTitle>Guidelines</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Box padding="3u">
        <Text tone="secondary">No guidelines available in this brand kit.</Text>
      </Box>
    </Box>
  );
}
