import React from 'react';
import { Box } from '@canva/easel';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import BrandPanelTitle from '@/pages/home/Brand/components/BrandPanel/views/BrandPanelTitle';
import SeeAll from '@/shared_components/SeeAll';

export default function IconsView(): React.ReactNode {
  return (
    <ImageSectionCarousel
      customHeader={
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <BrandPanelTitle>Icons</BrandPanelTitle>
          <SeeAll onClick={() => console.log('Icons see all')} />
        </Box>
      }
      cardWidth={120}
      cardHeight={120}
      itemCount={12}
    />
  );
}
