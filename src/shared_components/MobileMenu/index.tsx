import React from 'react';
import { Box, Menu, MenuItem, Text, Avatar, Spacer } from '@canva/easel';
import { HomeIcon, ProjectsIcon, BrandIcon, HelpCircleIcon } from '@/shared_components/icons';
import styles from './MobileMenu.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/hooks/useAppContext';
import { AppsIcon, MessageSquarePlusIcon, TrashIcon } from '@canva/easel/icons';
import MagicIcon from '@/pages/Home/components/Wonderbox/icons/MagicIcon';

export default function MobileMenu(): React.ReactNode {
  const { pathname } = useLocation();
  const { state, setMobileMenuOpen } = useAppContext();

  const items = [
    { id: 'home', label: 'Home', to: '/', icon: <HomeIcon size={24} /> },
    { id: 'projects', label: 'Projects', to: '/projects', icon: <ProjectsIcon size={24} /> },
    { id: 'brand', label: 'Brand', to: '/brand', icon: <BrandIcon size={24} /> },
    { id: 'apps', label: 'Apps', to: '/apps', icon: <AppsIcon size="medium" /> },
    { id: 'canva-ai', label: 'Canva AI', to: '/ai', icon: <MagicIcon size={24} /> },
    { id: 'ask-canva', label: 'Ask Canva', to: '/ai', icon: <HelpCircleIcon size={24} /> },
    {
      id: 'feedback',
      label: 'Feedback',
      to: '/settings',
      icon: <MessageSquarePlusIcon size="medium" />,
    },
    { id: 'trash', label: 'Trash', to: '/settings#trash', icon: <TrashIcon size="medium" /> },
  ];

  const handleNavigate = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Plain div: Easel Box's reset_f88b8e would wipe the translucent
          rgba(0, 0, 0, 0.3) background that makes this the drawer backdrop. */}
      <div
        className={`${styles.backdrop} ${state.mobileMenuOpen ? styles.backdropVisible : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <Box className={`${styles.wrapper} ${state.mobileMenuOpen ? styles.visible : ''}`}>
        <Box className={styles.header}>
          <Text size="large" weight="bold">
            Menu
          </Text>
        </Box>

        <Box className={styles.profileRow}>
          <Avatar
            size="large"
            name="Valentina Solis"
            photo="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face"
          />
          <Box>
            <Text weight="bold">Valentina Solis</Text>
            <Text size="small" tone="secondary">
              Canva Team
            </Text>
          </Box>
        </Box>

        <Menu role="menu" variant="rounded">
          {items.map(item => (
            <Link key={item.id} to={item.to} className={styles.link} onClick={handleNavigate}>
              <MenuItem selected={pathname === item.to} start={item.icon}>
                {item.label}
              </MenuItem>
            </Link>
          ))}
        </Menu>

        <Spacer size="2u" />
      </Box>
    </>
  );
}
