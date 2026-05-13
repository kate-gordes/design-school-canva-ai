// Prototype transplanted from: pages/home/wonder_box/page/ui/content_container/content_container.tsx
// Deviations: see .porter-workspace/Home/results/WONDER_BOX.json

import { Box, Rows } from '@canva/easel';
import { ReactNode } from 'react';
import GradientBanner from '@/shared_components/GradientBanner';
import styles from './HomePageLayout.module.css';

interface HomePageLayoutProps {
  children: ReactNode;
  /** Override the gradient banner height (defaults to 278px). */
  gradientHeight?: number;
}

/**
 * Shared layout wrapper for all home pages.
 * Ensures consistent margins/padding matching the Projects page layout.
 * Features a gradient banner at the top with content below.
 *
 * Source: pages/home/wonder_box/page/ui/content_container/content_container.tsx
 * - WonderBoxPageContentPadding: responsive paddingStart/End (2u/3u/4u)
 * - WonderBoxPageContentContainer: max-width 1760px (calc(8px * 220))
 *
 * Usage:
 * <HomePageLayout>
 *   <HeroSection ... />
 *   <YourContent ... />
 * </HomePageLayout>
 */
export default function HomePageLayout({
  children,
  gradientHeight,
}: HomePageLayoutProps): React.ReactNode {
  return (
    <Box
      width="full"
      height="full"
      className={styles.pageContainer}
      shadow="elevationSurfaceRaised"
      borderRadius="containerLarge"
    >
      <GradientBanner height={gradientHeight} />

      {/* Content wrapper - sits above gradient */}
      <Box className={styles.contentWrapper}>
        {/* WonderBoxPageContentContainer: max-width 1760px, margin: 0 auto
            Source: content_container.css .container { max-width: calc(8px * 220) = 1760px } */}
        <div className={styles.contentContainer}>
          <Rows spacing="0">{children}</Rows>
        </div>
      </Box>
    </Box>
  );
}
