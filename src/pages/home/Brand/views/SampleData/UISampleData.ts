import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';

import { cdn } from '@/utils/cdn';

const sevenLetterNoArrow = cdn('brand-cards/UI/7-letter-no-arrow.svg');
const sevenLetterLowerRight = cdn('brand-cards/UI/7-letter-lower-right.svg');
const sevenLetterUpperLeft = cdn('brand-cards/UI/7-letter-upper-left.svg');
const sevenLetterLowerLeft = cdn('brand-cards/UI/7-letter-lower-left.svg');
const sevenLetterUpperRight = cdn('brand-cards/UI/7-letter-upper-right.svg');
const sixLetterNoArrow = cdn('brand-cards/UI/6-letter-no-arrow.svg');
const sixLetterUpperLeft = cdn('brand-cards/UI/6-letter-upper-left.svg');
const sixLetterLowerRight = cdn('brand-cards/UI/6-letter-lower-right.svg');
const sixLetterLowerLeft = cdn('brand-cards/UI/6-letter-lower-left.svg');
const sixLetterUpperRight = cdn('brand-cards/UI/6-letter-upper-right.svg');
const fiveLetterNoArrow = cdn('brand-cards/UI/5-letter-no-arrow.svg');
const fiveLetterLowerRight = cdn('brand-cards/UI/5-letter-lower-right.svg');
const fiveLetterUpperRight = cdn('brand-cards/UI/5-letter-upper-right.svg');
const fiveLetterLowerLeft = cdn('brand-cards/UI/5-letter-lower-left.svg');
const fiveLetterUpperLeft = cdn('brand-cards/UI/5-letter-upper-left.svg');

// UI folder categories
export const uiFolders: FolderData[] = [
  {
    id: '1',
    name: 'UI Elements',
    isPrivate: false,
    itemCount: 11,
  },
];

// Sample UI assets data (placeholder - will be populated with actual UI elements)
export const uiAssets: LogoAsset[] = [
  {
    id: '1',
    title: '7 Letter No Arrow.svg',
    image: sevenLetterNoArrow,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '2',
    title: '7 Letter Lower Right.svg',
    image: sevenLetterLowerRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '3',
    title: '7 Letter Upper Left.svg',
    image: sevenLetterUpperLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '4',
    title: '7 Letter Lower Left.svg',
    image: sevenLetterLowerLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '5',
    title: '7 Letter Upper Right.svg',
    image: sevenLetterUpperRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '6',
    title: '6 Letter No Arrow.svg',
    image: sixLetterNoArrow,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '7',
    title: '6 Letter Upper Left.svg',
    image: sixLetterUpperLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '8',
    title: '6 Letter Lower Right.svg',
    image: sixLetterLowerRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '9',
    title: '6 Letter Lower Left.svg',
    image: sixLetterLowerLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '10',
    title: '6 Letter Upper Right.svg',
    image: sixLetterUpperRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '11',
    title: '5 Letter No Arrow.svg',
    image: fiveLetterNoArrow,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '12',
    title: '5 Letter Lower Right.svg',
    image: fiveLetterLowerRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '13',
    title: '5 Letter Upper Right.svg',
    image: fiveLetterUpperRight,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '14',
    title: '5 Letter Lower Left.svg',
    image: fiveLetterLowerLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '15',
    title: '5 Letter Upper Left.svg',
    image: fiveLetterUpperLeft,
    type: 'Image',
    timestamp: '1 month ago',
  },
];
