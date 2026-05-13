import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HomePageLayout from '@/pages/home/components/HomePageLayout';
import MobileBrand from './MobileBrand';

// Import view components
import AllAssets from './views/AllAssets';
import BrandTemplatesView from './views/BrandTemplatesView';
import Guidelines from './views/Guidelines';
import Logos from './views/Logos';
import Colors from './views/Colors';
import Fonts from './views/Fonts';
import Emojis from './views/Emojis';
import Photography from './views/Photography';
import Motion from './views/Motion';
import UI from './views/UI';
import VisualSuite from './views/VisualSuite';
import BrandVoice from './views/BrandVoice';
import Graphics from './views/Graphics';
import Charts from './views/Charts';
import Photos from './views/Photos';
import Icons from './views/Icons';
import CanvaValues from './views/CanvaValues';
import Stickers from './views/Stickers';
import ScriptMarks from './views/ScriptMarks';
import CanvaPhotos from './views/CanvaPhotos';

export default function Brand(): React.ReactNode {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const [searchParams] = useSearchParams();

  // Restore sidebar and secondary nav visibility when navigating to Brand
  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  // Show mobile version on mobile devices
  if (isMobile) {
    return <MobileBrand />;
  }

  // Get current view from URL params, default to 'brand-templates'
  const currentView = searchParams.get('view') || 'brand-templates';

  // Map view names to components
  const renderView = () => {
    switch (currentView) {
      case 'all-assets':
        return <AllAssets />;
      case 'brand-templates':
        return <BrandTemplatesView />;
      case 'guidelines':
        return <Guidelines />;
      case 'logos':
        return <Logos />;
      case 'colors':
        return <Colors />;
      case 'fonts':
        return <Fonts />;
      case 'emojis':
        return <Emojis />;
      case 'photography':
        return <Photography />;
      case 'motion':
        return <Motion />;
      case 'ui':
        return <UI />;
      case 'visual-suite':
        return <VisualSuite />;
      case 'brand-voice':
        return <BrandVoice />;
      case 'charts':
        return <Charts />;
      case 'graphics':
        return <Graphics />;
      case 'photos':
        return <Photos />;
      case 'icons':
        return <Icons />;
      case 'canva-values':
        return <CanvaValues />;
      case 'stickers':
        return <Stickers />;
      case 'script-marks':
        return <ScriptMarks />;
      case 'canva-photos':
        return <CanvaPhotos />;
      default:
        return <AllAssets />;
    }
  };

  return <HomePageLayout gradientHeight={160}>{renderView()}</HomePageLayout>;
}
