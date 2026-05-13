import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';
import type { FolderData } from '@/pages/home/components/FoldersSection';

// Motion folder categories
export const motionFolders: FolderData[] = [
  {
    id: '1',
    name: 'Animated Logos',
    isPrivate: false,
    itemCount: 3,
  },
  {
    id: '2',
    name: 'Endframes',
    isPrivate: false,
    itemCount: 2,
  },
  {
    id: '3',
    name: 'Gradient Background',
    isPrivate: false,
    itemCount: 4,
  },
];

// Sample motion assets data (placeholder - will be populated with actual videos/animations)
export const motionAssets: LogoAsset[] = [];
