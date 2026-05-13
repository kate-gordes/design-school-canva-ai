import { Box, Rows, Carousel, Grid, Title, Columns, Column } from '@canva/easel';
import HeroSection from '@/pages/home/components/HeroSection';
import {
  FolderDropdown,
  OwnerDropdown,
  CategoryDropdown,
  DateModifiedDropdown,
} from '@/pages/home/components/Dropdowns';
import type { DateSortType } from '@/pages/home/components/Dropdowns/DateModifiedDropdown';
import { DesignCard } from '@/pages/home/components/CardThumbnails';
import { starredTemplates, allBrandTemplates } from '@/pages/home/Brand/data/brandTemplates';
import { useState } from 'react';

export default function BrandTemplatesView(): React.ReactNode {
  const [folder, setFolder] = useState('all');
  const [owner, setOwner] = useState('all');
  const [category, setCategory] = useState('all');
  const [dateModified, setDateModified] = useState<DateSortType>('any');

  const handleDateSortChange = (newDateSort: DateSortType) => {
    setDateModified(newDateSort);
  };

  return (
    <>
      <HeroSection title="All Brand Templates" gradient={false} showWonderboxTabs={false} />

      {/* Filter pills — centered on their own row, under the wonderbox */}
      <Box width="full" paddingTop="2u" display="flex" justifyContent="center">
        <Columns spacing="1u" alignY="center">
          <Column width="content">
            <FolderDropdown value={folder} onChange={setFolder} />
          </Column>
          <Column width="content">
            <OwnerDropdown value={owner} onChange={setOwner} />
          </Column>
          <Column width="content">
            <CategoryDropdown value={category} onChange={setCategory} />
          </Column>
          <Column width="content">
            <DateModifiedDropdown value={dateModified} onChange={handleDateSortChange} />
          </Column>
        </Columns>
      </Box>

      <Box paddingTop="8u">
        <Rows spacing="3u">
          {/* Starred for team Section */}
          <Box width="full">
            <Rows spacing="2u">
              <Title size="small">Starred for team</Title>
              <Carousel name="starred-templates" gutter="medium" buttonVariant="circular">
                {starredTemplates.map(design => (
                  <div key={design.id} style={{ width: 200 }}>
                    <DesignCard design={design} variant="icon" showDoctype />
                  </div>
                ))}
              </Carousel>
            </Rows>
          </Box>

          {/* All Brand Templates Section */}
          <Box width="full">
            <Rows spacing="3u">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Title size="small">All Brand Templates</Title>
                <Box display="flex" alignItems="center">
                  {/* View toggle icons could go here */}
                </Box>
              </Box>

              <Grid columns={6} spacing="2u">
                {allBrandTemplates.map(design => (
                  <DesignCard key={design.id} design={design} variant="icon" showDoctype />
                ))}
              </Grid>
            </Rows>
          </Box>
        </Rows>
      </Box>
    </>
  );
}
