import { Grid } from '@canva/easel';
import type { ReactNode } from 'react';
import useIsMobile from '@/hooks/useIsMobile';

interface ResponsiveCardGridProps {
  children: ReactNode;
  spacing?: '0' | '0.25u' | '0.5u' | '1u' | '1.5u' | '2u' | '3u' | '4u' | '6u' | '8u' | '12u';
}

/**
 * Shared responsive grid component for displaying cards
 *
 * Breakpoints:
 * - default (< 600px): 2 columns
 * - smallUp (≥ 600px): 2 columns
 * - mediumUp (≥ 900px): 3 columns
 * - largeUp (≥ 1200px): 4 columns
 * - xLargeUp (≥ 1650px): 6 columns
 */
export default function ResponsiveCardGrid({
  children,
  spacing = '3u',
}: ResponsiveCardGridProps): React.ReactNode {
  const isMobile = useIsMobile();
  const gridSpacing = isMobile ? '2u' : spacing;

  return (
    <Grid
      spacing={gridSpacing}
      columns={{ default: 2, smallUp: 2, mediumUp: 3, largeUp: 4, xLargeUp: 6 }}
    >
      {children}
    </Grid>
  );
}
