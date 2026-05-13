import React, { useState } from 'react';
import { Box, Text, Spacer } from '@canva/easel';
import { Dialog, DialogContent } from '@canva/easel/dialog';
import { ChevronDownIcon, BrandKitIcon } from '@canva/easel/icons';
import styles from './BrandKitButton.module.css';

interface BrandKitButtonProps {
  /** Additional CSS class for custom styling */
  className?: string;
}

export default function BrandKitButton({ className }: BrandKitButtonProps): React.ReactNode {
  const [isBrandKitModalOpen, setIsBrandKitModalOpen] = useState<boolean>(false);

  return (
    <>
      {/* Canva Brand Kit Button */}
      <div
        className={`${styles.brandKitButton} ${className || ''}`}
        onClick={() => setIsBrandKitModalOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsBrandKitModalOpen(true);
          }
        }}
      >
        <div className={styles.brandKitButtonContent}>
          <BrandKitIcon size="medium" className={styles.brandIcon} />
          <span>Canva Brand Kit</span>
          <ChevronDownIcon size="medium" />
        </div>
      </div>

      {/* Brand Kit Modal */}
      <Dialog open={isBrandKitModalOpen} onRequestClose={() => setIsBrandKitModalOpen(false)}>
        <DialogContent>
          <Box padding="4u">
            <Text size="large" weight="bold">
              Canva Brand Kit
            </Text>
            <Spacer size="2u" />
            <Text>Modal content coming soon...</Text>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
