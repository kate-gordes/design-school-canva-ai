import React, { useEffect, useRef } from 'react';
import { Avatar, Box, Text, Title } from '@canva/easel';
import {
  ArrowLeftIcon,
  BellIcon,
  ChevronDownIcon,
  CogIcon,
  ContrastIcon,
  InfoIcon,
  AppsIcon,
  BriefcaseIcon,
  SignOutIcon,
  ChevronRightIcon,
  FlaskConicalIcon,
  UsersIcon,
  CheckIcon,
} from '@canva/easel/icons';
import { useNavigate } from 'react-router-dom';
import { useSignals } from '@preact/signals-react/runtime';
import GradientBanner from '@/shared_components/GradientBanner';
import CanvaLogoIcon from '@/shared_components/icons/CanvaLogoIcon';
import { connectUser, isConnected, connectLogin, connectDisconnect } from '@/store';
import styles from './MobileUserFlyout.module.css';

interface MobileUserFlyoutProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileUserFlyout({
  open,
  onClose,
}: MobileUserFlyoutProps): React.ReactNode {
  useSignals();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  const connected = isConnected.value;
  const user = connectUser.value;
  const fakeName = 'Valentina Solis';
  const fakeEmail = 'valentina.solis@canva.com';
  const fakePhoto =
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face';
  const realName = user?.display_name ?? 'My data';
  const realEmail = user?.email ?? 'Tap to sign in to Canva';
  const realPhoto = user?.picture ?? undefined;

  // Reset scroll position when flyout opens
  useEffect(() => {
    if (open && overlayRef.current) {
      overlayRef.current.scrollTop = 0;
    }
  }, [open]);

  if (!open) return null;

  const handleSettingsClick = () => {
    onClose();
    navigate('/settings');
  };

  const handleMenuItemClick = (action: string) => {
    console.log(`User flyout action: ${action}`);
    // Handle navigation or actions here
  };

  const handleSelectFake = () => {
    onClose();
    if (connected) connectDisconnect();
  };

  const handleSelectReal = () => {
    onClose();
    if (!connected) void connectLogin();
  };

  return (
    // Plain div: Easel Box's reset_f88b8e would wipe the colorPage background
    // + slideIn animation on the full-screen drawer overlay.
    <div className={styles.overlay} ref={overlayRef}>
      <GradientBanner height={150} />

      {/* Header with back button and notification */}
      <Box className={styles.header}>
        {/* Plain button: custom circular hover (.backButton) with negative
            margin; Easel Button chrome would override it. */}
        <button className={styles.backButton} onClick={onClose} aria-label="Go back">
          <ArrowLeftIcon size="medium" />
        </button>

        {/* Plain button: same custom hover chrome as backButton. */}
        <button
          className={styles.notificationButton}
          onClick={() => handleMenuItemClick('notifications')}
          aria-label="Notifications"
        >
          <BellIcon size="medium" />
          {/* Plain span: .notificationBadge paints an absolute-positioned
              rounded pill with custom background/color. */}
          <span className={styles.notificationBadge}>9+</span>
        </button>
      </Box>

      {/* Content */}
      <Box className={styles.content}>
        {/* Account Section */}
        <Box className={styles.sectionHeader}>
          <Title size="medium">Switch accounts</Title>
        </Box>

        {/* Plain div: .card carries a colorPage background, border, and
            box-shadow that Easel Box's reset would wipe. */}
        <div className={styles.card} onClick={handleSelectFake}>
          <Box className={styles.cardInfo}>
            <Avatar size="large" name={fakeName} photo={fakePhoto} />
            <Box className={styles.cardText}>
              <Title size="small">{fakeName}</Title>
              <Text size="small" tone="secondary">
                {fakeEmail}
              </Text>
            </Box>
          </Box>
          {!connected && (
            /* Plain button: same circular chevronButton chrome, just hosts a check icon. */
            <button className={styles.chevronButton} aria-label="Active account">
              <CheckIcon size="medium" />
            </button>
          )}
        </div>

        <div className={styles.card} onClick={handleSelectReal}>
          <Box className={styles.cardInfo}>
            <Avatar size="large" name={realName} photo={realPhoto} />
            <Box className={styles.cardText}>
              <Title size="small">{realName}</Title>
              <Text size="small" tone="secondary">
                {connected ? realEmail : 'Tap to sign in to Canva'}
              </Text>
            </Box>
          </Box>
          {connected && (
            <button className={styles.chevronButton} aria-label="Active account">
              <CheckIcon size="medium" />
            </button>
          )}
        </div>

        {/* Team Section */}
        <Box className={styles.sectionHeader}>
          <Title size="medium">Team</Title>
        </Box>

        {/* Plain div: see .card rationale above. */}
        <div className={styles.card} onClick={() => handleMenuItemClick('team')}>
          <Box className={styles.cardInfo}>
            <CanvaLogoIcon size={56} />
            <Box className={styles.cardText}>
              <Title size="small">Canva Team</Title>
              <Text size="small" tone="secondary">
                Canva • <UsersIcon size="small" /> 5,935
              </Text>
            </Box>
          </Box>
          <button className={styles.chevronButton} aria-label="Expand team options">
            <ChevronDownIcon size="medium" />
          </button>
        </div>

        {/* Menu Items */}
        <Box className={styles.menuSection}>
          {/* Plain button: .menuItem has a transparent background with a
              custom hover (opacity:0.8); Easel Button would impose its own
              chrome and override the inline-flex + full-width layout. */}
          <button className={styles.menuItem} onClick={handleSettingsClick}>
            <Box className={styles.menuItemLeft}>
              <CogIcon size="medium" />
              <Text size="large">Settings</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('staff-controls')}>
            <Box className={styles.menuItemLeft}>
              <FlaskConicalIcon size="medium" />
              <Text size="large">Staff Controls</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('theme')}>
            <Box className={styles.menuItemLeft}>
              <ContrastIcon size="medium" />
              <Text size="large">Theme</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('help')}>
            <Box className={styles.menuItemLeft}>
              <InfoIcon size="medium" />
              <Text size="large">Help and resources</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('advanced-tools')}>
            <Box className={styles.menuItemLeft}>
              <AppsIcon size="medium" />
              <Text size="large">Advanced tools</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('plans-pricing')}>
            <Box className={styles.menuItemLeft}>
              <BriefcaseIcon size="medium" />
              <Text size="large">Plans and pricing</Text>
            </Box>
            <Box className={styles.menuItemRight}>
              <ChevronRightIcon size="medium" tone="secondary" />
            </Box>
          </button>

          <button className={styles.menuItem} onClick={() => handleMenuItemClick('logout')}>
            <Box className={styles.menuItemLeft}>
              <SignOutIcon size="medium" />
              <Text size="large">Log out</Text>
            </Box>
          </button>
        </Box>
      </Box>
    </div>
  );
}
