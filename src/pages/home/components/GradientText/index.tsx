// Prototype transplanted from: pages/home/ui/borderless_banner/default_banner/hero_title.css
// Deviations: see .porter-workspace/Home/results/WONDER_BOX.json

import styles from './GradientText.module.css';

interface GradientTextProps {
  children: React.ReactNode;
  /** Render as solid text color instead of the hero gradient fill. */
  plain?: boolean;
  /** @deprecated ignored — use CSS responsive breakpoints */
  isMobile?: boolean;
  /** @deprecated ignored — font size is controlled by CSS responsive breakpoints */
  size?: string;
  /** @deprecated ignored */
  variant?: string;
}

// DEVIATION [dom-complexity]: Using plain h3 instead of Easel <Title> to prevent
// Easel's textTitleLarge (24px) from overriding heroTitleOverride (40px).
// Per memory note: Easel Title font-size wins even with heroTitleOverride 40px class.
// Source: pages/home/ui/borderless_banner/default_banner/hero_title.css .heroTitleOverride
// Responsive font-size handled via media queries in GradientText.module.css.
export default function GradientText({
  children,
  plain = false,
}: GradientTextProps): React.ReactNode {
  const className = plain ? `${styles.gradientText} ${styles.plain}` : styles.gradientText;
  return <h3 className={className}>{children}</h3>;
}
