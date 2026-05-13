import GradientText from '@/pages/Home/components/GradientText';
import ShortcutCarousel from '@/pages/Home/components/ShortcutCarousel';
import Wonderbox from '@/pages/Home/components/Wonderbox';
import DesignSection from '@/pages/Home/components/DesignSection';
import { Box, Text } from '@canva/easel';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { recentDesigns } from '@/data/data';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function CreatorsHub() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to CreatorsHub
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
              Welcome to Creators Hub
            </GradientText>
          ) : (
            <GradientText>Welcome to the Creators Hub</GradientText>
          )}
          <Text size="large" tone="secondary">
            Discover tools and resources to enhance your creative workflow
          </Text>
        </Box>
      </Box>

      <Wonderbox />

      <ShortcutCarousel />

      <DesignSection title="Featured creator content" designs={recentDesigns} />
    </Box>
  );
}
