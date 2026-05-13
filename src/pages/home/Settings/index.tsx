import { useEffect, useState } from 'react';
import { Box, Rows } from '@canva/easel';
import { MenuHorizontalIcon } from '@canva/easel/icons';
import '@canva/easel/styles.css';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { useSearchParams } from 'react-router-dom';
import GradientBanner from '@/shared_components/GradientBanner';
import MobileSettingsNav from '@/shared_components/MobileSettingsNav';
import YourProfile from './views/YourProfile';
import Login from './views/Login';
import Accessibility from './views/Accessibility';
import MessagePreferences from './views/MessagePreferences';
import PrivacyControls from './views/PrivacyControls';
import DataAndStorage from './views/DataAndStorage';
import YourTeams from './views/YourTeams';
import AIPersonalization from './views/AIPersonalization';
import People from './views/People';
import Groups from './views/Groups';
import TeamProfile from './views/TeamProfile';
import Billing from './views/Billing';
import OrdersAndInvoices from './views/OrdersAndInvoices';
import WebDomains from './views/WebDomains';
import styles from './Settings.module.css';

export default function Settings(): React.ReactNode {
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();

  const currentView = searchParams.get('view') || 'your-profile';

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);

  const renderView = () => {
    switch (currentView) {
      case 'your-profile':
        return <YourProfile />;
      case 'login':
        return <Login />;
      case 'accessibility':
        return <Accessibility />;
      case 'message-preferences':
        return <MessagePreferences />;
      case 'privacy-controls':
        return <PrivacyControls />;
      case 'data-and-storage':
        return <DataAndStorage />;
      case 'your-teams':
        return <YourTeams />;
      case 'ai-personalization':
        return <AIPersonalization />;
      case 'people':
        return <People />;
      case 'groups':
        return <Groups />;
      case 'team-profile':
        return <TeamProfile />;
      case 'billing':
        return <Billing />;
      case 'orders-and-invoices':
        return <OrdersAndInvoices />;
      case 'web-domains':
        return <WebDomains />;
      default:
        return <YourProfile />;
    }
  };

  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        setShowHeader(scrollableElement.scrollTop > 0);
      }
    };

    const timer = setTimeout(() => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <>
        {/* Plain div: Easel Box's reset_f88b8e would wipe background/box-shadow set by .mobileHeaderBackground */}
        <div className={`${styles.mobileHeaderBackground} ${showHeader ? styles.visible : ''}`} />

        <button
          className={styles.hamburgerButton}
          onClick={() => setShowNav(true)}
          aria-label="Open settings menu"
        >
          <MenuHorizontalIcon size="medium" />
        </button>

        <MobileSettingsNav open={showNav} onClose={() => setShowNav(false)} />

        {/* Plain div: Easel Box's reset_f88b8e would wipe background: colorPage set by .mobileContainer */}
        <div className={styles.mobileContainer} data-mobile-scroll-container="true">
          <GradientBanner />
          <div className={styles.mobileContent}>{renderView()}</div>
        </div>
      </>
    );
  }

  return (
    <Box
      width="full"
      height="full"
      className={styles.settingsContainer}
      shadow="elevationSurfaceRaised"
      borderRadius="containerLarge"
    >
      <GradientBanner top={-105} />
      <Box className={styles.contentWrapper}>
        <Rows spacing="0">{renderView()}</Rows>
      </Box>
    </Box>
  );
}
