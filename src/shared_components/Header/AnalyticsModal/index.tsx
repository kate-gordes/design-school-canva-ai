import React, { useState } from 'react';
import { Text, Box } from '@canva/easel';
import { ChartBarIcon, XIcon } from '@canva/easel/icons';
import styles from './AnalyticsModal.module.css';

export const AnalyticsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Plain button: .analyticsButton has its own header-chrome styling
          (translucent border, white-on-gradient hover) that Easel Button
          would override. */}
      <button onClick={handleOpen} className={styles.analyticsButton}>
        <ChartBarIcon size="medium" />
      </button>

      {isOpen && (
        // Plain div: Easel Box's reset_f88b8e would wipe the rgba(0,0,0,0.5)
        // modal overlay background.
        <div className={styles.modalOverlay} onClick={handleClose}>
          {/* Plain div: Easel Box would wipe the white background + 12px
              border-radius + box-shadow that define the modal surface. */}
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Box className={styles.modalHeader}>
              <Text size="large" weight="bold">
                Analytics
              </Text>
              {/* Plain button: custom .closeButton chrome with hover bg. */}
              <button onClick={handleClose} className={styles.closeButton}>
                <XIcon size="medium" />
              </button>
            </Box>

            <Box className={styles.modalBody}>
              <Text size="medium">Analytics content will go here.</Text>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};
