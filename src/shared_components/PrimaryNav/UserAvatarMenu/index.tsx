import React, { useState } from 'react';
import { Text, Box, Button, Title } from '@canva/easel';
import { LoadingIndicator } from '@canva/easel/loading_indicator';
import { Menu, MenuItem } from '@canva/easel/menu';
import {
  CogIcon,
  ContrastIcon,
  InfoIcon,
  AppsIcon,
  BriefcaseIcon,
  DesktopIcon,
  SignOutIcon,
  ChevronRightIcon,
  TableIcon,
  CheckIcon,
  PlusIcon,
  UserCogIcon,
} from '@canva/easel/icons';
import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { connectUser, isConnected, connectLoading, connectLogin, connectDisconnect } from '@/store';
import styles from './UserAvatarMenu.module.css';

interface UserAvatarMenuProps {
  avatarImageUrl?: string;
}

export const UserAvatarMenu: React.FC<UserAvatarMenuProps> = ({ avatarImageUrl }) => {
  useSignals();
  const [isOpen, setIsOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const navigate = useNavigate();

  const connected = isConnected.value;
  const loading = connectLoading.value;
  const user = connectUser.value;
  // Fake account is always shown as Valentina. "My data" is the Connect API
  // identity; only populated once connected.
  const fakeName = 'Valentina Solis';
  const fakeEmail = 'valentina.solis@canva.com';
  const fakePhoto = avatarImageUrl;
  const realName = user?.display_name ?? 'My data';
  const realEmail = user?.email ?? 'Click to sign in to Canva';
  const realPhoto = user?.picture ?? undefined;
  const displayName = connected ? realName : fakeName;
  const displayPhoto = connected ? realPhoto : fakePhoto;

  const handleMenuItemClick = (action: string) => {
    console.log(`Avatar menu action: ${action}`);
    setIsOpen(false);
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  const handleSelectFake = () => {
    setAccountsOpen(false);
    setIsOpen(false);
    if (connected) connectDisconnect();
  };

  const handleSelectReal = () => {
    if (!connected) {
      // Keep the menu open during the auth round-trip so the loading
      // indicator stays visible until the Okta redirect fires.
      void connectLogin();
      return;
    }
    setAccountsOpen(false);
    setIsOpen(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(`.${styles.avatarMenuContainer}`)) {
      setIsOpen(false);
      setAccountsOpen(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) setAccountsOpen(false);
  }, [isOpen]);

  return (
    <div className={styles.avatarMenuContainer}>
      <button
        className={`${styles.avatarButton} ${connected ? styles.avatarButtonConnected : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={connected ? `Signed in as ${displayName}` : 'Sign in'}
      >
        {displayPhoto ? (
          <img src={displayPhoto} alt="User avatar" className={styles.avatarImage} />
        ) : (
          <Box className={styles.avatarPlaceholder}>
            <Text size="medium" weight="bold">
              {displayName.charAt(0)}
            </Text>
          </Box>
        )}
      </button>

      {isOpen && (
        <Box className={styles.flyoutMenu}>
          {/* Accounts Section */}
          <Box className={styles.sectionHeader}>
            <Text size="small" weight="bold">
              Accounts
            </Text>
          </Box>

          <button
            className={styles.accountRow}
            onClick={() => setAccountsOpen(v => !v)}
            aria-haspopup="menu"
            aria-expanded={accountsOpen}
            aria-label={`Switch account — currently ${displayName}`}
          >
            <Box className={styles.accountInfo}>
              {displayPhoto ? (
                <img src={displayPhoto} alt="User avatar" className={styles.accountAvatar} />
              ) : (
                <Box className={styles.accountAvatarPlaceholder}>
                  <Text size="large" weight="bold">
                    {displayName.charAt(0)}
                  </Text>
                </Box>
              )}
              <Box className={styles.accountText}>
                <Title size="small">{displayName}</Title>
                <Text size="small" tone="secondary">
                  {connected ? realEmail : fakeEmail}
                </Text>
              </Box>
            </Box>
            <ChevronRightIcon size="medium" tone="secondary" />
          </button>

          {accountsOpen && (
            <Box className={styles.accountsSubmenu}>
              <Box className={styles.sectionHeader}>
                <Text size="small" weight="bold">
                  Switch accounts
                </Text>
              </Box>

              <button
                className={styles.accountRow}
                onClick={handleSelectFake}
                aria-label="Use Valentina Solis demo account"
                aria-pressed={!connected}
              >
                <Box className={styles.accountInfo}>
                  {fakePhoto ? (
                    <img src={fakePhoto} alt="User avatar" className={styles.accountAvatar} />
                  ) : (
                    <Box className={styles.accountAvatarPlaceholder}>
                      <Text size="large" weight="bold">
                        {fakeName.charAt(0)}
                      </Text>
                    </Box>
                  )}
                  <Box className={styles.accountText}>
                    <Title size="small">{fakeName}</Title>
                    <Text size="small" tone="secondary">
                      {fakeEmail}
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
                aria-label={
                  loading
                    ? 'Signing in to Canva Connect'
                    : connected
                      ? 'Signed in to Canva Connect'
                      : 'Sign in to Canva Connect'
                }
                aria-pressed={connected}
              >
                <Box className={styles.accountInfo}>
                  {connected && realPhoto ? (
                    <img src={realPhoto} alt="User avatar" className={styles.accountAvatar} />
                  ) : (
                    <Box className={styles.accountAvatarPlaceholder}>
                      <Text size="large" weight="bold">
                        {realName.charAt(0)}
                      </Text>
                    </Box>
                  )}
                  <Box className={styles.accountText}>
                    <Title size="small">{realName}</Title>
                    <Text size="small" tone="secondary">
                      {loading
                        ? 'Signing in…'
                        : connected
                          ? realEmail
                          : 'Click to sign in to Canva'}
                    </Text>
                  </Box>
                </Box>
                {loading ? (
                  <LoadingIndicator size="small" />
                ) : connected ? (
                  <CheckIcon size="medium" tone="secondary" />
                ) : null}
              </button>

              <Box className={styles.divider} />

              <Menu>
                <MenuItem
                  onClick={() => handleMenuItemClick('add-account')}
                  start={<PlusIcon size="medium" />}
                >
                  Add another account
                </MenuItem>
                <MenuItem
                  onClick={() => handleMenuItemClick('manage-accounts')}
                  start={<UserCogIcon size="medium" />}
                >
                  Manage accounts
                </MenuItem>
              </Menu>
            </Box>
          )}

          <Box className={styles.divider} />

          {/* Teams Section */}
          <Box className={styles.sectionHeader}>
            <Text size="small" weight="bold">
              Teams
            </Text>
          </Box>

          <Box className={styles.createTeamContainer}>
            <Button
              variant="secondary"
              size="medium"
              stretch
              icon={TableIcon}
              onClick={() => handleMenuItemClick('create-team')}
            >
              Create team
            </Button>
          </Box>

          <Box className={styles.divider} />

          {/* Menu Items using Easel Menu component */}
          <Menu>
            <MenuItem onClick={handleSettingsClick} start={<CogIcon size="medium" />}>
              Settings
            </MenuItem>

            <MenuItem
              onClick={() => handleMenuItemClick('theme')}
              start={<ContrastIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              Theme
            </MenuItem>

            <MenuItem
              onClick={() => handleMenuItemClick('help')}
              start={<InfoIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              Help and resources
            </MenuItem>

            <MenuItem
              onClick={() => handleMenuItemClick('advanced-tools')}
              start={<AppsIcon size="medium" />}
              end={<ChevronRightIcon size="small" tone="secondary" />}
            >
              Advanced tools
            </MenuItem>

            <MenuItem
              onClick={() => handleMenuItemClick('plans-pricing')}
              start={<BriefcaseIcon size="medium" />}
            >
              Plans and pricing
            </MenuItem>

            <Box className={styles.divider} />

            <MenuItem
              onClick={() => handleMenuItemClick('canva-apps')}
              start={<DesktopIcon size="medium" />}
            >
              Get the Canva Apps
            </MenuItem>

            <Box className={styles.divider} />

            <MenuItem
              onClick={() => handleMenuItemClick('logout')}
              start={<SignOutIcon size="medium" />}
            >
              Log out
            </MenuItem>
          </Menu>
        </Box>
      )}
    </div>
  );
};

export default UserAvatarMenu;
