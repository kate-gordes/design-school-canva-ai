import React from 'react';
import { Card, Box, Title, Text, Spacer } from '@canva/easel';
import { Tooltip } from '@canva/easel/tooltip';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import {
  CopyIcon,
  TrashIcon,
  PencilIcon,
  PagePlusIcon,
  EyeSlashIcon,
  LinkIcon,
  ResizePanelsIcon,
  CopyPlusIcon,
  PaintRollerIcon,
  TransitionIcon,
  NotesIcon,
  WhiteboardIcon,
  PresentIcon,
  MoreHorizontalIcon,
} from '@canva/easel/icons';
import { CrownIcon } from '@/shared_components/icons';
import styles from './PageThumbnail.module.css';

interface PageThumbnailProps {
  pageNumber: number;
  isActive: boolean;
  isSelected?: boolean; // true when a canvas element is selected on this page (purple border + white)
  onClick: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  label?: string;
  isMobile?: boolean;
  variant?: 'default' | 'mobileGrid';
}

export default function PageThumbnail({
  pageNumber,
  isActive,
  isSelected = false,
  onClick,
  onDuplicate = () => {},
  onDelete = () => {},
  label = 'Page',
  isMobile = false,
  variant = 'default',
}: PageThumbnailProps): React.ReactNode {
  const handleMenuItemClick = (action: string) => {
    console.log(`Page menu action: ${action} for page ${pageNumber}`);

    switch (action) {
      case 'duplicate':
        onDuplicate();
        break;
      case 'delete':
        onDelete();
        break;
      // Add other actions as needed
    }
  };

  if (variant === 'mobileGrid') {
    const gridBorderClass = isActive ? styles.mobileGridThumbActive : '';
    return (
      <div className={styles.mobileGridWrapper}>
        <button
          className={`${styles.mobileGridThumb} ${gridBorderClass}`}
          onClick={onClick}
          aria-label={`${label} ${pageNumber}`}
        >
          <div className={styles.mobileGridThumbInner} />
        </button>
        <div className={styles.mobileGridLabel}>
          <PresentIcon size="small" />
          <span
            className={`${styles.mobileGridPageNumber} ${isActive ? styles.mobileGridPageNumberActive : ''}`}
          >
            {pageNumber}
          </span>
        </div>
      </div>
    );
  }

  if (isMobile) {
    const isSheet = label === 'Sheet';
    const mobileClass =
      isActive && isSelected
        ? isSheet
          ? styles.mobileThumbSheetSelected
          : styles.mobileThumbSelected
        : isActive
          ? isSheet
            ? styles.mobileThumbSheetCurrent
            : styles.mobileThumbCurrent
          : '';
    return (
      <button
        className={`${styles.mobileThumb} ${mobileClass}`}
        onClick={onClick}
        aria-label={`${label} ${pageNumber}`}
      >
        <div className={styles.mobileThumbInner}>
          <span className={styles.mobilePageNumber}>{pageNumber}</span>
        </div>
      </button>
    );
  }

  const desktopClass = isSelected ? styles.selected : isActive ? styles.current : '';
  return (
    <Box
      className={`${styles.thumbnailContainer} ${desktopClass}`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Tooltip label={`Page ${pageNumber}`} placement="top">
        <Card
          layout="vertical"
          onClick={onClick}
          thumbnail={
            <Box className={styles.thumbnailContent}>
              <span className={styles.pageNumber}>{pageNumber}</span>
            </Box>
          }
        />
      </Tooltip>

      <FlyoutMenu
        trigger={triggerProps => (
          <button
            onClick={triggerProps.onClick}
            aria-controls={triggerProps.ariaControls}
            aria-haspopup={triggerProps.ariaHasPopup}
            aria-expanded={triggerProps.pressed}
            className={styles.ellipsisButton}
            aria-label="Page options"
          >
            <MoreHorizontalIcon size="small" />
          </button>
        )}
        header={
          <Box paddingY="2u" paddingX="3u" borderBottom="standard">
            <Box display="flex" alignItems="center" justifyContent="spaceBetween">
              <Box>
                <Box display="flex" alignItems="center">
                  <Title size="small">Add page title</Title>
                  <Spacer size="1u" />
                  <PencilIcon size="small" />
                </Box>
                <Spacer size="1u" />
                <Text size="small" tone="secondary">
                  Presentation • 1920 x 1080 px
                </Text>
              </Box>
            </Box>
          </Box>
        }
      >
        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('copy')}
          start={<CopyIcon size="medium" />}
          end={
            <Text size="small" tone="secondary">
              ⌘C
            </Text>
          }
        >
          Copy
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('paste')}
          start={<CopyIcon size="medium" />}
          end={
            <Text size="small" tone="secondary">
              ⌘V
            </Text>
          }
        >
          Paste
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('add-page')}
          start={<PagePlusIcon size="medium" />}
          end={
            <Text size="small" tone="secondary">
              ⌘↩
            </Text>
          }
        >
          Add page
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('resize-page')}
          start={<ResizePanelsIcon size="medium" />}
          end={<CrownIcon size="small" />}
        >
          Resize page
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('duplicate')}
          start={<CopyPlusIcon size="medium" />}
          end={
            <Text size="small" tone="secondary">
              ⌘D
            </Text>
          }
        >
          Duplicate page
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('delete')}
          start={<TrashIcon size="medium" />}
          end={
            <Text size="small" tone="secondary">
              DELETE
            </Text>
          }
        >
          Delete page
        </FlyoutMenuItem>

        <FlyoutMenuDivider />

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('copy-page-style')}
          start={<PaintRollerIcon size="medium" />}
          end={<CrownIcon size="small" />}
        >
          Copy page style
        </FlyoutMenuItem>

        <FlyoutMenuDivider />

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('copy-link')}
          start={<LinkIcon size="medium" />}
        >
          Copy link to this page
        </FlyoutMenuItem>

        <FlyoutMenuDivider />

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('add-transition')}
          start={<TransitionIcon size="medium" />}
        >
          Add transition
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('hide-page')}
          start={<EyeSlashIcon size="medium" />}
        >
          Hide page
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('notes')}
          start={<NotesIcon size="medium" />}
        >
          Notes
        </FlyoutMenuItem>

        <FlyoutMenuItem
          onClick={() => handleMenuItemClick('expand-to-whiteboard')}
          start={<WhiteboardIcon size="medium" />}
        >
          Expand to whiteboard
        </FlyoutMenuItem>
      </FlyoutMenu>
    </Box>
  );
}
