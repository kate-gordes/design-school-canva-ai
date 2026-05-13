import type { FeaturedAppCardData } from './index';

import { AppVisualCardMessages as Messages } from '@/pages/Home/Apps/components/AppPageSpecificSections/TrendingAppsSection/messages/app_visual_card.messages';
import { cdn } from '@/utils/cdn';

const typeformPhoto = cdn('apps/featured/typeform.png');
const choppyCropPhoto = cdn('apps/featured/choppycrop.png');
const threeDMakerPhoto = cdn('apps/featured/3dmaker.png');
const pixelifyPhoto = cdn('apps/featured/pixelify.png');
const canborderPhoto = cdn('apps/featured/canborder.png');

export const featuredAppsData: FeaturedAppCardData[] = [
  {
    // AppVisualCard properties
    name: 'Typeform',
    cardColor: '#BCE7FF',
    image: typeformPhoto,
    description: 'Embed forms, quizzes, and surveys into your designs',
    textColor: 'dark',
    imageAltText: 'Typeform form creation interface',
    onClick: () => console.log('Typeform clicked'),

    // Card extension properties
    appIcon: typeformPhoto,
    appTitle: 'Typeform',
    category: 'Your forms, all in Canva',
  },
  {
    // AppVisualCard properties
    name: 'Choppy Crop',
    cardColor: '#FFFACD',
    image: choppyCropPhoto,
    description: Messages.choppyCropDescription(),
    textColor: 'dark',
    imageAltText: Messages.choppyCropImageAltText(),
    onClick: () => console.log('Choppy Crop clicked'),

    // Card extension properties
    appIcon: choppyCropPhoto,
    appTitle: 'Choppy Crop',
    category: 'Image editor',
  },
  {
    // AppVisualCard properties
    name: '3D Maker',
    cardColor: '#f9b40d',
    image: threeDMakerPhoto,
    description: 'Convert images, texts, or graphics into 3D visuals',
    textColor: 'dark',
    imageAltText: '3D visual creation interface',
    onClick: () => console.log('3D Maker clicked'),

    // Card extension properties
    appIcon: threeDMakerPhoto,
    appTitle: '3D Maker',
    category: 'Bold 3D effects',
  },
  {
    // AppVisualCard properties
    name: 'Pixelify',
    cardColor: '#FFD7DC',
    image: pixelifyPhoto,
    description: Messages.pixelifyDescription(),
    textColor: 'dark',
    imageAltText: Messages.pixelifyImageAltText(),
    onClick: () => console.log('Pixelify clicked'),

    // Card extension properties
    appIcon: pixelifyPhoto,
    appTitle: 'Pixelify',
    category: 'Pixelate any image',
  },
  {
    // AppVisualCard properties
    name: 'CanBorder',
    cardColor: '#D9FDE6',
    image: canborderPhoto,
    description: 'Create custom borders to fit your design perfectly',
    textColor: 'dark',
    imageAltText: 'Border creation interface',
    onClick: () => console.log('CanBorder clicked'),

    // Card extension properties
    appIcon: canborderPhoto,
    appTitle: 'CanBorder',
    category: 'Design effects',
  },
];
