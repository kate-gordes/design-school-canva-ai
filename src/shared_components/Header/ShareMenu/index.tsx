import React from 'react';
import { FlyoutMenu } from '@canva/easel/flyout_menu';
import { Text, Box, Spacer, Button, Avatar, Title } from '@canva/easel';
import {
  ChartBarIcon,
  PlusIcon,
  CheckCircleIcon,
  LinkIcon,
  LockClosedIcon,
  CogIcon,
  GlobeIcon,
  ChevronDownIcon,
  CanvaLetterLogoFilledColorIcon,
} from '@canva/easel/icons';
import { RegularSearch } from '@/shared_components/Search';
import styles from './ShareMenu.module.css';

export const ShareMenu: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [accessLevel, setAccessLevel] = React.useState('only-you');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const accessOptions = [
    {
      value: 'only-you',
      label: 'Only you can access',
      description: 'Only you can access the design using this link.',
      icon: LockClosedIcon,
    },
    {
      value: 'canva-team',
      label: 'Canva Team',
      description: 'Anyone from Canva Team can access the design using this link.',
      icon: CanvaLetterLogoFilledColorIcon,
    },
    {
      value: 'anyone-with-link',
      label: 'Anyone with the link',
      description: 'Anyone can access the design using this link. No sign in required.',
      icon: GlobeIcon,
    },
  ];

  const selectedOption =
    accessOptions.find(option => option.value === accessLevel) || accessOptions[0];

  const renderIcon = (option: (typeof accessOptions)[0]) => {
    return React.createElement(option.icon, { size: 'medium', tone: 'secondary' });
  };

  const handleCopyLink = () => {
    console.log('Copy link clicked');
  };

  const handleAccessLevelChange = (value: string) => {
    setAccessLevel(value);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <FlyoutMenu
      trigger={props => (
        <Button
          variant="primary"
          size="medium"
          onClick={props.onClick}
          pressed={props.pressed}
          ariaControls={props.ariaControls}
          ariaHasPopup={props.ariaHasPopup}
          className={styles.shareButton}
        >
          Share
        </Button>
      )}
    >
      <Box className={styles.shareMenuContent}>
        {/* Scrollable Content */}
        <Box className={styles.scrollableContent}>
          {/* Header */}
          <Box className={styles.headerSection}>
            <Box display="flex" alignItems="center" justifyContent="spaceBetween">
              <Title size="small">Share design</Title>
              <Box display="flex" alignItems="center">
                <ChartBarIcon size="medium" tone="secondary" />
                <Spacer size="0.5u" />
                <Text size="small" weight="bold">
                  0 visitors
                </Text>
                <Spacer size="1u" />
                <CogIcon size="medium" tone="secondary" />
              </Box>
            </Box>
          </Box>

          {/* People with access */}
          <Box className={styles.menuSection}>
            <Text size="medium" weight="bold">
              People with access
            </Text>
            <Spacer size="1u" />
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Add people or groups"
            />
            <Spacer size="1u" />
            <Box className={styles.avatarSection}>
              <Box className={styles.avatarContainer}>
                <Avatar size="small" />
                <Box className={styles.addPersonButton}>
                  <PlusIcon size="small" />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Access level */}
          <Box className={styles.menuSection}>
            <Text size="medium" weight="bold">
              Access level
            </Text>
            <Spacer size="1u" />
            <Box className={styles.customDropdown}>
              {/* Plain button: custom dropdown trigger with transparent bg,
                  space-between layout and rounded hover chrome; Easel Button
                  would override these. */}
              <button className={styles.dropdownTrigger} onClick={handleDropdownToggle}>
                <Box display="flex" alignItems="center">
                  <Box className={styles.dropdownIcon}>{renderIcon(selectedOption)}</Box>
                  <Text size="medium">{selectedOption.label}</Text>
                </Box>
                <ChevronDownIcon size="medium" tone="secondary" />
              </button>

              {isDropdownOpen && (
                <Box className={styles.dropdownMenu}>
                  {accessOptions.map(option => (
                    // Plain button: dropdown row with white background and
                    // rounded-corner hover/selected variants; Easel Button
                    // chrome would override them.
                    <button
                      key={option.value}
                      className={`${styles.dropdownOption} ${option.value === accessLevel ? styles.selectedOption : ''}`}
                      onClick={() => handleAccessLevelChange(option.value)}
                    >
                      <Box className={styles.optionIcon}>{renderIcon(option)}</Box>
                      <Box className={styles.optionContent}>
                        <Text size="medium" weight="bold">
                          {option.label}
                        </Text>
                        <Text size="small" tone="secondary">
                          {option.description}
                        </Text>
                      </Box>
                      {option.value === accessLevel && (
                        <CheckCircleIcon size="medium" tone="secondary" />
                      )}
                    </button>
                  ))}
                </Box>
              )}
            </Box>
          </Box>

          {/* Copy link button */}
          <Box className={styles.menuSection}>
            <Button
              variant="primary"
              size="medium"
              onClick={handleCopyLink}
              className={styles.copyLinkButton}
              stretch
              icon={LinkIcon}
            >
              Copy link
            </Button>
          </Box>

          {/* Divider */}
          <Box className={styles.divider} />

          {/* Action buttons grid */}
          {/* <Box className={styles.menuSection}>
            <Box className={styles.actionGrid}>
              <ShareOptionButton
                icon={DownloadIcon}
                size="small"
                tone="secondary"
                label="Download"
                onClick={() => handleMenuItemClick('download')}
              />

              <ShareOptionButton
                icon={PresentIcon}
                size="small"
                tone="secondary"
                label="Present"
                onClick={() => handleMenuItemClick('present')}
              />

              <ShareOptionButton
                icon={CheckCircleIcon}
                size="small"
                tone="secondary"
                label="Request approval"
                onClick={() => handleMenuItemClick('request-approval')}
              />

              <ShareOptionButton
                icon={LinkIcon}
                size="small"
                tone="secondary"
                label="View-only link"
                onClick={() => handleMenuItemClick('view-only-link')}
              />

              <ShareOptionButton
                icon={CogIcon}
                size="small"
                tone="secondary"
                label="Print with Canva"
                onClick={() => handleMenuItemClick('print-with-canva')}
              />

              <ShareOptionButton
                icon={CameraIcon}
                label="Present and record"
                onClick={() => handleMenuItemClick('present-and-record')}
              />

              <ShareOptionButton
                icon={LinkIcon}
                label="Website"
                onClick={() => handleMenuItemClick('website')}
              />

              <ShareOptionButton
                icon={MoreHorizontalIcon}
                label="See all"
                onClick={() => handleMenuItemClick('see-all')}
              />
            </Box>
          </Box> */}
        </Box>
      </Box>
    </FlyoutMenu>
  );
};
