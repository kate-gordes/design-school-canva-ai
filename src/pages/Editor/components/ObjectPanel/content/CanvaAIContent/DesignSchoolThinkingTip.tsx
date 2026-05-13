import React, { useState } from 'react';
import { Box, Column, Columns, Rows, Text } from '@canva/easel';
import { DesignSchoolIcon } from '@canva/easel/icons';
import { PRESENTATION_DESIGN_TIPS } from '@/data/designSchoolCatalog';
import styles from './DesignSchoolThinkingTip.module.css';

/**
 * Picks a random tip from the catalog. Pure helper so it can be passed
 * to `useState`'s lazy initializer (which only runs on mount), giving
 * each thinking session exactly one stable tip.
 */
function pickRandomTip() {
  const idx = Math.floor(Math.random() * PRESENTATION_DESIGN_TIPS.length);
  return PRESENTATION_DESIGN_TIPS[idx];
}

/**
 * Bite-sized Design School tip shown alongside the "Thinking…" indicator
 * in the Canva AI panel. Fills the AI's wait time with a short piece of
 * just-in-time presentation-design learning so the user gets something
 * useful while the model works.
 *
 * Visual treatment ports the Figma "Selection sub-thread card" 1:1
 * (https://www.figma.com/design/QMOZl2KeEJlCFMvEYoB9zK/Design-School-Vision?node-id=1028-14128):
 *
 *   - 12px padding, 16px corner radius (`elementSoftest` token — note
 *     that `elementSoft` is 12px and `elementSoftest` is 16px in
 *     `@canva/easel@22.x`, so 16px lives at the "softest" end of the
 *     element-radius scale despite the slightly counter-intuitive name).
 *   - Subtle 1px border (`border="low"` matches the Figma `ui/border` token).
 *   - Soft cyan→lavender gradient over white (CSS module, see container).
 *   - 24x24 graduation-cap glyph from Easel's `DesignSchoolIcon`, pinned
 *     to a content-width column on the left so the text always wraps to
 *     its right (rather than collapsing below it on narrow widths,
 *     which `Inline` would do).
 *   - Static "Design School Tip" eyebrow + the dynamic tip body underneath.
 *
 * The tip is selected once per mount via `useState`'s lazy initializer —
 * picking on every render would re-roll the tip on each store update
 * (which would feel unstable and could even flip between tips while the
 * user is reading). One-shot selection means the tip stays put for the
 * lifetime of this thinking session and a fresh one appears the next
 * time the AI starts thinking.
 */
export function DesignSchoolThinkingTip(): React.ReactNode {
  const [tip] = useState(pickRandomTip);

  return (
    <Box className={styles.container} borderRadius="elementSoftest" border="low" padding="1.5u">
      {/* `Columns` (vs `Inline`) guarantees the icon stays left of the
       * text on every panel width — `Inline` collapses to a single
       * column when horizontal space gets tight, which would push the
       * text under the icon. The icon column hugs its 24px content;
       * the text column takes whatever's left. `alignY="start"`
       * top-aligns the icon with the first line of the eyebrow text
       * (the standard tip / info-card pattern). */}
      <Columns spacing="0.5u" alignY="start">
        <Column width="content">
          <DesignSchoolIcon size="medium" />
        </Column>
        <Column width="fluid">
          <Rows spacing="0">
            <Text size="medium" weight="bold" tone="primary">
              Design School Tip
            </Text>
            <Text size="small" tone="tertiary">
              {tip.body}
            </Text>
          </Rows>
        </Column>
      </Columns>
    </Box>
  );
}
