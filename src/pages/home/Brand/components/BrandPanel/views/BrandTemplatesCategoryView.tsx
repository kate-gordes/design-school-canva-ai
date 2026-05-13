import React from 'react';
import { Box, Rows, Spacer, Grid } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { DesignCard } from '@/pages/home/components/CardThumbnails';
import { allBrandTemplates } from '@/pages/home/Brand/data/brandTemplates';

export default function BrandTemplatesCategoryView(): React.ReactNode {
  return (
    <Box width="full">
      <BrandPanelTitle>Brand Templates</BrandPanelTitle>
      <Spacer size="3u" />

      <Rows spacing="4u">
        <Grid columns={2} spacing="2u">
          {allBrandTemplates.map(design => (
            <DesignCard key={design.id} design={design} thumbnailOnly />
          ))}
        </Grid>
      </Rows>
    </Box>
  );
}
