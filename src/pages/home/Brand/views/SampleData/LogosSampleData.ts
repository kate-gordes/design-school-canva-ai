import type { LogoAsset } from '@/pages/home/Brand/components/BrandComponents/LogoAssetsSection';

// Import logo images
import { cdn } from '@/utils/cdn';

const canvaLogoCircle = cdn('brand-cards/logos/logo-canva-circle.svg');
const canvaLogo = cdn('brand-cards/logos/logo-canva.svg');
const canvaLogoWhite = cdn('brand-cards/logos/logo-canva-white.svg');

// Sample logo assets data
// Add more logo assets here as needed
export const logoAssets: LogoAsset[] = [
  {
    id: '1',
    title: 'ICON - GRADIENT - COLOUR',
    image: canvaLogoCircle,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '2',
    title: 'CIRCLE LOGO - GRADIENT - COLOUR',
    image: canvaLogoCircle,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '3',
    title: 'WORDMARK LOGO - GRADIENT - COLOUR',
    image: canvaLogo,
    type: 'Image',
    timestamp: '1 month ago',
  },
  {
    id: '4',
    title: 'WORDMARK LOGO - WHITE',
    image: canvaLogoWhite,
    type: 'Image',
    timestamp: '1 month ago',
  },
];
