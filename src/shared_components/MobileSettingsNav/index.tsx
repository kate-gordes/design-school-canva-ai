import React from 'react';
import { Box, Text, Title } from '@canva/easel';
import {
  ArrowLeftIcon,
  UserCircleIcon,
  SignInIcon,
  A11yCircleIcon,
  EnvelopeIcon,
  LockUserIcon,
  DatabaseIcon,
  UserListIcon,
  MagicIcon,
  UserIcon,
  UsersIcon,
  TeamSliderIcon,
  CreditCardFrontIcon,
  CartIcon,
  GlobeIcon,
} from '@canva/easel/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './MobileSettingsNav.module.css';

interface MobileSettingsNavProps {
  open: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const personalAccountItems: NavItem[] = [
  { id: 'your-profile', label: 'Your profile', icon: <UserCircleIcon size="medium" /> },
  { id: 'login', label: 'Login', icon: <SignInIcon size="medium" /> },
  { id: 'accessibility', label: 'Accessibility', icon: <A11yCircleIcon size="medium" /> },
  { id: 'message-preferences', label: 'Message preferences', icon: <EnvelopeIcon size="medium" /> },
  { id: 'privacy-controls', label: 'Privacy controls', icon: <LockUserIcon size="medium" /> },
  { id: 'data-and-storage', label: 'Data and storage', icon: <DatabaseIcon size="medium" /> },
  { id: 'your-teams', label: 'Your teams', icon: <UserListIcon size="medium" /> },
  { id: 'ai-personalization', label: 'AI personalization', icon: <MagicIcon size="medium" /> },
];

const peopleManagementItems: NavItem[] = [
  { id: 'people', label: 'People', icon: <UserIcon size="medium" /> },
  { id: 'groups', label: 'Groups', icon: <UsersIcon size="medium" /> },
  { id: 'team-profile', label: 'Team profile', icon: <TeamSliderIcon size="medium" /> },
];

const paymentsItems: NavItem[] = [
  { id: 'billing', label: 'Billing', icon: <CreditCardFrontIcon size="medium" /> },
  { id: 'orders-and-invoices', label: 'Orders and invoices', icon: <CartIcon size="medium" /> },
];

const domainsItems: NavItem[] = [
  { id: 'web-domains', label: 'Web domains', icon: <GlobeIcon size="medium" /> },
];

export default function MobileSettingsNav({
  open,
  onClose,
}: MobileSettingsNavProps): React.ReactNode {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view') || 'your-profile';

  if (!open) return null;

  const handleItemClick = (view: string) => {
    navigate(`/settings?view=${view}`);
    onClose();
  };

  const renderSection = (title: string, items: NavItem[]) => (
    <Box className={styles.section}>
      <Text size="small" tone="secondary" weight="bold" className={styles.sectionTitle}>
        {title}
      </Text>
      {items.map(item => (
        // Plain button: Easel Button adds its own chrome that conflicts with
        // the .navItem row styling (full-width, selected background, custom
        // padding and hover states).
        <button
          key={item.id}
          className={`${styles.navItem} ${currentView === item.id ? styles.selected : ''}`}
          onClick={() => handleItemClick(item.id)}
        >
          {/* Plain span: neutral icon wrapper — no semantics, flex-only. */}
          <span className={styles.navIcon}>{item.icon}</span>
          <Text size="medium">{item.label}</Text>
        </button>
      ))}
    </Box>
  );

  return (
    <>
      {/* Plain div: Easel Box's reset_f88b8e would wipe the translucent
          rgba(0, 0, 0, 0.3) backdrop background. */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Plain div: Easel Box would wipe the colorPage background +
          box-shadow + slideIn animation on the drawer panel. */}
      <div className={styles.overlay}>
        {/* Plain div: Easel Box would wipe the border-bottom on the header. */}
        <div className={styles.header}>
          {/* Plain button: custom .backButton styling (negative margin,
              transparent bg, circular hover state). */}
          <button className={styles.backButton} onClick={onClose} aria-label="Close menu">
            <ArrowLeftIcon size="medium" />
          </button>
          <Title size="small">Settings</Title>
        </div>

        {/* Plain div: padding wrapper without semantics; kept as div for
            consistency with the drawer chrome above. */}
        <div className={styles.content}>
          {renderSection('Personal account', personalAccountItems)}
          {renderSection('People management', peopleManagementItems)}
          {renderSection('Payments and plans', paymentsItems)}
          {renderSection('Domains', domainsItems)}
        </div>
      </div>
    </>
  );
}
