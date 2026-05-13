import GradientText from '@/pages/Home/components/GradientText';
import DesignSection from '@/pages/Home/components/DesignSection';
import { Box, Text, Button } from '@canva/easel';
import { PlusIcon } from '@canva/easel/icons';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { recentDesigns } from '@/data/data';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function ElementsCreator() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to ElementsCreator
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
              Elements Creator
            </GradientText>
          ) : (
            <GradientText>Create Custom Elements</GradientText>
          )}
          <Text size="large" tone="secondary">
            Design and share your own custom elements with the Canva community
          </Text>

          <Box paddingTop="2u">
            <Button
              variant="primary"
              icon={PlusIcon}
              onClick={() => console.log('Create new element')}
            >
              Create New Element
            </Button>
          </Box>
        </Box>
      </Box>

      <DesignSection title="Your elements" designs={recentDesigns} />
      <DesignSection title="Draft elements" designs={recentDesigns} />
      <DesignSection title="Element templates" designs={recentDesigns} />
    </Box>
  );
}
