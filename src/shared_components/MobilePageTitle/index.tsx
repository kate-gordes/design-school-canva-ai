import React from 'react';
import { Title } from '@canva/easel';
import styles from './MobilePageTitle.module.css';

export interface MobilePageTitleProps {
  children: React.ReactNode;
  /**
   * Optional right-aligned slot for per-page actions (e.g. plus button,
   * overflow menu). Rendered on the far right of the title row.
   */
  actions?: React.ReactNode;
  /**
   * Optional wrapper around the title itself (e.g. a <button> that opens a
   * scope switcher on /projects). When provided, it receives the Title as
   * its child.
   */
  renderTitleWrapper?: (title: React.ReactNode) => React.ReactNode;
  /**
   * When true, adds extra top padding so the title clears content rendered
   * above it (the user avatar on /more, back buttons on sub-routes).
   */
  hasContentAbove?: boolean;
}

/**
 * Standard top-of-page title for mobile home routes. Keeps the title at the
 * same vertical position on every page (32px from the top of the scroll
 * container, 24px below). Use on /, /projects, /templates, /more, etc.
 */
export default function MobilePageTitle({
  children,
  actions,
  renderTitleWrapper,
  hasContentAbove = false,
}: MobilePageTitleProps): React.ReactNode {
  const titleNode = (
    <Title size="large" className={styles.title}>
      {children}
    </Title>
  );

  const rowClass = hasContentAbove ? `${styles.row} ${styles.rowOffset}` : styles.row;

  // Plain <div>: Easel Box's reset_f88b8e wipes the flex padding set on
  // .row, so we need a raw element here to keep the 32/24/16 spacing.
  return (
    <div className={rowClass}>
      {renderTitleWrapper ? renderTitleWrapper(titleNode) : titleNode}
      {actions}
    </div>
  );
}
