import React from 'react';
import { Box, Rows, Grid } from '@canva/easel';
import { AppCard } from '@/pages/Home/components/CardThumbnails';
import SectionTitle from '@/shared_components/SectionTitle';
import type { AppSectionData } from '@/pages/Home/Apps/components/AppSection';

export interface CategoryAppSectionProps {
  title: string;
  apps: AppSectionData[];
}

const CategoryAppSection: React.FC<CategoryAppSectionProps> = ({ title, apps }) => {
  return (
    <Box width="full">
      <Rows spacing="2u">
        <SectionTitle>{title}</SectionTitle>
        <Grid columns={{ default: 1, smallUp: 2, mediumUp: 4 }} spacing="2u">
          {apps.map((app, index) => (
            <AppCard
              key={index}
              app={{
                title: app.title,
                description: app.description,
                thumbnail: app.thumbnail,
              }}
              onClick={app.onClick}
              onMenuClick={app.onMenuClick}
            />
          ))}
        </Grid>
      </Rows>
    </Box>
  );
};

export default CategoryAppSection;
