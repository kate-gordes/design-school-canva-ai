import GradientText from '@/pages/Home/components/GradientText';
import DesignSection from '@/pages/Home/components/DesignSection';
import { Box, Text, Button } from '@canva/easel';
import { UploadIcon } from '@canva/easel/icons';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { recentDesigns } from '@/data/data';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function MyItems() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to MyItems
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
              My Items
            </GradientText>
          ) : (
            <GradientText>Manage Your Creative Assets</GradientText>
          )}
          <Text size="large" tone="secondary">
            Organize and manage your uploads, elements, and creative content
          </Text>

          <Box paddingTop="2u">
            <Button
              variant="primary"
              icon={UploadIcon}
              onClick={() => console.log('Upload new item')}
            >
              Upload New Item
            </Button>
          </Box>
        </Box>
      </Box>

      <DesignSection title="Recent uploads" designs={recentDesigns} />
      <DesignSection title="My elements" designs={recentDesigns} />
      <DesignSection title="Saved items" designs={recentDesigns} />
    </Box>
  );
}
