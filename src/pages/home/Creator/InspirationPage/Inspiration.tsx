import { useState } from 'react';
import GradientText from '@/pages/Home/components/GradientText';
import CreatorInspirationCardSection from '@/pages/Home/Creator/InspirationPage/CreatorInspirationCardSection';
import CreatorInspirationCreateMenu from '@/pages/Home/Creator/InspirationPage/CreatorInspirationCreateMenu';
import { Box, Text, Rows } from '@canva/easel';
import styles from '@/pages/Home/Creator/Creator.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { creatorInspirations } from './sampleInspirationData';

import PillFilterSection from './PillFilterSection';

export default function Inspiration() {
  const isMobile = useIsMobile();
  const [createMenuOpen, setCreateMenuOpen] = useState(true); // Testing: Open by default

  const handleCardClick = () => {
    setCreateMenuOpen(true);
  };

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
          <Rows spacing="1u">
            {isMobile ? (
              <GradientText size="medium" variant="mobile">
                Who are you going to Inspire Today?
              </GradientText>
            ) : (
              <GradientText>Who are you going to Inspire Today?</GradientText>
            )}
            <Text size="large" tone="secondary">
              Find inspiration for your next project
            </Text>
          </Rows>
        </Box>
      </Box>

      <PillFilterSection />

      <CreatorInspirationCardSection
        inspirations={creatorInspirations}
        onCardClick={handleCardClick}
      />

      <CreatorInspirationCreateMenu
        open={createMenuOpen}
        onClose={() => setCreateMenuOpen(false)}
      />
    </Box>
  );
}
