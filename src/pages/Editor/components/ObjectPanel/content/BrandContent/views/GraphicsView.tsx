import React from 'react';
import { Box, Rows, Text, Spacer } from '@canva/easel';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import SeeAll from '@/shared_components/SeeAll';
import BrandPanelTitle from '@/pages/home/Brand/components/BrandPanel/views/BrandPanelTitle';

export default function GraphicsView(): React.ReactNode {
  return (
    <div>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <BrandPanelTitle>Graphics</BrandPanelTitle>
        <SeeAll onClick={() => console.log('Graphics see all')} />
      </Box>
      <Spacer size="2u" />
      <Rows spacing="1u">
        <FolderCard
          title="Values"
          itemCount={15}
          onClick={() => console.log('Values folder clicked')}
        />
        <FolderCard
          title="Motion Assets"
          itemCount={3}
          onClick={() => console.log('Motion Assets folder clicked')}
        />
        <FolderCard
          title="UI Elements"
          itemCount={11}
          onClick={() => console.log('UI Elements folder clicked')}
        />
      </Rows>
    </div>
  );
}
