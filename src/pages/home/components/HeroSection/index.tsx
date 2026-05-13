import { Box } from '@canva/easel';
import type { ReactNode } from 'react';
import GradientText from '@/pages/Home/components/GradientText';
import Wonderbox from '@/pages/Home/components/Wonderbox';
import type { TabId } from '@/pages/Home/components/Wonderbox/WonderboxContext';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  title: string;
  wonderboxInitialTab?: TabId;
  showWonderboxTabs?: boolean;
  /** When false, hides the Wonderbox focus-state filter row (Type/Category/etc). */
  showWonderboxFocusFilters?: boolean;
  /** When false, render a solid-colour title instead of the hero gradient. */
  gradient?: boolean;
  /** Override the Wonderbox search input placeholder. */
  wonderboxPlaceholder?: string;
  /** Optional slot rendered directly above the title (e.g. Canva AI wordmark). */
  logo?: ReactNode;
}

export default function HeroSection({
  title,
  wonderboxInitialTab,
  showWonderboxTabs = true,
  showWonderboxFocusFilters = true,
  gradient = true,
  wonderboxPlaceholder,
  logo,
}: HeroSectionProps): React.ReactNode {
  return (
    <>
      <Box width="full">
        <Box className={styles.contentArea}>
          {logo ? <div className={styles.logo}>{logo}</div> : null}
          <GradientText plain={!gradient}>{title}</GradientText>
        </Box>
      </Box>

      <Wonderbox
        initialTab={wonderboxInitialTab}
        showTabs={showWonderboxTabs}
        showFocusFilters={showWonderboxFocusFilters}
        placeholder={wonderboxPlaceholder}
      />
    </>
  );
}
