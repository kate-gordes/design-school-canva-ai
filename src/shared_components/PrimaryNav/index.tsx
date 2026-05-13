import React, { useState } from 'react';
import { Box, Text } from '@canva/easel';
import { GiftBoxIcon, CalendarIcon, DesignSchoolIcon } from '@canva/easel/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import {
  NavHomeIcon,
  NavHomeIconActive,
  NavProjectsIcon,
  NavProjectsIconActive,
  NavTemplatesIcon,
  NavTemplatesIconActive,
  NavBrandIcon,
  NavBrandIconActive,
  NavCanvaAIIcon,
  NavCanvaAIIconActive,
  NavAppsIcon,
  NavAppsIconActive,
  NavMoreIcon,
  NavDockLeftIcon,
  NavDockLeftFilledIcon,
  NotificationIcon,
  PlusIcon,
  CreatorIcon,
} from '@/shared_components/icons';
import styles from './PrimaryNav.module.css';
import CreateMenu from '@/shared_components/CreateMenu';
import UserAvatarMenu from './UserAvatarMenu';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  activeIcon: React.ComponentType<{ size?: number; className?: string }>;
  /** End of a visual group — adds extra bottom spacing after this item. */
  endsGroup?: boolean;
}

const PrimaryNav = () => {
  const { state, toggleSecondaryNav } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  if (!state.sidebarVisible) {
    return null;
  }

  const navigationItems: NavItem[] = [
    {
      id: 'canva-ai',
      label: 'Canva AI',
      path: '/ai',
      icon: NavCanvaAIIcon,
      activeIcon: NavCanvaAIIconActive,
      endsGroup: true,
    },
    { id: 'home', label: 'Home', path: '/', icon: NavHomeIcon, activeIcon: NavHomeIconActive },
    {
      id: 'projects',
      label: 'Projects',
      path: '/projects',
      icon: NavProjectsIcon,
      activeIcon: NavProjectsIconActive,
    },
    {
      id: 'templates',
      label: 'Templates',
      path: '/templates',
      icon: NavTemplatesIcon,
      activeIcon: NavTemplatesIconActive,
    },
    {
      id: 'brand',
      label: 'Brand',
      path: '/brand',
      icon: NavBrandIcon,
      activeIcon: NavBrandIconActive,
    },
    {
      id: 'apps',
      label: 'Apps',
      path: '/apps',
      icon: NavAppsIcon,
      activeIcon: NavAppsIconActive,
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.path;
    const IconComponent = isActive ? item.activeIcon : item.icon;
    const iconSize = item.id === 'canva-ai' ? 34 : 24;

    return (
      <Link key={item.id} to={item.path} className={styles.navLink}>
        <Box
          className={`${styles.navItem} ${isActive ? styles.navItemActive : ''} ${item.endsGroup ? styles.navItemGroupEnd : ''}`}
        >
          <Box className={styles.iconContainer}>
            <IconComponent size={iconSize} className={styles.navIcon} />
          </Box>
          <Text size="xsmall" className={styles.navLabel}>
            {item.label}
          </Text>
        </Box>
      </Link>
    );
  };

  return (
    <Box
      className={`${styles.primaryNav} ${!state.secondaryNavVisible ? styles.primaryNavNoBorder : ''}`}
      background="elevationSurface"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="spaceBetween"
      paddingY="0.5u"
      height="full"
    >
      {/* Container 1: Menu toggle button */}
      <Box className={styles.menuToggleContainer}>
        <button
          className={`${styles.menuToggleButton} ${state.secondaryNavVisible ? styles.menuToggleButtonActive : ''}`}
          onClick={toggleSecondaryNav}
        >
          {state.secondaryNavVisible ? (
            <NavDockLeftFilledIcon size={24} className={styles.menuToggleIcon} />
          ) : (
            <NavDockLeftIcon size={24} className={styles.menuToggleIcon} />
          )}
        </button>
      </Box>

      {/* Container 2: Create button */}
      <Box className={styles.createButtonContainer}>
        <button className={styles.createButton} onClick={() => setCreateOpen(true)}>
          <PlusIcon size={24} className={styles.createButtonIcon} />
        </button>
        <Text size="xsmall" className={styles.createButtonLabel}>
          Create
        </Text>
      </Box>

      <CreateMenu open={createOpen} onClose={() => setCreateOpen(false)} />

      {/* Container 3: Navigation items */}
      <Box className={styles.navItems}>
        {navigationItems.map(renderNavItem)}

        {/* More button with flyout */}
        <div
          className={styles.moreContainer}
          onMouseEnter={() => setShowMoreMenu(true)}
          onMouseLeave={() => setShowMoreMenu(false)}
        >
          <button className={styles.navItem}>
            <Box className={styles.iconContainer}>
              <NavMoreIcon />
            </Box>
            <Text size="xsmall" className={styles.navLabel}>
              More
            </Text>
          </button>

          {showMoreMenu && (
            <Box className={styles.moreMenu}>
              <button
                className={styles.moreMenuItem}
                onClick={() => {
                  setShowMoreMenu(false);
                  navigate('/design-school');
                }}
              >
                <Box className={styles.moreIconContainer}>
                  <DesignSchoolIcon size="medium" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="medium" weight="bold">
                    Design School
                  </Text>
                  <Text size="small" tone="secondary">
                    Bite-sized lessons to level up your design skills.
                  </Text>
                </Box>
              </button>

              <button
                className={styles.moreMenuItem}
                onClick={() => console.log("What's new clicked")}
              >
                <Box className={styles.moreIconContainer}>
                  <GiftBoxIcon size="medium" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="medium" weight="bold">
                    What's new
                  </Text>
                  <Text size="small" tone="secondary">
                    Discover the latest news from Canva.
                  </Text>
                </Box>
              </button>

              <button
                className={styles.moreMenuItem}
                onClick={() => console.log('Content Planner clicked')}
              >
                <Box className={styles.moreIconContainer}>
                  <CalendarIcon size="medium" />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="medium" weight="bold">
                    Content Planner
                  </Text>
                  <Text size="small" tone="secondary">
                    Take control of your social channels.
                  </Text>
                </Box>
              </button>

              <button
                className={styles.moreMenuItem}
                onClick={() => {
                  setShowMoreMenu(false);
                  navigate('/creator/creators-hub');
                }}
              >
                <Box className={styles.moreIconContainer}>
                  <CreatorIcon size={24} />
                </Box>
                <Box display="flex" flexDirection="column">
                  <Text size="medium" weight="bold">
                    Creator
                  </Text>
                  <Text size="small" tone="secondary">
                    Share your work with the Canva community.
                  </Text>
                </Box>
              </button>
            </Box>
          )}
        </div>
      </Box>

      {/* Bottom section with notifications and user avatar */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        className={styles.bottomSection}
      >
        <Box className={styles.notificationContainer}>
          <Box className={styles.notificationIcon}>
            <NotificationIcon size={24} className={styles.bellIcon} />
          </Box>
        </Box>

        <UserAvatarMenu avatarImageUrl="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face" />
      </Box>
    </Box>
  );
};

export default PrimaryNav;
