import React from 'react';
import { Box, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from '@/pages/home/Brand/components/BrandPanel/views/BrandPanelTitle';

export default function GuidelinesView(): React.ReactNode {
  return (
    <div>
      <BrandPanelTitle>Guidelines</BrandPanelTitle>
      <Spacer size="2u" />
      <Box padding="3u" background="surface">
        <Text tone="secondary">
          Brand guidelines help maintain consistency across all your designs. Add your brand
          guidelines here to ensure everyone on your team stays on brand.
        </Text>
      </Box>
    </div>
  );
}
