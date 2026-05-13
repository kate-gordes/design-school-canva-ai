import React, { useState } from 'react';
import { Box, Text, Title, Spacer } from '@canva/easel';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import MobileSharePanel from '@/pages/Editor/components/MobileSharePanel';
import MobileCommentPanel from '@/pages/Editor/components/MobileCommentPanel';
import {
  UndoIcon,
  RedoIcon,
  MoreHorizontalIcon,
  MessageRoundIcon,
  PresentIcon,
  UploadIcon,
  HouseIcon,
  PencilIcon,
  PagePlusIcon,
  CloudUploadIcon,
  ResizePanelsIcon,
  GridViewIcon,
  CogIcon,
  A11yCircleIcon,
  HelpCircleIcon,
  CloudCheckIcon,
  ArrowDownCircleDashedIcon,
  FolderIcon,
  CopyIcon,
  DownloadIcon,
  UsersPlusIcon,
  ClockRotateLeftIcon,
  TrashIcon,
  ChevronRightIcon,
  ProCrownGreyIcon,
  FlaskConicalIcon,
  SearchIcon,
  ChartBarIcon,
  LightBulbIcon,
  FlagIcon,
} from '@canva/easel/icons';
import styles from './MobileHeader.module.css';

export default function MobileHeader(): React.ReactNode {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const handleMenuItemClick = (action: string) => {
    console.log(`Mobile menu action: ${action}`);
  };

  return (
    <>
      {isShareOpen && <MobileSharePanel onClose={() => setIsShareOpen(false)} />}
      {isCommentOpen && <MobileCommentPanel onClose={() => setIsCommentOpen(false)} />}
      <Box
        width="full"
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        className={styles.header}
      >
        {/* Left side: Home + Undo/Redo */}
        {/* Plain buttons: mobile header chrome uses a bespoke 36x36 gradient-aware style with
            white foreground; Easel Button variants don't match the flat-on-gradient treatment. */}
        <Box display="flex" alignItems="center" className={styles.leftGroup}>
          <button
            className={styles.homeButton}
            onClick={() => window.history.back()}
            aria-label="Go home"
          >
            <HouseIcon size="medium" />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => console.log('Undo clicked')}
            aria-label="Undo"
          >
            <UndoIcon size="medium" />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => console.log('Redo clicked')}
            aria-label="Redo"
          >
            <RedoIcon size="medium" />
          </button>
        </Box>

        {/* Right side: Comment, Present, Share, More */}
        {/* Plain buttons: same rationale as left group — 36x36 white-on-gradient tap targets. */}
        <Box display="flex" alignItems="center" className={styles.rightGroup}>
          <button
            className={styles.iconButton}
            onClick={() => setIsCommentOpen(true)}
            aria-label="Comment"
          >
            <MessageRoundIcon size="medium" />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => console.log('Present clicked')}
            aria-label="Present"
          >
            <PresentIcon size="medium" />
          </button>
          <button
            className={styles.iconButton}
            onClick={() => setIsShareOpen(true)}
            aria-label="Share"
          >
            <UploadIcon size="medium" />
          </button>

          <FlyoutMenu
            flyoutPlacement="bottom-end"
            flyoutOffset={{ y: -48, x: 8 }}
            trigger={props => (
              // Plain button: FlyoutMenu render-prop trigger must forward onClick +
              // aria-controls / aria-haspopup / aria-expanded verbatim; Easel Button
              // doesn't expose those aria-props directly from a trigger slot.
              <button
                className={styles.moreButton}
                onClick={props.onClick}
                aria-label="More options"
                aria-controls={props.ariaControls}
                aria-haspopup={props.ariaHasPopup}
                aria-expanded={props.pressed}
              >
                <MoreHorizontalIcon size="medium" />
              </button>
            )}
            header={
              <Box paddingY="2u" paddingX="1.5u">
                <Box display="flex" alignItems="center">
                  <Title size="small">Heading</Title>
                  <Spacer size="1.5u" />
                  <PencilIcon size="medium" tone="secondary" />
                </Box>
                <Spacer size="1.5u" />
                <Text size="small" tone="secondary">
                  Presentation • By Valentina Solis • 1920px × 1080px
                </Text>
              </Box>
            }
          >
            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('editing')}
              start={<PencilIcon size="medium" />}
              end={
                <Text size="medium" tone="secondary">
                  Change mode
                </Text>
              }
            >
              Editing
            </FlyoutMenuItem>

            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('new-design')}
              start={<PagePlusIcon size="medium" />}
            >
              Create new design
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('upload-files')}
              start={<CloudUploadIcon size="medium" />}
            >
              Upload files
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('resize')}
              start={<ResizePanelsIcon size="medium" />}
              end={<ProCrownGreyIcon size="small" />}
            >
              Resize
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('staff-only')}
              start={<FlaskConicalIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              {/* Plain span: pill-shaped badge chrome with a specific crimson background;
                  Easel Badge does not expose this exact color/shape combo. */}
              <span className={styles.staffOnlyBadge}>Staff Only</span>
            </FlyoutMenuItem>

            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('view-all-pages')}
              start={<GridViewIcon size="medium" />}
            >
              View all pages
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('settings')}
              start={<CogIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              Settings
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('accessibility')}
              start={<A11yCircleIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              Accessibility
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('help-assistant')}
              start={<HelpCircleIcon size="medium" />}
            >
              Help Assistant
            </FlyoutMenuItem>

            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('save')}
              start={<CloudCheckIcon size="medium" />}
              end={
                <Text size="small" tone="secondary">
                  All changes saved
                </Text>
              }
            >
              Save
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('make-offline')}
              start={<ArrowDownCircleDashedIcon size="medium" />}
              end={
                <Text size="small" tone="secondary">
                  Beta
                </Text>
              }
            >
              Make available offline
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('move')}
              start={<FolderIcon size="medium" />}
            >
              Move
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('copy')}
              start={<CopyIcon size="medium" />}
            >
              Make a copy
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('download')}
              start={<DownloadIcon size="medium" />}
            >
              Download
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('share')}
              start={<UsersPlusIcon size="medium" />}
            >
              Share
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('version-history')}
              start={<ClockRotateLeftIcon size="medium" />}
              end={<ProCrownGreyIcon size="small" />}
            >
              Version history
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('move-trash')}
              start={<TrashIcon size="medium" />}
            >
              Move to Trash
            </FlyoutMenuItem>

            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('find-replace')}
              start={<SearchIcon size="medium" />}
            >
              Find and replace text
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('analytics')}
              start={<ChartBarIcon size="medium" />}
              end={<ProCrownGreyIcon size="small" />}
            >
              Analytics
            </FlyoutMenuItem>

            <FlyoutMenuDivider />

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('feedback')}
              start={<LightBulbIcon size="medium" />}
            >
              Feedback
            </FlyoutMenuItem>

            <FlyoutMenuItem
              onClick={() => handleMenuItemClick('report-design')}
              start={<FlagIcon size="medium" />}
            >
              Report design
            </FlyoutMenuItem>
          </FlyoutMenu>
        </Box>
      </Box>
    </>
  );
}
