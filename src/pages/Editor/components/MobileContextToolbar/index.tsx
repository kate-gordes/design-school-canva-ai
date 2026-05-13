import React from 'react';
import { Box } from '@canva/easel';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import styles from './MobileContextToolbar.module.css';

/**
 * Floating context toolbar shown above the selected element on mobile.
 * Displays a replace/cycle icon and a "more" button.
 */
export default function MobileContextToolbar(): React.ReactNode {
  return (
    <Box className={styles.toolbar} display="flex" alignItems="center">
      <button
        className={styles.toolbarButton}
        onClick={() => console.log('Replace/Cycle clicked')}
        aria-label="Replace"
      >
        {/* Replace/cycle icon matching the Canva mobile editor */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <div className={styles.divider} />
      <button
        className={styles.toolbarButton}
        onClick={() => console.log('More options clicked')}
        aria-label="More options"
      >
        <MoreHorizontalIcon size="medium" />
      </button>
    </Box>
  );
}
