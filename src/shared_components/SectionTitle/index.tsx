import type { ReactNode } from 'react';
import { Title } from '@canva/easel';
import styles from './SectionTitle.module.css';

type Tone = 'primary' | 'secondary' | 'tertiary' | 'critical' | 'info' | 'warn' | 'success';

export interface SectionTitleProps {
  children: ReactNode;
  /**
   * Visual size. Defaults to "medium" (24px / 32px line-height on desktop,
   * 20px / 26px on mobile — the standard section heading).
   * Use "small" for the subtitles-within-sections pattern on mobile.
   */
  size?: 'medium' | 'small';
  tone?: Tone;
}

/**
 * Heading for a section (e.g. "Recents", "Folders", "Courses", "Designs").
 *
 * Use this instead of raw <Title size="medium"> whenever you're labelling a
 * section of the page. It wraps Easel's Title and corrects its font-weight
 * back to 600 to match canva.com — see SectionTitle.module.css for detail.
 */
export default function SectionTitle({
  children,
  size = 'medium',
  tone,
}: SectionTitleProps): React.ReactNode {
  return (
    <Title size={size} tone={tone} className={styles.weight}>
      {children}
    </Title>
  );
}
