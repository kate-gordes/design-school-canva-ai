import React from 'react';
import GradientBanner from '@/shared_components/GradientBanner';
import MobileHomeHeader from '@/pages/Home/components/MobileHomeHeader';
import MobilePageTitle from '@/shared_components/MobilePageTitle';
import MobileSearchBox from '@/pages/Home/components/MobileSearchBox';
import styles from './MobilePageLayout.module.css';

interface MobilePageLayoutProps {
  /** Page title displayed at the top */
  title: string;
  /** Whether to show the search box */
  showSearch?: boolean;
  /** Optional custom search placeholder */
  searchPlaceholder?: string;
  /** Whether to show the title in header on scroll */
  showTitleOnScroll?: boolean;
  /** Optional action button (e.g., plus button) */
  actionButton?: React.ReactNode;
  /**
   * Whether to show the user avatar in the scroll-aware header.
   * Defaults to false so most pages match /projects. /more opts in.
   */
  showAvatar?: boolean;
  /** Page content */
  children: React.ReactNode;
}

/**
 * Reusable layout component for mobile pages with consistent padding/margins.
 * Provides:
 * - Mobile home header with scroll behavior (and optional avatar)
 * - Shared MobilePageTitle (same vertical rhythm on every page)
 * - Optional search box
 * - Gradient background
 * - White header on scroll (automatic on all pages)
 */
export default function MobilePageLayout({
  title,
  showSearch = true,
  searchPlaceholder = 'Search',
  showTitleOnScroll = false,
  actionButton,
  showAvatar = false,
  children,
}: MobilePageLayoutProps): React.ReactNode {
  return (
    <>
      {/* Mobile header with white background on scroll - works on all pages */}
      <MobileHomeHeader
        title={title}
        showTitleOnScroll={showTitleOnScroll}
        actionButton={actionButton}
        showAvatar={showAvatar}
      />

      {/* Plain <div>: this element owns the data-mobile-scroll-container hook used by
          MobileHomeHeader's scroll listener and paints a white background beneath the
          gradient. Easel Box would reset background/margin via reset_f88b8e and break
          the fade-to-white seam. */}
      <div className={styles.container} data-mobile-scroll-container="true">
        <GradientBanner />

        {/* Content wrapper */}
        <div className={styles.contentWrapper}>
          {/* Add clearance for the avatar/back-button that sits above the title. */}
          <MobilePageTitle hasContentAbove={showAvatar}>{title}</MobilePageTitle>

          {/* Search Box - 16px horizontal padding (built into MobileSearchBox) */}
          {showSearch && <MobileSearchBox placeholder={searchPlaceholder} />}

          {/* Content Area - children should apply paddingX="2u" (16px) where needed */}
          {children}
        </div>
      </div>
    </>
  );
}
