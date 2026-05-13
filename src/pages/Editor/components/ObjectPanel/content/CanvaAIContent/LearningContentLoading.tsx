import React from 'react';
import { Box, Placeholder, Rows } from '@canva/easel';
import { BrandedShimmeringText } from '@/pages/home/CanvaAI/CanvaAIChat/BrandedShimmeringText';
import styles from './LearningContentLoading.module.css';

/**
 * Loading state shown above a chat reply while the Design School
 * recommendations are being "served". Mirrors the layout of
 * `LearningContentSuggestions` (a vertical stack of compact horizontal
 * list cards) so the swap to real cards feels like the same content
 * resolving in place rather than a layout shift.
 *
 * Header reuses the editor's existing AI loading-state primitives
 * (`BrandedShimmeringText` = AI swirl avatar + brand-gradient shimmer text),
 * which is the same loading affordance Canva AI uses for "Thinking…" so the
 * user gets a familiar "AI is working" cue.
 */
export function LearningContentLoading(): React.ReactNode {
  return (
    <Box width="full" paddingTop="1u">
      <Rows spacing="2u">
        <BrandedShimmeringText message="Serving up Design School recommendations" />

        <Rows spacing="1u">
          <div className={styles.skeleton}>
            <Placeholder shape="rectangle" index={0} />
          </div>
          <div className={styles.skeleton}>
            <Placeholder shape="rectangle" index={1} />
          </div>
          <div className={styles.skeleton}>
            <Placeholder shape="rectangle" index={2} />
          </div>
        </Rows>
      </Rows>
    </Box>
  );
}
