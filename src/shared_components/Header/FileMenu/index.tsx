import React from 'react';
import { FlyoutMenu, FlyoutMenuItem, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import { Text, Box, Spacer, Title } from '@canva/easel';
import {
  PagePlusIcon,
  CloudUploadIcon,
  FolderIcon,
  CopyIcon,
  DownloadIcon,
  ClockRotateLeftIcon,
  TrashIcon,
  SearchIcon,
  ChevronRightIcon,
  PencilIcon,
  A11yCircleIcon,
  CogIcon,
  CloudCheckIcon,
  OpenInNewIcon,
  LightBulbIcon,
  FlagIcon,
} from '@canva/easel/icons';

import FileButton from '@/shared_components/Header/FileButton';
import styles from './FileMenu.module.css';

export const FileMenu: React.FC = () => {
  const handleMenuItemClick = (action: string) => {
    console.log(`File menu action: ${action}`);
  };

  return (
    <FlyoutMenu
      trigger={props => (
        <FileButton
          pressed={props.pressed}
          ariaControls={props.ariaControls}
          ariaHasPopup={props.ariaHasPopup}
          onClick={props.onClick}
        />
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

      <FlyoutMenuDivider />

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
        onClick={() => handleMenuItemClick('move-folder')}
        start={<FolderIcon size="medium" />}
      >
        Move to a folder
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
        onClick={() => handleMenuItemClick('version-history')}
        start={<ClockRotateLeftIcon size="medium" />}
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
        end={
          // Plain div: Easel Box's reset_f88b8e would wipe the shortcut badge
          // background-color set by .shortcutBadge.
          <div className={styles.shortcutBadge}>
            <Text size="small">⌘F</Text>
          </div>
        }
      >
        Find and replace text
      </FlyoutMenuItem>

      <FlyoutMenuItem
        onClick={() => handleMenuItemClick('open-desktop')}
        start={<OpenInNewIcon size="medium" />}
      >
        Open in desktop app
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
  );
};
