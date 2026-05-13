import React, { useState } from 'react';
import { Box, Rows, Spacer, Grid, SlidersIcon } from '@canva/easel';
import BrandPanelTitle, { BrandSectionTitle } from './BrandPanelTitle';
import { RegularSearch } from '@/shared_components/Search';
import { DesignCard } from '@/pages/home/components/CardThumbnails';
import { starredTemplates, allBrandTemplates } from '@/pages/home/Brand/data/brandTemplates';
import styles from '../BrandViews.module.css';

export default function BrandTemplatesPanelView(): React.ReactNode {
  const [searchValue, setSearchValue] = useState('');

  return (
    <Box width="full">
      <BrandPanelTitle>Brand Templates</BrandPanelTitle>
      <Spacer size="2u" />

      <RegularSearch
        value={searchValue}
        onChange={setSearchValue}
        placeholder="Search Brand Templates"
        className={styles.brandTemplatesSearch}
        end={<SlidersIcon size="medium" />}
      />

      <Spacer size="3u" />

      <Rows spacing="4u">
        <div>
          <BrandSectionTitle>Starred for team</BrandSectionTitle>
          <Spacer size="1u" />
          <Grid columns={2} spacing="2u">
            {starredTemplates.map(design => (
              <DesignCard key={design.id} design={design} thumbnailOnly />
            ))}
          </Grid>
        </div>

        <div>
          <BrandSectionTitle>All Brand Templates</BrandSectionTitle>
          <Spacer size="1u" />
          <Grid columns={2} spacing="2u">
            {allBrandTemplates.map(design => (
              <DesignCard key={design.id} design={design} showDoctype hideIcon hideActions />
            ))}
          </Grid>
        </div>
      </Rows>
    </Box>
  );
}
