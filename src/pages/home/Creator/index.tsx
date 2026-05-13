import GradientText from '@/pages/Home/components/GradientText';
import ShortcutCarousel from '@/pages/Home/components/ShortcutCarousel';
import Wonderbox from '@/pages/Home/components/Wonderbox';
import DesignSection from '@/pages/Home/components/DesignSection';
import { Box } from '@canva/easel';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { recentDesigns } from '@/data/data';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function Creator() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to Creator
  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);
  return (
    <Box
      width="full"
      height="full"
      className={styles.defaultBackground}
      shadow="elevationSurfaceRaised"
      borderRadius="containerLarge"
    >
      <Box width="full">
        <Box className={styles.contentArea}>
          {isMobile ? (
            <GradientText size="medium" variant="mobile">
              What's your task today?
            </GradientText>
          ) : (
            <GradientText>Hey, Sarah, find or create anything</GradientText>
          )}
        </Box>
      </Box>

      {/* <Wonderbox /> */}

      {/* <ShortcutCarousel /> */}

      {/* <DesignSection title="Recent designs" designs={recentDesigns} /> */}
    </Box>
  );
}
