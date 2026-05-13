import React, { useState } from 'react';
import { FlyoutMenu } from '@canva/easel/flyout_menu';
import { Text, Box, Avatar } from '@canva/easel';
import { LoadingIndicator } from '@canva/easel/loading_indicator';
import { PlusIcon, ChevronLeftIcon, CheckIcon } from '@canva/easel/icons';
import { useSignals } from '@preact/signals-react/runtime';
import { RegularSearch } from '@/shared_components/Search';
import { FileName } from '@/shared_components/Header/FileName';
import { CURRENT_USER } from '@/constants/currentUser';
import { connectUser, isConnected, connectLoading, connectLogin, connectDisconnect } from '@/store';
import styles from './HeaderAvatar.module.css';

export const HeaderAvatar: React.FC = () => {
  useSignals();
  const [shareSearchValue, setShareSearchValue] = useState('');

  // When signed into Canva Connect, swap the header avatar to the real
  // identity so Editor matches Home's account-switch behaviour.
  const connected = isConnected.value;
  const loading = connectLoading.value;
  const user = connectUser.value;
  const realName = user?.display_name ?? 'My data';
  const realEmail = user?.email ?? 'Click to sign in to Canva';
  const realPhoto = user?.picture ?? undefined;
  const displayName = connected ? realName : CURRENT_USER.name;
  const displayEmail = connected ? realEmail : CURRENT_USER.email;
  const displayPhoto = connected && realPhoto ? realPhoto : CURRENT_USER.photo;

  const handleFileNameChange = (value: string) => {
    console.log('File name changed:', value);
  };

  const handleSelectFake = () => {
    if (connected) connectDisconnect();
  };

  const handleSelectReal = () => {
    if (!connected) void connectLogin();
  };

  // Profile dropdown content — mirrors Home's UserAvatarMenu switcher so
  // the editor can initiate Connect sign-in too.
  const ProfileDropdown = () => (
    <Box className={styles.profileDropdown}>
      <Box className={styles.sectionHeader}>
        <Text size="small" weight="bold">
          Switch accounts
        </Text>
      </Box>

      <button
        className={styles.accountRow}
        onClick={handleSelectFake}
        aria-pressed={!connected}
        aria-label="Use Valentina Solis demo account"
      >
        <Box className={styles.accountInfo}>
          <Avatar size="medium" name={CURRENT_USER.name} photo={CURRENT_USER.photo} />
          <Box className={styles.accountText}>
            <Text size="medium" weight="bold">
              {CURRENT_USER.name}
            </Text>
            <Text size="small" tone="secondary">
              {CURRENT_USER.email}
            </Text>
          </Box>
        </Box>
        {!connected && <CheckIcon size="medium" tone="secondary" />}
      </button>

      <button
        className={styles.accountRow}
        onClick={handleSelectReal}
        disabled={loading}
        aria-busy={loading}
        aria-pressed={connected}
        aria-label={
          loading
            ? 'Signing in to Canva Connect'
            : connected
              ? 'Signed in to Canva Connect'
              : 'Sign in to Canva Connect'
        }
      >
        <Box className={styles.accountInfo}>
          <Avatar size="medium" name={realName} photo={connected ? realPhoto : undefined} />
          <Box className={styles.accountText}>
            <Text size="medium" weight="bold">
              {realName}
            </Text>
            <Text size="small" tone="secondary">
              {loading ? 'Signing in…' : connected ? realEmail : 'Click to sign in to Canva'}
            </Text>
          </Box>
        </Box>
        {loading ? (
          <LoadingIndicator size="small" />
        ) : connected ? (
          <CheckIcon size="medium" tone="secondary" />
        ) : null}
      </button>
    </Box>
  );

  // Share design dropdown content
  const ShareDesignDropdown = () => (
    <Box className={styles.shareDesignDropdown}>
      {/* Header */}
      <Box className={styles.shareHeader}>
        <Box display="flex" alignItems="center">
          <ChevronLeftIcon size="medium" tone="secondary" />
          <Text size="medium" weight="bold" className={styles.shareTitle}>
            Share design
          </Text>
        </Box>
      </Box>

      {/* Search */}
      <Box className={styles.searchSection}>
        <RegularSearch
          value={shareSearchValue}
          onChange={setShareSearchValue}
          placeholder="Add names, groups or emails"
        />
      </Box>

      {/* User info */}
      <Box className={styles.userSection}>
        <Box className={styles.userInfo}>
          <Avatar size="medium" name={displayName} photo={displayPhoto} />
          <Box className={styles.userText}>
            <Text size="medium" weight="bold">
              {displayName}
            </Text>
            <Text size="small" tone="secondary">
              {displayEmail}
            </Text>
          </Box>
          <Text size="small" tone="secondary" className={styles.ownerBadge}>
            Owner
          </Text>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className={styles.avatarContainer}>
      {/* File Name Input */}
      <FileName onChange={handleFileNameChange} />

      {/* Button Container for overlapping buttons */}
      <Box className={styles.buttonContainer}>
        {/* Plus Button (behind profile) */}
        <FlyoutMenu
          trigger={props => (
            // Plain button: .plusButton has a translucent-white border and
            // an absolute layout that overlaps the profile avatar; Easel
            // Button chrome would override these.
            <button
              onClick={props.onClick}
              aria-controls={props.ariaControls}
              aria-haspopup={props.ariaHasPopup}
              aria-expanded={props.pressed}
              className={styles.plusButton}
            >
              <PlusIcon size="medium" />
            </button>
          )}
        >
          <ShareDesignDropdown />
        </FlyoutMenu>

        {/* Profile Avatar (in front) */}
        <FlyoutMenu
          trigger={props => (
            // Plain button: .profileButton is an absolutely-positioned
            // bare avatar hit-target; Easel Button would add padding + chrome.
            <button
              onClick={props.onClick}
              aria-controls={props.ariaControls}
              aria-haspopup={props.ariaHasPopup}
              aria-expanded={props.pressed}
              className={styles.profileButton}
            >
              <Avatar size="medium" name={displayName} photo={displayPhoto} />
            </button>
          )}
        >
          <ProfileDropdown />
        </FlyoutMenu>
      </Box>
    </Box>
  );
};
