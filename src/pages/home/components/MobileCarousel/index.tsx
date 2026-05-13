import React, { useRef } from 'react';
import styles from './MobileCarousel.module.css';

interface MobileCarouselProps {
  name: string;
  rows?: number;
  itemsPerRow?: number;
  rowGap?: string;
  itemGap?: string;
  gutter?: 'none' | 'small' | 'medium' | 'large';
  buttonVariant?: 'circular' | 'chevron';
  children?: React.ReactNode;
}

/**
 * MobileCarousel - A unified carousel component for mobile
 * Supports single or multiple rows with the same scroll mechanism
 */
export default function MobileCarousel({
  name,
  rows = 1,
  itemsPerRow,
  rowGap = '0px',
  itemGap = '12px',
  children,
}: MobileCarouselProps): React.ReactNode {
  const scrollRef = useRef<HTMLDivElement>(null);

  const gridTemplateColumns = itemsPerRow && rows > 1 ? `repeat(${itemsPerRow}, 80px)` : 'none';
  const gridTemplateRows = rows > 1 ? `repeat(${rows}, auto)` : 'none';
  const gridAutoFlow = rows > 1 ? 'column' : 'row';

  return (
    <div className={styles.carousel} aria-label={name}>
      <div ref={scrollRef} className={styles.scrollContainer}>
        <div
          className={rows > 1 ? styles.gridContainer : styles.flexContainer}
          style={
            {
              '--grid-columns': gridTemplateColumns,
              '--grid-rows': gridTemplateRows,
              '--grid-flow': gridAutoFlow,
              '--row-gap': rowGap,
              '--item-gap': itemGap,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
      {/* Nav buttons intentionally omitted on mobile — scroll via touch/swipe. */}
    </div>
  );
}
