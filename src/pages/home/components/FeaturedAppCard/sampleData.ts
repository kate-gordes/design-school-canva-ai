import type { EditorialFeaturedAppDetails } from './index';

import { EditorialFeaturedAppMessages as Messages } from './editorial_featured_app.messages';

import { cdn } from '@/utils/cdn';

const typeformImage = cdn('apps/featured/typeform.png');
const choppyCropImage = cdn('apps/featured/choppycrop.png');
const threeDMakerImage = cdn('apps/featured/3dmaker.png');
const pixelifyImage = cdn('apps/featured/pixelify.png');
const canborderImage = cdn('apps/featured/canborder.png');

export const featuredAppsData: EditorialFeaturedAppDetails[] = [
  {
    imageUrl: typeformImage,
    heading: Messages.typeformHeading(),
    headingColor: 'dark',
    subheading: Messages.typeformSubheading(),
    backgroundColor: '#BCE7FF',
    backgroundColorSimple: '#BCE7FF',
    appTitle: 'Typeform',
  },
  {
    imageUrl: choppyCropImage,
    heading: Messages.choppyCropHeading(),
    headingColor: 'dark',
    subheading: Messages.choppyCropSubheading(),
    backgroundColor: '#FFFACD',
    backgroundColorSimple: '#FFFACD',
    appTitle: 'Choppy Crop',
  },
  {
    imageUrl: threeDMakerImage,
    heading: Messages.threeDMakerHeading(),
    headingColor: 'dark',
    subheading: Messages.threeDMakerSubheading(),
    backgroundColor: '#f9b40d',
    backgroundColorSimple: '#f9b40d',
    appTitle: '3D Maker',
  },
  {
    imageUrl: pixelifyImage,
    heading: Messages.pixelifyHeading(),
    headingColor: 'dark',
    subheading: Messages.pixelifySubheading(),
    backgroundColor: '#FFD7DC',
    backgroundColorSimple: '#FFD7DC',
    appTitle: 'Pixelify',
  },
  {
    imageUrl: canborderImage,
    heading: Messages.canborderHeading(),
    headingColor: 'dark',
    subheading: Messages.canborderSubheading(),
    backgroundColor: '#D9FDE6',
    backgroundColorSimple: '#D9FDE6',
    appTitle: 'CanBorder',
  },
];
