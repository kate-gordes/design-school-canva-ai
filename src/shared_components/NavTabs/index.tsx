import React from 'react';
import { Box, Text } from '@canva/easel';
import { Button } from '@canva/easel/button';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './NavTabs.module.css';
import {
  NavTemplatesIcon,
  NavTemplatesIconActive,
  NavProjectsIcon,
  NavProjectsIconActive,
  NavMoreIcon,
  PlusCircleIcon,
  PlusCircleIconActive,
  CanvaAIIcon,
  NavCanvaAIIconActive,
} from '@/shared_components/icons';
import useIsMobile from '@/hooks/useIsMobile';

export default function NavTabs(): React.ReactNode {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!isMobile) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type IconComponent = React.ComponentType<{ size?: any; className?: string }>;
  type NavItem = {
    id: string;
    label: string;
    to?: string;
    icon: IconComponent;
    activeIcon: IconComponent;
    isEaselIcon?: boolean;
  };

  const items: NavItem[] = [
    {
      id: 'canva-ai',
      label: 'Canva AI',
      to: '/ai',
      icon: CanvaAIIcon as IconComponent,
      activeIcon: NavCanvaAIIconActive as IconComponent,
    },
    {
      id: 'create',
      label: 'Create',
      to: '/',
      icon: PlusCircleIcon as IconComponent,
      activeIcon: PlusCircleIconActive as IconComponent,
    },
    {
      id: 'designs',
      label: 'Your Designs',
      to: '/projects',
      icon: NavProjectsIcon as IconComponent,
      activeIcon: NavProjectsIconActive as IconComponent,
    },
    {
      id: 'templates',
      label: 'Templates',
      to: '/templates',
      icon: NavTemplatesIcon as IconComponent,
      activeIcon: NavTemplatesIconActive as IconComponent,
    },
    {
      id: 'more',
      label: 'More',
      to: '/more',
      icon: NavMoreIcon as IconComponent,
      activeIcon: NavMoreIcon as IconComponent,
    },
  ];

  const NavButton = ({
    to,
    onClick,
    icon,
    activeIcon,
    active = false,
    label,
    isEaselIcon = false,
    iconSizeOverride,
  }: {
    to?: string;
    onClick?: () => void;
    icon: IconComponent;
    activeIcon: IconComponent;
    active?: boolean;
    label: string;
    isEaselIcon?: boolean;
    iconSizeOverride?: number;
  }) => {
    const IconCmp = active ? activeIcon : icon;
    const iconSize = isEaselIcon ? 'medium' : (iconSizeOverride ?? 24);

    return (
      <Button
        variant="tertiary"
        ariaLabel={label}
        className={`${styles.tabBtn} ${active ? styles.activeBtn : ''}`}
        onClick={() => {
          if (onClick) return onClick();
          if (to) navigate(to);
        }}
        ariaCurrent={active ? 'page' : undefined}
      >
        <Box className={styles.contentWrap}>
          <IconCmp size={iconSize} className={styles.tabIcon} />
          <Text alignment="center" className={styles.label}>
            {label}
          </Text>
        </Box>
      </Button>
    );
  };

  const isActive = (item: NavItem) => Boolean(item.to && pathname === item.to);

  return (
    // Plain footer: Easel Box's reset_f88b8e would wipe the background #fff
    // + box-shadow + border-top set by .wrapper, and the <footer> element
    // carries a landmark role that Box doesn't preserve.
    <footer className={styles.wrapper}>
      {items.map(item => {
        // CanvaAIIcon's paths fill more of its 24px viewBox than the other nav
        // icons — shrink it slightly so all five tabs read at the same size.
        const iconSizeOverride = item.id === 'canva-ai' ? 22 : undefined;
        return (
          <NavButton
            key={item.id}
            to={item.to}
            icon={item.icon}
            activeIcon={item.activeIcon}
            active={isActive(item)}
            label={item.label}
            isEaselIcon={item.isEaselIcon}
            iconSizeOverride={iconSizeOverride}
          />
        );
      })}
    </footer>
  );
}
