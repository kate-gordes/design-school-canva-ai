import React, { useState, useEffect } from 'react';
import { Avatar, Text, Title } from '@canva/easel';
import { SearchIcon } from '@canva/easel/icons';
import MobileUserFlyout from '@/shared_components/MobileUserFlyout';
import styles from './MobileHomeHeader.module.css';

interface MobileHomeHeaderProps {
  onScroll?: (scrolled: boolean) => void;
  title?: string;
  showTitleOnScroll?: boolean;
  actionButton?: React.ReactNode;
  leftButton?: React.ReactNode;
  showAvatar?: boolean;
}

export default function MobileHomeHeader({
  onScroll,
  title,
  showTitleOnScroll = false,
  actionButton,
  leftButton,
  showAvatar = true,
}: MobileHomeHeaderProps): React.ReactNode {
  const [showHeader, setShowHeader] = useState(false);
  const [showUserFlyout, setShowUserFlyout] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the scrollable container using data attribute (most reliable)
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');

      if (scrollableElement) {
        const scrolled = scrollableElement.scrollTop > 0;
        console.log('Scroll detected:', scrolled, 'scrollTop:', scrollableElement.scrollTop);
        setShowHeader(scrolled);
        onScroll?.(scrolled);
      }
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      console.log('Found scrollable element:', scrollableElement);

      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);
        console.log('Scroll listener attached');
      } else {
        console.error('Scrollable element not found!');
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');

      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onScroll]);

  return (
    <>
      {/* White header background that appears on scroll */}
      <div className={`${styles.headerBackground} ${showHeader ? styles.visible : ''}`} />

      {showAvatar && (
        <>
          <div className={styles.profileIcon}>
            <button
              className={styles.avatarButton}
              onClick={() => setShowUserFlyout(true)}
              aria-label="Open user menu"
            >
              <Avatar
                size="small"
                name="Valentina Solis"
                photo="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face"
              />
            </button>
          </div>

          <MobileUserFlyout open={showUserFlyout} onClose={() => setShowUserFlyout(false)} />
        </>
      )}

      {leftButton && !showAvatar && <div className={styles.profileIcon}>{leftButton}</div>}

      {/* Title - only visible when scrolled (for specific pages) */}
      {showTitleOnScroll && title && (
        <div className={`${styles.headerTitle} ${showHeader ? styles.visible : ''}`}>
          <Text size="medium" weight="bold">
            {title}
          </Text>
        </div>
      )}

      {/* Action button - visible when not scrolled (e.g., plus button) */}
      {actionButton && (
        <div className={`${styles.actionButton} ${showHeader ? styles.hidden : ''}`}>
          {actionButton}
        </div>
      )}

      {/* Search icon - visible when scrolled (shows instead of action button) */}
      {actionButton ? (
        <button
          className={`${styles.searchButton} ${showHeader ? styles.visible : ''}`}
          aria-label="Search"
        >
          <SearchIcon size="medium" />
        </button>
      ) : (
        <button
          className={`${styles.searchButton} ${showHeader ? styles.visible : ''}`}
          aria-label="Search"
        >
          <SearchIcon size="medium" />
        </button>
      )}
    </>
  );
}
