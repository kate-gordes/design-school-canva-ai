import React from 'react';
import { Text, Button } from '@canva/easel';
import { SlidersIcon, XIcon, ChevronDownIcon } from '@canva/easel/icons';
import styles from './MobileCommentPanel.module.css';

interface MobileCommentPanelProps {
  onClose: () => void;
}

export default function MobileCommentPanel({ onClose }: MobileCommentPanelProps): React.ReactNode {
  const handleAddComment = () => {
    console.log('Add comment clicked');
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Bottom sheet panel */}
      <div className={styles.panel}>
        <div className={styles.handle} />

        {/* Header with page selector and close */}
        <div className={styles.header}>
          <button className={styles.pageSelector}>
            <SlidersIcon size="small" className={styles.pageSelectorIcon} />
            <Text size="medium" className={styles.pageSelectorText}>
              Current page
            </Text>
            <ChevronDownIcon size="small" className={styles.chevronIcon} />
          </button>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close comments">
            <XIcon size="small" />
          </button>
        </div>

        {/* Content area */}
        <div className={styles.contentArea}>
          <Text size="medium" className={styles.emptyMessage}>
            There are no comments on this page.
          </Text>

          <Button
            variant="tertiary"
            size="medium"
            onClick={handleAddComment}
            className={styles.addCommentButton}
          >
            Add comment
          </Button>
        </div>
      </div>
    </>
  );
}
