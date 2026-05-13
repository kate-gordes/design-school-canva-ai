import React from 'react';
import { Rows, Box, Carousel } from '@canva/easel';
import useIsMobile from '@/hooks/useIsMobile';
import SectionTitle from '@/shared_components/SectionTitle';
import { FeaturedAppsCard } from './FeaturedAppsCard';
import type { FeaturedAppsCardProps } from './FeaturedAppsCard';

import { EditorialFeaturedAppMessages as Messages } from './editorial_featured_app.messages';

import { cdn } from '@/utils/cdn';

const typeformImage = cdn('apps/featured/typeform.png');
const choppyCropImage = cdn('apps/featured/choppycrop.png');
const threeDMakerImage = cdn('apps/featured/3dmaker.png');
const pixelifyImage = cdn('apps/featured/pixelify.png');
const canborderImage = cdn('apps/featured/canborder.png');
const reshapeImage = cdn('apps/featured/reshape.png');

export default function FeaturedAppsSection(): React.ReactNode {
  const isMobile = useIsMobile();

  const featuredAppsData: Omit<FeaturedAppsCardProps, 'onClick'>[] = [
    {
      id: 'AAGgTUWUnSk',
      heading: Messages.typeformHeading(),
      headingColor: 'dark',
      subheading: Messages.typeformSubheading(),
      backgroundColor: '#BCE7FF',
      imageUrl: typeformImage,
      iconUrl: typeformImage,
      title: 'Typeform',
    },
    {
      id: 'AAGFLua4Ymc',
      heading: Messages.choppyCropHeading(),
      headingColor: 'dark',
      subheading: Messages.choppyCropSubheading(),
      backgroundColor: '#FFFACD',
      imageUrl: choppyCropImage,
      iconUrl: choppyCropImage,
      title: 'Choppy Crop',
    },
    {
      id: 'AAGbPEKpN8g',
      heading: Messages.threeDMakerHeading(),
      headingColor: 'dark',
      subheading: Messages.threeDMakerSubheading(),
      backgroundColor: '#f9b40d',
      imageUrl: threeDMakerImage,
      iconUrl: threeDMakerImage,
      title: '3D Maker',
    },
    {
      id: 'AAFslIGJGKc',
      heading: Messages.pixelifyHeading(),
      headingColor: 'dark',
      subheading: Messages.pixelifySubheading(),
      backgroundColor: '#FFD7DC',
      imageUrl: pixelifyImage,
      iconUrl: pixelifyImage,
      title: 'Pixelify',
    },
    {
      id: 'AAFptY-lIiI',
      heading: Messages.canborderHeading(),
      headingColor: 'dark',
      subheading: Messages.canborderSubheading(),
      backgroundColor: '#D9FDE6',
      imageUrl: canborderImage,
      iconUrl: canborderImage,
      title: 'CanBorder',
    },
    {
      id: 'AAGNtbjqyWE',
      heading: Messages.reshapeHeading(),
      headingColor: 'dark',
      subheading: Messages.reshapeSubheading(),
      backgroundColor: '#ff3c26',
      imageUrl: reshapeImage,
      iconUrl: reshapeImage,
      title: 'Reshape',
    },
  ];

  return (
    <Rows spacing="2u">
      <Box width="full">
        <Rows spacing="2u">
          <SectionTitle>Featured apps</SectionTitle>

          {/* Carousel with FeaturedAppsCard components */}
          <Carousel name="featured-apps-carousel" gutter="large" buttonVariant="circular">
            {featuredAppsData.map(featuredApp => (
              <div key={featuredApp.id} style={{ width: isMobile ? 240 : 280 }}>
                <FeaturedAppsCard
                  {...featuredApp}
                  onClick={() => console.log('Featured app clicked:', featuredApp.title)}
                />
              </div>
            ))}
          </Carousel>
        </Rows>
      </Box>
    </Rows>
  );
}
