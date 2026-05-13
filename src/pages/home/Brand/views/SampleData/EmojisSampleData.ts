import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';

import { cdn } from '@/utils/cdn';

const wavingHand = cdn('brand-cards/emojis/waving-hand.svg');
const winkingFace = cdn('brand-cards/emojis/winking-face.svg');
const trophy = cdn('brand-cards/emojis/trophy.svg');
const thumbsUp = cdn('brand-cards/emojis/thumbs-up.svg');
const thinkingFace = cdn('brand-cards/emojis/thinking-face.svg');
const tearsOfJoy = cdn('brand-cards/emojis/tears-of-joy.svg');
const sunglasses = cdn('brand-cards/emojis/sunglasses.svg');
const starstruck = cdn('brand-cards/emojis/starstruck.svg');
const star = cdn('brand-cards/emojis/star.svg');
const shushingFace = cdn('brand-cards/emojis/shushing-face.svg');
const rocket = cdn('brand-cards/emojis/rocket.svg');
const redHeart = cdn('brand-cards/emojis/red-heart.svg');

// Emoji folder categories
export const emojiFolders: FolderData[] = [
  {
    id: '1',
    name: 'Animated Emojis',
    isPrivate: false,
    itemCount: 40,
  },
  {
    id: '2',
    name: 'Reactions',
    isPrivate: false,
    itemCount: 53,
  },
  {
    id: '3',
    name: 'Avatars',
    isPrivate: false,
    itemCount: 32,
  },
  {
    id: '4',
    name: 'Objects',
    isPrivate: false,
    itemCount: 40,
  },
  {
    id: '5',
    name: 'Product',
    isPrivate: false,
    itemCount: 39,
  },
];

// Sample emoji assets data
// Using placeholder for emoji images - replace with actual emoji image paths
export const emojiAssets: LogoAsset[] = [
  {
    id: '1',
    title: 'Waving Hand.svg',
    image: wavingHand,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '2',
    title: 'Winking Face.svg',
    image: winkingFace,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '3',
    title: 'trophy.svg',
    image: trophy,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '4',
    title: 'thumbs-up.svg',
    image: thumbsUp,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '5',
    title: 'thinking-face.svg',
    image: thinkingFace,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '6',
    title: 'Tears of Joy.svg',
    image: tearsOfJoy,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '7',
    title: 'sunglasses.svg',
    image: sunglasses,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '8',
    title: 'starstruck.svg',
    image: starstruck,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '9',
    title: 'star.svg',
    image: star,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '10',
    title: 'Shushing Face.svg',
    image: shushingFace,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '11',
    title: 'Rocket.svg',
    image: rocket,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '12',
    title: 'red-heart (1).svg',
    image: redHeart,
    type: 'Image',
    timestamp: '1 month ago',
  },
];
