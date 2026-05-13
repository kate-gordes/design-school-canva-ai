import GradientText from '@/pages/Home/components/GradientText';
import DesignSection from '@/pages/Home/components/DesignSection';
import { Box, Text, Button, Badge } from '@canva/easel';
// import { VideoIcon, DocumentIcon } from '@canva/easel/icons';
import { BookOpen, Video, File } from 'lucide-react';
import styles from './Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { recentDesigns } from '@/data/data';
import { useAppContext } from '@/hooks/useAppContext';
import { useEffect } from 'react';

export default function Resources() {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();

  // Restore sidebar and secondary nav visibility when navigating to Resources
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
          <Box display="flex" alignItems="center" gap="2u" flexWrap="wrap">
            {isMobile ? (
              <GradientText size="medium" variant="mobile">
                Creator Resources
              </GradientText>
            ) : (
              <GradientText>Creator Resources & Guides</GradientText>
            )}
            <Badge tone="critical" size="small">
              <Text size="xsmall" weight="bold">
                New
              </Text>
            </Badge>
          </Box>
          <Text size="large" tone="secondary">
            Learn new skills and techniques to enhance your creative process
          </Text>

          {/* <Box display="flex" gap="2u" paddingTop="3u" flexWrap="wrap">
            <Button
              variant="secondary"
              icon={BookOpenIcon}
              onClick={() => console.log('View tutorials')}
            >
              Tutorials
            </Button>
            <Button
              variant="secondary"
              icon={VideoIcon}
              onClick={() => console.log('Watch videos')}
            >
              Video Guides
            </Button>
            <Button
              variant="secondary"
              icon={DocumentIcon}
              onClick={() => console.log('Download guides')}
            >
              Style Guides
            </Button>
          </Box> */}
        </Box>
      </Box>

      <DesignSection title="Getting started guides" designs={recentDesigns} />
      <DesignSection title="Advanced techniques" designs={recentDesigns} />
      <DesignSection title="Community resources" designs={recentDesigns} />
    </Box>
  );
}
