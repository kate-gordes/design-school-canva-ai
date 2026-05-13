import HeroSection from '@/pages/Home/components/HeroSection';
import HomePageLayout from '@/pages/Home/components/HomePageLayout';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { useEffect } from 'react';
import MobileCanvaAI from './MobileCanvaAI';
import CanvaAIPills from './CanvaAIPills';
import canvaAiLogoUrl from '@/assets/canva-ai-logo.svg';
import styles from './CanvaAI.module.css';

export default function CanvaAI(): React.ReactNode {
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const isMobile = useIsMobile();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  if (isMobile) {
    return <MobileCanvaAI />;
  }

  return (
    <HomePageLayout>
      <div className={styles.centeredHero}>
        <HeroSection
          title="What will we design today?"
          wonderboxInitialTab="ai"
          showWonderboxTabs={false}
          showWonderboxFocusFilters={false}
          wonderboxPlaceholder="Describe your idea, and I’ll bring it to life"
          logo={<img src={canvaAiLogoUrl} alt="Canva AI 2.0" />}
        />
        <CanvaAIPills />
      </div>
    </HomePageLayout>
  );
}
