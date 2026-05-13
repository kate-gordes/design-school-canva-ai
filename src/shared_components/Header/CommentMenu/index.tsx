import React from 'react';
import { FlyoutMenu } from '@canva/easel/flyout_menu';
import { Text, Box, Button } from '@canva/easel';
import { MessageRoundIcon, SlidersIcon, XIcon, ChevronDownIcon } from '@canva/easel/icons';
import styles from './CommentMenu.module.css';

export const CommentMenu: React.FC = () => {
  const handleAddComment = () => {
    console.log('Add comment clicked');
  };

  return (
    <FlyoutMenu
      trigger={props => (
        // Plain button: .commentButton matches the header-chrome style
        // (translucent white border on the purple gradient) that Easel
        // Button's variants don't provide.
        <button
          onClick={props.onClick}
          aria-controls={props.ariaControls}
          aria-haspopup={props.ariaHasPopup}
          aria-expanded={props.pressed}
          className={styles.commentButton}
        >
          <MessageRoundIcon size="medium" />
        </button>
      )}
    >
      <Box className={styles.menuContent}>
        {/* Header with page selector */}
        <Box className={styles.header}>
          <Box className={styles.pageSelector}>
            <SlidersIcon size="small" className={styles.headerIcon} />
            <Text size="medium" className={styles.pageText}>
              Current page
            </Text>
            <ChevronDownIcon size="small" className={styles.chevronIcon} />
          </Box>
          {/* Plain button: custom .closeButton chrome with hover bg. */}
          <button className={styles.closeButton}>
            <XIcon size="small" />
          </button>
        </Box>

        {/* Content area */}
        <Box className={styles.contentArea}>
          <Text size="medium" className={styles.emptyMessage} alignment="center">
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
        </Box>
      </Box>
    </FlyoutMenu>
  );
};
