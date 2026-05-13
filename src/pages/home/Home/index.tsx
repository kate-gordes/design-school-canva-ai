import DesignSection from '@/pages/Home/components/DesignSection';
import HeroSection from '@/pages/Home/components/HeroSection';
import HomePageLayout from '@/pages/Home/components/HomePageLayout';
import MobileIconGrid from '@/pages/Home/components/MobileIconGrid';
import MobileHomeHeader from '@/pages/Home/components/MobileHomeHeader';
import MobileSearchBox from '@/pages/Home/components/MobileSearchBox';
import ShortcutCarousel from '@/pages/Home/components/ShortcutCarousel';
import GradientBanner from '@/shared_components/GradientBanner';
import MobilePageTitle from '@/shared_components/MobilePageTitle';
import { useAppContext } from '@/hooks/useAppContext';
import { useDesigns } from '@/hooks/useDesigns';
import { useConnectLoading } from '@/hooks/useConnectLoading';
import useIsMobile from '@/hooks/useIsMobile';
import { useEffect } from 'react';
import styles from './Home.module.css';

export default function Home(): React.ReactNode {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const designs = useDesigns();
  const isLoading = useConnectLoading();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  if (isMobile) {
    return (
      <>
        <MobileHomeHeader showAvatar={false} />
        {/* Plain div: Easel Box resets background/margin, which would break the
           fade-to-white seam below GradientBanner and the box-shadow. */}
        <div className={styles.defaultBackground} data-mobile-scroll-container="true">
          <GradientBanner />

          <div className={styles.contentWrapper}>
            <MobilePageTitle>Create New</MobilePageTitle>

            <MobileSearchBox placeholder="What would you like to create?" />

            <MobileIconGrid />
          </div>
        </div>
      </>
    );
  }

  return (
    <HomePageLayout>
      <HeroSection title="What will you design today?" showWonderboxTabs={false} />

      <ShortcutCarousel />

      <DesignSection title="Recents" designs={designs} isLoading={isLoading} />
    </HomePageLayout>
  );
}
