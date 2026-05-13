import React from 'react';
import { Box, Text, Button, Spacer } from '@canva/easel';
import { Dialog, DialogContent } from '@canva/easel/dialog';
import { Placeholder } from '@canva/easel';
import styles from './InspirationCreateMenu.module.css';

interface InspirationCreateMenuProps {
  open: boolean;
  onClose: () => void;
  inspirationCategory?: string; // The category from the clicked inspiration card
  inspirationTitle?: string; // The title from the clicked inspiration card
}

export default function InspirationCreateMenu({
  open,
  onClose,
  inspirationTitle,
}: InspirationCreateMenuProps): React.ReactNode {
  return (
    <Dialog open={open} onRequestClose={onClose}>
      <DialogContent>
        <div className={styles.container}>
          <Box className={styles.header}>
            <Box className={styles.imageContainer}>
              <Placeholder shape="rectangle" />
            </Box>
            <Text size="large" weight="bold" className={styles.inspirationTitle}>
              {inspirationTitle || 'Retro-themed pub poster for young adults'}
            </Text>
          </Box>

          <Box className={styles.content}>
            {/* Right side - Details and content */}
            <Box className={styles.rightSection}>
              <Box className={styles.detailsContainer}>
                <Text size="medium" weight="bold" className={styles.sectionHeader}>
                  About
                </Text>
                <Text size="small" className={styles.description}>
                  Hospitality businesses thrive on creating memorable experiences through compelling
                  visual storytelling. Your design should capture the unique atmosphere and
                  personality of the venue, making potential customers feel excited to visit and
                  experience what you offer.
                </Text>

                <Spacer size="2u" />

                <Text size="medium" weight="bold" className={styles.sectionHeader}>
                  Design and Content Tips
                </Text>
                <Box className={styles.tipsList}>
                  <Text size="small" className={styles.tipItem}>
                    • Use warm, inviting colors that reflect the venue's ambiance and target
                    audience
                  </Text>
                  <Text size="small" className={styles.tipItem}>
                    • Incorporate high-quality food and atmosphere photography to showcase the
                    experience
                  </Text>
                  <Text size="small" className={styles.tipItem}>
                    • Choose typography that matches the venue's personality - elegant for fine
                    dining, casual for pubs
                  </Text>
                  <Text size="small" className={styles.tipItem}>
                    • Highlight unique selling points like signature dishes, events, or special
                    offers
                  </Text>
                  <Text size="small" className={styles.tipItem}>
                    • Include practical information like opening hours, location, and contact
                    details
                  </Text>
                </Box>
              </Box>

              {/* Key Details sidebar */}
              <Box className={styles.keyDetails}>
                <Text size="medium" weight="bold" className={styles.keyDetailsTitle}>
                  Key Details
                </Text>

                {/* <Box className={styles.keyDetailItem}>
                  <Text size="small" tone="secondary">
                    10 September 2025
                  </Text>
                  <Text size="small" weight="bold" tone="critical">
                    1 day left
                  </Text>
                </Box> */}

                {/* <Box className={styles.keyDetailItem}>
                  <Text size="small" tone="secondary">
                    Payment per accepted submission
                  </Text>
                  <Text size="small" weight="bold">
                    $10
                  </Text>
                </Box> */}

                {/* <Box className={styles.keyDetailItem}>
                  <Text size="small" tone="secondary">
                    Maximum 5 submissions per Creator
                  </Text>
                  <Text size="small" weight="bold">
                    5 submissions remaining
                  </Text>
                </Box> */}

                <Spacer size="2u" />

                <Button
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    console.log('Creating design for:', inspirationTitle);
                    onClose();
                  }}
                  className={styles.createButton}
                >
                  Create
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Bottom placeholder area */}
          <Box className={styles.bottomPlaceholder}>
            <Box className={styles.placeholderBox}>
              <Text size="small" tone="secondary">
                Image Placeholder
              </Text>
            </Box>
          </Box>
        </div>
      </DialogContent>
    </Dialog>
  );
}
