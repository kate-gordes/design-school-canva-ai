import React from 'react';
import { Box } from '@canva/easel';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import BrandPanelTitle from '@/pages/home/Brand/components/BrandPanel/views/BrandPanelTitle';
import SeeAll from '@/shared_components/SeeAll';

export default function PhotosView(): React.ReactNode {
  return (
    <ImageSectionCarousel
      customHeader={
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <BrandPanelTitle>Photos</BrandPanelTitle>
          <SeeAll onClick={() => console.log('Photos see all')} />
        </Box>
      }
      cardWidth={120}
      cardHeight={120}
      itemCount={12}
    />
  );
}
