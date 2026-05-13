import React, { useEffect, useId, useMemo, useRef } from 'react';
import { Box, Text } from '@canva/easel';
import { BaseButton } from '@canva/easel/button/base_button';
import type { TranscriptLine } from '@/data/designSchoolCatalog';
import styles from './Transcript.module.css';

interface TranscriptProps {
  lines: TranscriptLine[];
  currentTime: number;
  onSeek: (seconds: number) => void;
  /**
   * Layout mode:
   * - `'fill'` (default): outer box is `height: 100%` and the inner list
   *   `flex: 1 1 0; overflow-y: auto`. Use when the parent is a
   *   constrained flex column with a real pixel height (desktop expanded
   *   card). The list fills remaining space and scrolls internally.
   * - `'flow'`: outer box hugs content, the inner list renders at its
   *   intrinsic height and does not scroll. Use when the parent is a
   *   Rows / unconstrained block (mobile sheet, mobile pinned card) — let
   *   the *parent* surface scroll. Without this, `height: 100%` of an
   *   unconstrained parent collapses to 0 and the list disappears.
   */
  mode?: 'fill' | 'flow';
}

/**
 * Transcript drawer rendered below the video player. Layout mirrors the
 * YouTube transcript panel: a scrollable list of timestamp pills + spoken
 * text. The line whose time window contains `currentTime` is highlighted,
 * and clicking a line seeks the player.
 *
 * The drawer has no internal title, search, or close affordance — opening
 * and closing is owned by the parent's "Show transcript" / "Hide transcript"
 * toggle, so the drawer itself is just content. Search was removed
 * intentionally: at this length (≈100 lines) and with the full transcript
 * already visible by scroll, search added chrome without enough payoff.
 */
export default function Transcript({
  lines,
  currentTime,
  onSeek,
  mode = 'fill',
}: TranscriptProps): React.ReactNode {
  const activeIndex = useMemo(() => findActiveIndex(lines, currentTime), [lines, currentTime]);

  const indexedLines = useMemo(() => lines.map((line, index) => ({ line, index })), [lines]);

  const listRef = useRef<HTMLDivElement | null>(null);
  // Stable id prefix for the per-row BaseButton DOM ids. We use IDs (rather
  // than React refs) because Easel's BaseButton ref returns a `BasicHTMLHandle`
  // wrapper rather than the raw HTMLButtonElement; a `getElementById` lookup
  // is the simplest way to scroll the active row into view.
  const rowIdPrefix = useId();

  useEffect(() => {
    if (activeIndex < 0) return;
    const row = document.getElementById(`${rowIdPrefix}-${activeIndex}`);
    const list = listRef.current;
    if (!row || !list) return;
    const rowRect = row.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    const isVisible = rowRect.top >= listRect.top && rowRect.bottom <= listRect.bottom;
    if (!isVisible) {
      row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeIndex, rowIdPrefix]);

  // `fill` mode constrains the outer Box and lets the list flex/scroll
  // internally. `flow` mode lets it hug content (parent surface scrolls).
  const isFill = mode === 'fill';

  return (
    // Outer Box is itself a flex column so the .list child can grow into the
    // available space inside its parent. Easel `Rows` has no flex / height
    // props so we use `Box` with `display="flex" flexDirection="column"` to
    // get the same vertical-stack-with-gap layout while letting the list
    // flex-grow (in fill mode).
    <Box
      background="elevationSurfaceFloating"
      borderRadius="containerLarge"
      padding="2u"
      height={isFill ? 'full' : 'unset'}
      minHeight="0"
      display="flex"
      flexDirection="column"
      gap="1.5u"
    >
      <div ref={listRef} className={`${styles.list} ${isFill ? styles.listFill : styles.listFlow}`}>
        {indexedLines.map(({ line, index }) => {
          const isActive = index === activeIndex;
          return (
            <BaseButton
              key={`${line.start}-${index}`}
              id={`${rowIdPrefix}-${index}`}
              type="button"
              onClick={() => onSeek(line.start)}
              width="full"
              className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
              ariaCurrent={isActive ? true : undefined}
            >
              <span className={`${styles.time} ${isActive ? styles.timeActive : ''}`}>
                {formatTimestamp(line.start)}
              </span>
              <span className={styles.text}>{line.text}</span>
            </BaseButton>
          );
        })}
      </div>

      <Text size="xsmall" tone="secondary">
        English (auto-generated)
      </Text>
    </Box>
  );
}

function findActiveIndex(lines: TranscriptLine[], currentTime: number): number {
  if (lines.length === 0) return -1;
  // Linear scan is fine — transcripts here are O(100) entries and we only
  // recompute on poll ticks (~4Hz). If this ever grows, switch to a binary
  // search by `start`.
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    if (currentTime >= lines[i].start) return i;
  }
  return 0;
}

function formatTimestamp(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
