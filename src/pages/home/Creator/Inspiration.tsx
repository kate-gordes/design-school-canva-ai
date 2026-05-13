import GradientText from '@/pages/Home/components/GradientText';
import CreatorInspirationCardSection from '@/pages/Home/Creator/InspirationPage/CreatorInspirationCardSection';
import { Box, Title, Text } from '@canva/easel';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { creatorInspirations } from './InspirationPage/sampleInspirationData';
import PillFilterSection from './InspirationPage/PillFilterSection';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function Inspiration() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to Inspiration
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
              Who are you going to Inspire Today?
            </GradientText>
          ) : (
            <GradientText>Who are you going to Inspire Today?</GradientText>
          )}
        </Box>
      </Box>
      <Box className={styles.header}>
        <Title size="medium">Who are you going to Inspire Today?</Title>
        <Text size="small">Find inspiration for your next project</Text>
      </Box>

      <PillFilterSection />

      <CreatorInspirationCardSection inspirations={creatorInspirations} />
    </Box>
  );
}
