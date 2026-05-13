import React from 'react';
import { FlyoutMenu, FlyoutMenuDivider } from '@canva/easel/flyout_menu';
import { Text, Box, Button } from '@canva/easel';
import { CloudCheckIcon } from '@canva/easel/icons';
import HeaderButton from '@/shared_components/Header/HeaderButton';
import styles from './SaveStatusMenu.module.css';

export const SaveStatusMenu: React.FC = () => {
  const handleVersionHistory = () => {
    console.log('Open version history clicked');
  };

  return (
    <FlyoutMenu
      trigger={props => (
        <HeaderButton
          variant="standard"
          icon={<CloudCheckIcon size="medium" />}
          onClick={props.onClick}
          pressed={props.pressed}
          ariaLabel="Design status"
          ariaControls={props.ariaControls}
          ariaHasPopup={props.ariaHasPopup}
        />
      )}
      header={
        <Box paddingY="1.5u" paddingX="2u">
          <Text size="medium" weight="bold">
            Design status
          </Text>
          <Text size="small" tone="secondary">
            Last saved: Just now
          </Text>
        </Box>
      }
    >
      <FlyoutMenuDivider />

      <Box className={styles.menuContent}>
        <Box className={styles.buttonContainer}>
          <Button
            variant="primary"
            size="medium"
            onClick={handleVersionHistory}
            className={styles.versionHistoryButton}
          >
            Open version history
          </Button>
        </Box>
      </Box>
    </FlyoutMenu>
  );
};
