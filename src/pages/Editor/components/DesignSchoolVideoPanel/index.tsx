import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { Box, Rows, Inline, Text, Title } from '@canva/easel';
import { Button, CircleButton } from '@canva/easel/button';
import { Thumbnail } from '@canva/easel/thumbnail';
import { Sheet } from '@canva/easel/surface/sheet';
import {
  ArrowLeftIcon,
  ArrowMultiDirectionalIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  SubtitleIcon,
  XIcon,
} from '@canva/easel/icons';
import useIsMobile from '@/hooks/useIsMobile';
import useYouTubePlayer from '@/hooks/useYouTubePlayer';
import {
  closeDesignSchoolVideo,
  designSchoolVideo,
  designSchoolVideoPanelSide,
  setDesignSchoolVideoPanelSide,
  designSchoolVideoMinimized,
  setDesignSchoolVideoMinimized,
  toggleDesignSchoolVideoMinimized,
  designSchoolVideoMobileCompact,
  setDesignSchoolVideoMobileCompact,
  designSchoolVideoMinimizedPosition,
  setDesignSchoolVideoMinimizedPosition,
  designSchoolVideoPanelWidth,
  setDesignSchoolVideoPanelWidth,
  DESIGN_SCHOOL_VIDEO_PANEL_MIN_WIDTH,
  DESIGN_SCHOOL_VIDEO_PANEL_MAX_WIDTH,
} from '@/store';
import type { DesignSchoolVideoData, DesignSchoolVideoPanelSide } from '@/store';
import { LOGO_DESIGN_LESSONS } from '@/data/designSchoolCatalog';
import { getPortalTarget } from '@/utils/portalTarget';
import Transcript from './Transcript';
import { PracticeActivityCard } from './PracticeActivityCard';
import styles from './DesignSchoolVideoPanel.module.css';

/**
 * Re-derive the video display data from the live catalog by ID, falling
 * back to whatever was snapshotted into the signal at click time. This
 * means catalog edits (title, series, description, transcript) flow into
 * an already-open panel on the next render — without it, the user would
 * see stale content until they closed and re-opened the video card.
 */
function resolveLiveVideo(video: DesignSchoolVideoData): DesignSchoolVideoData {
  const liveItem = LOGO_DESIGN_LESSONS.find(item => item.id === video.id);
  if (!liveItem) return video;
  return {
    ...video,
    title: liveItem.title,
    series: liveItem.series ?? video.series,
    description: liveItem.description ?? video.description,
    duration: liveItem.duration ?? video.duration,
    transcript: liveItem.transcript ?? video.transcript,
  };
}

// Stable id assigned to the expanded-panel iframe so the YouTube IFrame
// API can attach to it (`new YT.Player(EXPANDED_IFRAME_ID, ...)`). One
// expanded panel exists at a time so a singleton id is safe.
const EXPANDED_IFRAME_ID = 'design-school-video-iframe';
// Separate id for the mobile bottom-sheet variant so the YouTube IFrame
// Player API can attach to it independently from the desktop expanded
// panel. They never coexist (mobile sheet vs. desktop slot is mutually
// exclusive via `useIsMobile`), so a singleton is fine.
const SHEET_IFRAME_ID = 'design-school-video-iframe-sheet';
// Iframe id used by the mobile pinned card (below the artboard). Distinct
// from the sheet id so re-binding doesn't collide if a fast unmount/mount
// transition between the two surfaces happens.
const MOBILE_PINNED_IFRAME_ID = 'design-school-video-iframe-pinned';

/**
 * DOM id of the inline slot rendered inside the mobile editor layout
 * (between the canvas area and the bottom toolbar/nav). The pinned card
 * portals into this slot so it sits in the layout flow — pushing the
 * canvas up — instead of floating over it.
 *
 * Must be kept in sync with the `<div id="...">` rendered by `Editor` in
 * `src/pages/Editor/index.tsx`.
 */
export const DESIGN_SCHOOL_MOBILE_PINNED_SLOT_ID = 'design-school-mobile-pinned-slot';

/**
 * Slot panel that opens beside the editor artboard when a Design School video
 * card is clicked from the Canva AI suggestions. Driven by the
 * `designSchoolVideo` signal — no parent state needed.
 *
 * Desktop has two modes:
 *
 *   - **Expanded** (default): a floating card docked to one of four sides of
 *     the artboard (`left | right | top | bottom`) via
 *     `designSchoolVideoPanelSide`. The user re-docks it by grabbing the
 *     move-handle icon in the header and dragging.
 *
 *   - **Minimized** (`designSchoolVideoMinimized = true`): a small
 *     picture-in-picture mini-player that hovers over the artboard with the
 *     video on the left and labels + restore / close buttons on the right.
 *     The mini-player is freely draggable (mousedown anywhere outside the
 *     buttons) and remembers its position via
 *     `designSchoolVideoMinimizedPosition`.
 *
 * Mobile: an Easel `Sheet` (modal bottom sheet) — minimize state is ignored
 * on mobile because the Sheet already handles dismiss via drag-down.
 */
export default function DesignSchoolVideoPanel(): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();

  const rawVideo = designSchoolVideo.value;
  // Re-derive title/series/description/transcript from the live catalog so
  // the panel reflects edits immediately. The signal only captures a
  // snapshot at click time, so without this, an open panel would show stale
  // strings after the catalog (or hot-reload) updated.
  const video = rawVideo ? resolveLiveVideo(rawVideo) : null;
  const side = designSchoolVideoPanelSide.value;
  const minimized = designSchoolVideoMinimized.value;

  const [draggingSide, setDraggingSide] = useState<DesignSchoolVideoPanelSide | null>(null);
  // Default the transcript drawer to OPEN. Most learning sessions
  // benefit from skim-reading alongside the video, and reading the
  // transcript while the audio plays is the most common use case for
  // this panel — opening it by default saves the user a click and
  // surfaces the feature without them needing to discover the toggle.
  // The user can still hide it via the "Hide transcript" button.
  const [showTranscript, setShowTranscript] = useState(true);

  // Reset transcript drawer state when the video changes — re-open the
  // drawer for the new video too so the default carries across video
  // switches (a closed transcript on the previous video shouldn't make
  // the next video open with it closed either).
  const previousVideoIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (video?.id !== previousVideoIdRef.current) {
      setShowTranscript(true);
      previousVideoIdRef.current = video?.id ?? null;
    }
  }, [video?.id]);

  if (isMobile) {
    // When pinned (`minimized = true`) we swap the modal sheet for a small
    // strip docked above the bottom mobile nav so the user can keep
    // working on the artboard while the video plays. Tapping restore in
    // the strip reopens the full sheet.
    if (video && minimized) {
      return (
        <MobilePinnedCard
          video={video}
          showTranscript={showTranscript}
          onToggleTranscript={() => setShowTranscript(v => !v)}
        />
      );
    }
    // When the user opens the transcript drawer the sheet needs more
    // vertical room than the auto-sized default — otherwise the
    // transcript renders in the small leftover space below the player and
    // is hard to read. Switch to `'full'` while the transcript is open
    // (across both mobile and desktop responsive breakpoints) so the
    // sheet takes the full screen height. Closing the transcript flips
    // back to the responsive `['auto', 'full']` so the sheet snaps back
    // to its content-hugging height.
    const sheetHeight = showTranscript ? 'full' : (['auto', 'full'] as const);

    return (
      <Sheet
        open={Boolean(video)}
        onRequestClose={closeDesignSchoolVideo}
        height={sheetHeight}
        title={video?.title}
        headerAlignment="start"
        headerDivider="when-scrolled"
        ariaLabel={video?.title ?? 'Design School video'}
        // Custom `headerEnd` keeps the close button (Easel only adds it
        // automatically when `headerEnd` is unset) and adds the pin-down
        // affordance next to it. Two `CircleButton`s in a fragment is the
        // pattern Easel docs recommend for multi-action header ends.
        headerEnd={
          <>
            <CircleButton
              variant="tertiary"
              icon={CopyIcon}
              ariaLabel="Pin video below artboard"
              tooltipLabel="Pin below artboard"
              size="small"
              onClick={() => setDesignSchoolVideoMinimized(true)}
            />
            <CircleButton
              variant="tertiary"
              icon={XIcon}
              ariaLabel="Close video"
              tooltipLabel="Close"
              size="small"
              onClick={closeDesignSchoolVideo}
            />
          </>
        }
      >
        {video && (
          <Box paddingX="2u" paddingBottom="2u">
            <MobileVideoBody
              video={video}
              showTranscript={showTranscript}
              onToggleTranscript={() => setShowTranscript(v => !v)}
              iframeId={SHEET_IFRAME_ID}
            />
          </Box>
        )}
      </Sheet>
    );
  }

  if (!video) return null;

  if (minimized) {
    return <MiniPlayer video={video} />;
  }

  const isHorizontal = side === 'top' || side === 'bottom';
  const slotClass = isHorizontal ? styles.panelHorizontal : styles.panelVertical;

  // Vertical (left/right) docks support drag-to-resize via a handle on the
  // inner edge of the slot. The handle for a right-docked panel sits on the
  // slot's LEFT edge (so dragging away from the screen edge widens it), and
  // vice versa for a left-docked panel. Width drives the layout: video
  // scales at 16:9, card chrome resizes naturally with it.
  const customWidth = designSchoolVideoPanelWidth.value;
  const slotCustomProperties =
    !isHorizontal && customWidth !== null ? { '--ds-panel-width': `${customWidth}px` } : undefined;
  const resizeHandleEdge: 'left' | 'right' | null = isHorizontal
    ? null
    : side === 'right'
      ? 'left'
      : 'right';
  const currentSlotWidth = customWidth ?? DEFAULT_PANEL_VERTICAL_WIDTH;

  return (
    <>
      <Box className={slotClass} padding="2u" customProperties={slotCustomProperties}>
        {resizeHandleEdge !== null && (
          <ResizeHandle edge={resizeHandleEdge} currentWidth={currentSlotWidth} />
        )}
        {/*
         * In horizontal (top/bottom) mode the slot stretches to the full
         * canvas width, so the 16:9 video would otherwise expand to a giant
         * tile. Wrap the card in a max-width constrainer (raw div: Easel `Box`
         * doesn't expose `max-width`) and `.panelHorizontal` centers it.
         */}
        {isHorizontal ? (
          <div className={styles.panelHorizontalCard}>
            <ExpandedPanelCard
              video={video}
              draggingSide={draggingSide}
              onDragStart={setDraggingSide}
              onDragEnd={() => setDraggingSide(null)}
              showTranscript={showTranscript}
              onToggleTranscript={() => setShowTranscript(v => !v)}
            />
          </div>
        ) : (
          <ExpandedPanelCard
            video={video}
            draggingSide={draggingSide}
            onDragStart={setDraggingSide}
            onDragEnd={() => setDraggingSide(null)}
            showTranscript={showTranscript}
            onToggleTranscript={() => setShowTranscript(v => !v)}
          />
        )}
      </Box>

      {draggingSide !== null && <SnapZoneOverlay activeSide={draggingSide} />}
    </>
  );
}

// Default vertical-dock slot width (kept in sync with `.panelVertical`'s
// `--ds-panel-width` fallback in `DesignSchoolVideoPanel.module.css`). Used
// as the starting width for the resize gesture when the user hasn't dragged
// the handle yet.
const DEFAULT_PANEL_VERTICAL_WIDTH = 420;

interface ExpandedPanelCardProps {
  video: DesignSchoolVideoData;
  draggingSide: DesignSchoolVideoPanelSide | null;
  onDragStart: (side: DesignSchoolVideoPanelSide) => void;
  onDragEnd: () => void;
  showTranscript: boolean;
  onToggleTranscript: () => void;
}

/**
 * The expanded floating card body. Owns the YouTube IFrame Player API
 * binding (via `useYouTubePlayer`) so the transcript drawer can highlight
 * the active line and seek on click. The hook is always enabled while the
 * expanded panel is mounted; opening / closing the transcript only toggles
 * the drawer's visibility, not the player binding.
 */
function ExpandedPanelCard({
  video,
  draggingSide,
  onDragStart,
  onDragEnd,
  showTranscript,
  onToggleTranscript,
}: ExpandedPanelCardProps): React.ReactNode {
  const hasTranscript = (video.transcript?.length ?? 0) > 0;
  const { currentTime, seekTo } = useYouTubePlayer(EXPANDED_IFRAME_ID, hasTranscript);

  return (
    // Outer card is always a `height="full"` flex column anchored to the
    // slot — so the header stays pinned at the top and the body section
    // below it owns vertical scrolling. The previous architecture only
    // stretched the card when the transcript was open and relied on the
    // transcript drawer flex-growing to fill remaining space; that broke
    // when extra content (e.g. `PracticeActivityCard`) was added between
    // the video and the transcript drawer because the drawer's
    // `flex-grow` competed for room and collapsed to 0 height. Always
    // owning the scroll on a single body container makes adding new
    // sections safe — they just push later content further down the
    // scrollable region.
    <Box
      background="elevationSurfaceFloating"
      shadow="elevationSurfaceFloating"
      borderRadius="containerLarge"
      padding="3u"
      height="full"
      minHeight="0"
      display="flex"
      flexDirection="column"
      gap="2u"
    >
      <Inline align="spaceBetween" alignY="center" spacing="1u">
        <CircleButton
          variant="tertiary"
          icon={ArrowLeftIcon}
          ariaLabel="Back to suggestions"
          tooltipLabel="Back"
          size="small"
          onClick={closeDesignSchoolVideo}
        />
        <Inline spacing="0.5u" alignY="center">
          <DragHandleButton
            isDragging={draggingSide !== null}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
          <CircleButton
            variant="tertiary"
            icon={MinimizeIcon}
            ariaLabel="Minimize video"
            tooltipLabel="Minimize"
            size="small"
            onClick={toggleDesignSchoolVideoMinimized}
          />
        </Inline>
      </Inline>

      {/*
       * Single scrollable body. Header sits above and stays pinned;
       * everything else (title, description, video, practice card,
       * transcript toggle, transcript drawer) flows vertically in here
       * and scrolls together when the combined content height exceeds
       * the slot. Easel `Box` doesn't expose `overflow` so the scroll
       * treatment is a documented escape hatch in
       * `DesignSchoolVideoPanel.module.css` (`.scrollableBody`).
       */}
      <Box flex="auto" minHeight="0" className={styles.scrollableBody}>
        <Rows spacing="2u">
          <Title size="small" lineClamp={2}>
            {video.title}
          </Title>

          {/*
            Sticky wrapper pins the player to the top of `.scrollableBody`
            once the user scrolls past the title — so when they read the
            transcript (which can be much longer than the slot), the
            video stays in view and they can keep watching alongside.
            The escape-hatch class lives in
            `DesignSchoolVideoPanel.module.css` (Easel `Box` doesn't
            expose `position: sticky`).
          */}
          <div className={styles.stickyVideo}>
            <DesignSchoolVideoBody video={video} variant="panel" iframeId={EXPANDED_IFRAME_ID} />
          </div>

          {/*
            "Practice your skills" card — a follow-up activity surfaced
            after the video so the user can move from "watch a lesson"
            to "do something". Currently always points at the Brand Kit
            activity (the only Activity in the prototype catalog); pass
            a different `activity` prop here when more activities exist.
          */}
          <PracticeActivityCard />

          {hasTranscript && (
            <Inline align="start" alignY="center" spacing="1u">
              <Button
                variant="tertiary"
                icon={SubtitleIcon}
                onClick={onToggleTranscript}
                active={showTranscript}
              >
                {showTranscript ? 'Hide transcript' : 'Show transcript'}
              </Button>
            </Inline>
          )}

          {hasTranscript && showTranscript && video.transcript && (
            // `mode="flow"` because the parent body Box owns the scroll
            // — the transcript renders at its intrinsic content height
            // and the user scrolls through it within the surrounding
            // `.scrollableBody`. The previous `mode="fill"` used the
            // transcript's own internal scroll, which only worked when
            // the transcript wrapper was guaranteed flex-grow space —
            // a contract that broke as soon as more siblings were
            // added between the video and the toggle.
            <Transcript
              lines={video.transcript}
              currentTime={currentTime}
              onSeek={seekTo}
              mode="flow"
            />
          )}
        </Rows>
      </Box>
    </Box>
  );
}

interface DesignSchoolVideoBodyProps {
  video: DesignSchoolVideoData;
  /**
   * Reserved for future surfaces that need a different chrome around
   * the iframe. Currently every caller (`ExpandedPanelCard`,
   * `MobileVideoBody`) renders the bare 16:9 player, so the function
   * returns it directly and ignores the prop. Kept so consumers don't
   * have to migrate when a non-panel surface is added.
   */
  variant: 'panel';
  // When provided, the iframe is given this DOM id and `enablejsapi=1` is
  // appended to the embed URL so `useYouTubePlayer` can attach to it.
  iframeId?: string;
}

function DesignSchoolVideoBody({ video, iframeId }: DesignSchoolVideoBodyProps): React.ReactNode {
  const src = useMemo(
    () => (iframeId ? withJsApiEnabled(video.embedUrl) : video.embedUrl),
    [iframeId, video.embedUrl],
  );

  return (
    <Thumbnail aspectRatio={16 / 9} border="none" borderRadius="element">
      <iframe
        id={iframeId}
        src={src}
        title={video.title}
        className={styles.videoIframe}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </Thumbnail>
  );
}

interface MobileVideoBodyProps {
  video: DesignSchoolVideoData;
  showTranscript: boolean;
  onToggleTranscript: () => void;
  /**
   * Iframe id to bind to the YouTube IFrame Player API. The mobile sheet
   * uses `SHEET_IFRAME_ID`, the pinned card uses `MOBILE_PINNED_IFRAME_ID`
   * — they must differ so the hook doesn't try to re-bind across surfaces
   * if a fast pin/unpin transition happens.
   */
  iframeId: string;
}

/**
 * Shared mobile body for the Design School video panel. Used by both the
 * bottom-sheet variant and the pinned-card variant (below the artboard).
 * Mirrors the desktop expanded card's transcript affordance: description +
 * 16:9 player + a `Show transcript` / `Hide transcript` toggle that reveals
 * an inline `Transcript` drawer below the player.
 *
 * `iframeId` is parameterised so the same body markup can drive a separate
 * YouTube player instance per surface.
 */
function MobileVideoBody({
  video,
  showTranscript,
  onToggleTranscript,
  iframeId,
}: MobileVideoBodyProps): React.ReactNode {
  const hasTranscript = (video.transcript?.length ?? 0) > 0;
  const { currentTime, seekTo } = useYouTubePlayer(iframeId, hasTranscript);

  return (
    <Rows spacing="2u">
      {/*
        Sticky wrapper pins the player to the top of the surrounding
        scroll container — the Sheet's content area on mobile, or the
        pinned card's `.mobilePinnedCardBody` when the user has pinned
        the video below the artboard. Keeps the video in view while
        the user reads the transcript. Same escape-hatch class as the
        desktop variant; Easel `Box` doesn't expose `position: sticky`.
      */}
      <div className={styles.stickyVideo}>
        <DesignSchoolVideoBody video={video} variant="panel" iframeId={iframeId} />
      </div>

      {/*
        "Practice your skills" card — same follow-up activity affordance
        as the desktop expanded panel, surfaced here for the mobile
        Sheet + pinned-card surfaces.
      */}
      <PracticeActivityCard />

      {hasTranscript && (
        <Inline align="start" alignY="center" spacing="1u">
          <Button
            variant="tertiary"
            icon={SubtitleIcon}
            onClick={onToggleTranscript}
            active={showTranscript}
          >
            {showTranscript ? 'Hide transcript' : 'Show transcript'}
          </Button>
        </Inline>
      )}

      {hasTranscript && showTranscript && video.transcript && (
        <Transcript
          lines={video.transcript}
          currentTime={currentTime}
          onSeek={seekTo}
          // Mobile parents (Sheet body, pinned slot) own the scroll
          // container; the transcript itself flows at content height so it
          // doesn't collapse inside an unconstrained Rows.
          mode="flow"
        />
      )}
    </Rows>
  );
}

/**
 * Append `enablejsapi=1` (and a matching `origin`) to a YouTube embed URL
 * so the YouTube IFrame Player API can drive the player. Returns the
 * original URL unchanged if it isn't parseable as a URL.
 */
function withJsApiEnabled(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('enablejsapi', '1');
    if (typeof window !== 'undefined') {
      parsed.searchParams.set('origin', window.location.origin);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

interface DragHandleButtonProps {
  isDragging: boolean;
  onDragStart: (initialSide: DesignSchoolVideoPanelSide) => void;
  onDragEnd: () => void;
}

/**
 * The move icon in the panel header. On mousedown it starts a global drag
 * gesture, watches mouse position to compute the nearest edge of the viewport,
 * publishes that side to the snap-zone overlay (via the parent's `draggingSide`
 * state) and on mouseup commits the chosen side to the panel-side signal.
 */
function DragHandleButton({
  isDragging,
  onDragStart,
  onDragEnd,
}: DragHandleButtonProps): React.ReactNode {
  const draggingRef = useRef(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      draggingRef.current = true;
      const initialSide = computeNearestSide(event.clientX, event.clientY);
      onDragStart(initialSide);

      const handleMove = (moveEvent: MouseEvent) => {
        if (!draggingRef.current) return;
        const nextSide = computeNearestSide(moveEvent.clientX, moveEvent.clientY);
        onDragStart(nextSide);
      };

      const handleUp = (upEvent: MouseEvent) => {
        if (!draggingRef.current) return;
        const finalSide = computeNearestSide(upEvent.clientX, upEvent.clientY);
        setDesignSchoolVideoPanelSide(finalSide);
        draggingRef.current = false;
        onDragEnd();
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [onDragStart, onDragEnd],
  );

  // Stop the listeners if the component unmounts mid-drag (e.g. video closed).
  useEffect(() => {
    return () => {
      draggingRef.current = false;
    };
  }, []);

  return (
    <CircleButton
      variant="tertiary"
      icon={ArrowMultiDirectionalIcon}
      ariaLabel="Move panel"
      tooltipLabel={isDragging ? 'Drop to dock' : 'Drag to dock to an edge'}
      size="small"
      onMouseDown={handleMouseDown}
    />
  );
}

interface ResizeHandleProps {
  // Which edge of the slot the handle attaches to. For a right-docked panel
  // the handle is on the LEFT edge (drag away from screen edge widens it);
  // for a left-docked panel it's on the RIGHT edge.
  edge: 'left' | 'right';
  // Width of the slot at the moment this render fired. Used as the baseline
  // for the next drag gesture so we don't accumulate floating-point error.
  currentWidth: number;
}

/**
 * Drag handle on the inner edge of the vertical-docked panel slot. Pointer-
 * down begins a horizontal drag gesture; pointer-move updates
 * `designSchoolVideoPanelWidth` (clamped to min/max in the setter); pointer-
 * up ends it. The store re-renders the slot with the new width via the
 * `--ds-panel-width` CSS custom property, and the inner card scales
 * naturally — the 16:9 video stays at 16:9, so the panel's aspect ratio is
 * effectively locked to the video's.
 *
 * Aspect ratio is NOT enforced via 2D scaling because the slot's height is
 * driven by the editor layout (`height: 100%`), not by us — height-locking
 * would either fight the layout or force the panel to overflow the
 * available area. Width-only resize keeps the layout calm while still
 * letting the user grow the player.
 */
function ResizeHandle({ edge, currentWidth }: ResizeHandleProps): React.ReactNode {
  const [isDragging, setIsDragging] = useState(false);
  const draggingRef = useRef(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = currentWidth;
      // Right-docked panel handle on the LEFT edge: dragging the cursor LEFT
      // (negative deltaX) should widen the panel, so the direction is -1.
      // Left-docked panel handle on the RIGHT edge: dragging RIGHT widens.
      const direction = edge === 'left' ? -1 : 1;

      draggingRef.current = true;
      setIsDragging(true);
      // Hint to the rest of the page that a horizontal-resize gesture is in
      // progress so the cursor stays consistent and selection doesn't fight
      // the drag.
      const previousCursor = document.body.style.cursor;
      const previousUserSelect = document.body.style.userSelect;
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';

      const handleMove = (moveEvent: MouseEvent) => {
        if (!draggingRef.current) return;
        const deltaX = moveEvent.clientX - startX;
        const nextWidth = startWidth + deltaX * direction;
        setDesignSchoolVideoPanelWidth(nextWidth);
      };

      const handleUp = () => {
        if (!draggingRef.current) return;
        draggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = previousCursor;
        document.body.style.userSelect = previousUserSelect;
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
    },
    [edge, currentWidth],
  );

  // Stop the listeners if the component unmounts mid-drag.
  useEffect(() => {
    return () => {
      draggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div
      className={`${styles.resizeHandle} ${styles[`resizeHandle--${edge}`]} ${
        isDragging ? styles.resizeHandleActive : ''
      }`}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize panel"
      aria-valuemin={DESIGN_SCHOOL_VIDEO_PANEL_MIN_WIDTH}
      aria-valuemax={DESIGN_SCHOOL_VIDEO_PANEL_MAX_WIDTH}
      aria-valuenow={Math.round(currentWidth)}
    >
      <div className={styles.resizeHandleGrip} />
    </div>
  );
}

interface SnapZoneOverlayProps {
  activeSide: DesignSchoolVideoPanelSide;
}

/**
 * Full-viewport overlay rendered while the user is dragging the panel handle.
 * Shows four dashed snap zones (one per edge); the one nearest to the cursor
 * is highlighted. Portaled to #root so it sits above the editor chrome.
 */
function SnapZoneOverlay({ activeSide }: SnapZoneOverlayProps): React.ReactNode {
  return ReactDOM.createPortal(
    <div className={styles.snapOverlay}>
      {(['left', 'right', 'top', 'bottom'] as const).map(side => (
        <div
          key={side}
          className={`${styles.snapZone} ${styles[`snapZone--${side}`]} ${activeSide === side ? styles.snapZoneActive : ''}`}
        />
      ))}
    </div>,
    getPortalTarget(),
  );
}

/**
 * Pick the viewport edge closest to the given pointer coordinates.
 *
 * We compare the pointer's distance to each viewport edge and return the
 * smallest. This biases toward whichever side the user is nearest, which
 * matches drag-to-dock UX in tools like VS Code and Figma.
 */
function computeNearestSide(clientX: number, clientY: number): DesignSchoolVideoPanelSide {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const distances: Record<DesignSchoolVideoPanelSide, number> = {
    left: clientX,
    right: width - clientX,
    top: clientY,
    bottom: height - clientY,
  };
  let nearest: DesignSchoolVideoPanelSide = 'right';
  let nearestDistance = Infinity;
  for (const side of ['left', 'right', 'top', 'bottom'] as const) {
    if (distances[side] < nearestDistance) {
      nearestDistance = distances[side];
      nearest = side;
    }
  }
  return nearest;
}

interface MiniPlayerProps {
  video: DesignSchoolVideoData;
}

/**
 * Minimized picture-in-picture mini-player. Renders as a fixed-position card
 * via a portal so it floats freely above the editor chrome (artboard, panels,
 * footer, etc.) and survives layout changes.
 *
 * Layout is a horizontal stack: 16:9 video on the left, title + series + a
 * row of restore / close circle buttons on the right.
 *
 * Drag: mousedown anywhere on the card (outside the buttons) starts a drag
 * gesture that updates `designSchoolVideoMinimizedPosition` in real time.
 * Buttons stop event propagation so clicking them never starts a drag.
 */
function MiniPlayer({ video }: MiniPlayerProps): React.ReactNode {
  const dragStateRef = useRef<{
    pointerOffsetX: number;
    pointerOffsetY: number;
  } | null>(null);

  // Initialize position to bottom-right with safe margins on first mount when
  // the user hasn't dragged yet. Doing this after mount (not via signal init)
  // avoids referencing `window` during SSR / module evaluation.
  useEffect(() => {
    if (designSchoolVideoMinimizedPosition.value !== null) return;
    const margin = 16;
    const width = MINI_PLAYER_WIDTH;
    const height = MINI_PLAYER_ESTIMATED_HEIGHT;
    setDesignSchoolVideoMinimizedPosition({
      x: window.innerWidth - width - margin,
      y: window.innerHeight - height - margin,
    });
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    // Don't hijack clicks on buttons — let them fire normally.
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;

    event.preventDefault();
    const startX = event.clientX;
    const startY = event.clientY;
    const startPosition = designSchoolVideoMinimizedPosition.value ?? { x: startX, y: startY };
    dragStateRef.current = {
      pointerOffsetX: startX - startPosition.x,
      pointerOffsetY: startY - startPosition.y,
    };

    const handleMove = (moveEvent: MouseEvent) => {
      if (!dragStateRef.current) return;
      const nextX = clamp(
        moveEvent.clientX - dragStateRef.current.pointerOffsetX,
        8,
        window.innerWidth - MINI_PLAYER_WIDTH - 8,
      );
      const nextY = clamp(
        moveEvent.clientY - dragStateRef.current.pointerOffsetY,
        8,
        window.innerHeight - MINI_PLAYER_ESTIMATED_HEIGHT - 8,
      );
      setDesignSchoolVideoMinimizedPosition({ x: nextX, y: nextY });
    };

    const handleUp = () => {
      dragStateRef.current = null;
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, []);

  const position = designSchoolVideoMinimizedPosition.value;
  // Until the post-mount effect computes a starting position, render
  // off-screen to avoid a one-frame flash at (0, 0). We feed coordinates via
  // CSS custom properties (the documented escape hatch for `style` props) so
  // we don't trip `easel/no-inline-styles`.
  const positionStyle = {
    '--mini-player-top': `${position?.y ?? -9999}px`,
    '--mini-player-left': `${position?.x ?? -9999}px`,
  } as React.CSSProperties;

  return ReactDOM.createPortal(
    <div
      className={styles.miniPlayer}
      style={positionStyle}
      onMouseDown={handleMouseDown}
      role="dialog"
      aria-label={`${video.title} (minimized)`}
    >
      <div className={styles.miniPlayerVideo}>
        <Thumbnail aspectRatio={16 / 9} border="none" borderRadius="element">
          <iframe
            src={video.embedUrl}
            title={video.title}
            className={styles.videoIframe}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </Thumbnail>
      </div>

      <div className={styles.miniPlayerInfo}>
        <Rows spacing="0.5u">
          <Title size="xsmall" lineClamp={2}>
            {video.title}
          </Title>
          {video.series && (
            <Text size="xsmall" tone="secondary" lineClamp={1}>
              {video.series}
            </Text>
          )}
          <Inline spacing="0.5u" alignY="center">
            <CircleButton
              variant="tertiary"
              icon={MaximizeIcon}
              ariaLabel="Restore video"
              tooltipLabel="Restore"
              size="small"
              onClick={toggleDesignSchoolVideoMinimized}
            />
            <CircleButton
              variant="tertiary"
              icon={XIcon}
              ariaLabel="Close video"
              tooltipLabel="Close"
              size="small"
              onClick={closeDesignSchoolVideo}
            />
          </Inline>
        </Rows>
      </div>
    </div>,
    getPortalTarget(),
  );
}

const MINI_PLAYER_WIDTH = 380;
const MINI_PLAYER_ESTIMATED_HEIGHT = 140;

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

interface MobilePinnedCardProps {
  video: DesignSchoolVideoData;
  showTranscript: boolean;
  onToggleTranscript: () => void;
}

/**
 * Mobile pinned card shown when the user has pinned the video below the
 * artboard. Renders as an *inline* card (not a fixed-position floater) by
 * portaling into the `#design-school-mobile-pinned-slot` Box that lives in
 * the editor's flex column between the canvas area and the bottom
 * nav/toolbar — so the card sits directly below the artboard, like an
 * embedded panel.
 *
 * Layout matches the user's reference design:
 *   ┌──────────────────────────────────────────┐
 *   │ Title (small, bold)        [Copy] [X]    │   ← header row
 *   │                                          │
 *   │ Description (secondary tone)             │
 *   │ ┌────── 16:9 video ──────┐               │
 *   │ │                        │               │
 *   │ └────────────────────────┘               │
 *   │ ▸ Show transcript                        │
 *   └──────────────────────────────────────────┘
 *
 * Body content (description, video, transcript toggle, transcript drawer)
 * is shared with the bottom-sheet variant via `MobileVideoBody`, just bound
 * to its own iframe id so the YouTube IFrame Player API doesn't collide
 * across surfaces. Transcript open/closed state and search query are owned
 * by the parent panel, so they persist across pin / unpin transitions.
 *
 * Tapping the pin icon restores the full Sheet (toggles minimized off);
 * the close button dismisses the video entirely. Portal target is looked
 * up at render time — if the slot isn't in the DOM yet (rare; happens
 * during fast layout transitions) we poll until it appears rather than
 * dropping the card.
 */
function MobilePinnedCard({
  video,
  showTranscript,
  onToggleTranscript,
}: MobilePinnedCardProps): React.ReactNode {
  // The mobile-only "compact" toggle picks between two layouts inside the
  // same pinned slot:
  //   • compact = false → full content card (header + description + 16:9
  //                       video + transcript drawer). Same content as the
  //                       sheet, just embedded below the artboard.
  //   • compact = true  → horizontal strip (16:9 video on the left, title
  //                       + restore + close on the right). Mirrors the
  //                       desktop `MiniPlayer` pattern.
  // Restore (maximize) flips back to the full card; the user previously
  // navigated sheet → full card via the pin button on the sheet header,
  // so the full card stays the natural "expanded" state on mobile.
  const compact = designSchoolVideoMobileCompact.value;
  const collapseToCompact = useCallback(() => {
    setDesignSchoolVideoMobileCompact(true);
  }, []);
  const expandToFullCard = useCallback(() => {
    setDesignSchoolVideoMobileCompact(false);
  }, []);

  const [slot, setSlot] = useState<HTMLElement | null>(() =>
    typeof document !== 'undefined'
      ? document.getElementById(DESIGN_SCHOOL_MOBILE_PINNED_SLOT_ID)
      : null,
  );
  useEffect(() => {
    if (slot) return;
    const id = window.setInterval(() => {
      const el = document.getElementById(DESIGN_SCHOOL_MOBILE_PINNED_SLOT_ID);
      if (el) {
        setSlot(el);
        window.clearInterval(id);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [slot]);

  // Tag the slot with `data-pinned-mode` so its CSS can switch between
  // "full card" (flex-grow into all remaining space below the artboard so
  // the card anchors to the bottom of the screen) and "compact strip"
  // (hug content; the strip is small and shouldn't take half the screen).
  // Cleaned up on unmount so the slot collapses back to zero height when
  // the card closes.
  useEffect(() => {
    if (!slot) return;
    slot.dataset.pinnedMode = compact ? 'compact' : 'full';
    return () => {
      delete slot.dataset.pinnedMode;
    };
  }, [slot, compact]);

  if (!slot) return null;

  // Compact (mini-strip) variant — see `MobilePinnedCompactStrip` for the
  // layout. Identical chrome (outer wrapper, surface tokens, portal
  // target) as the full card so transitions feel like a single component
  // changing shape.
  if (compact) {
    return ReactDOM.createPortal(
      <Box paddingX="1.5u" paddingY="1u">
        <MobilePinnedCompactStrip video={video} onRestore={expandToFullCard} />
      </Box>,
      slot,
    );
  }

  return ReactDOM.createPortal(
    // Outer Box provides the breathing room around the card (matches the
    // visual reference: card sits with margin around it beneath the
    // artboard). `height='full'` so the card stretches into the full
    // pinned slot — the slot itself flexes to fill all remaining vertical
    // space below the canvas (see `.designSchoolMobilePinnedSlot
    // [data-pinned-mode='full']` in `Editor.module.css`), so the white
    // card surface inside reaches the bottom of the screen rather than
    // floating mid-screen.
    <Box paddingX="1.5u" paddingY="1u" height="full">
      <Box
        background="elevationSurfaceFloating"
        shadow="elevationSurfaceFloating"
        borderRadius="containerLarge"
        padding="2u"
        display="flex"
        flexDirection="column"
        gap="1.5u"
        height="full"
        minHeight="0"
      >
        {/*
         * Header row: title takes flexible width on the left, action
         * buttons (collapse + close) sit on the right. `Inline
         * align="spaceBetween"` gives the title-left / actions-right
         * split; wrapping the title in a `Box flex="auto" minWidth="0"`
         * lets `lineClamp` actually truncate instead of forcing the row
         * to grow. The collapse button uses `MinimizeIcon` (mirrors the
         * desktop expanded panel) and shrinks the card to the compact
         * strip variant rather than reopening the sheet.
         */}
        <Inline align="spaceBetween" alignY="center" spacing="1u">
          <Box flex="auto" minWidth="0">
            <Title size="xsmall" lineClamp={2}>
              {video.title}
            </Title>
          </Box>
          <Inline spacing="0.5u" alignY="center">
            <CircleButton
              variant="tertiary"
              icon={MinimizeIcon}
              ariaLabel="Minimize video"
              tooltipLabel="Minimize"
              size="small"
              onClick={collapseToCompact}
            />
            <CircleButton
              variant="tertiary"
              icon={XIcon}
              ariaLabel="Close video"
              tooltipLabel="Close"
              size="small"
              onClick={closeDesignSchoolVideo}
            />
          </Inline>
        </Inline>

        {/*
         * Body wrapper takes the remaining vertical space inside the
         * card chrome and owns the scroll. When the user opens the
         * transcript and the content grows past the card height, this
         * is what scrolls — keeping the header (title + close
         * affordances) anchored at the top. Easel `Box` doesn't expose
         * `overflow`, so the scroll treatment lives in the panel's CSS
         * module as a documented escape hatch.
         */}
        <Box flex="auto" minHeight="0" className={styles.mobilePinnedCardBody}>
          <MobileVideoBody
            video={video}
            showTranscript={showTranscript}
            onToggleTranscript={onToggleTranscript}
            iframeId={MOBILE_PINNED_IFRAME_ID}
          />
        </Box>
      </Box>
    </Box>,
    slot,
  );
}

interface MobilePinnedCompactStripProps {
  video: DesignSchoolVideoData;
  onRestore: () => void;
}

/**
 * Compact "mini-player" variant of the mobile pinned card. Mirrors the
 * desktop `MiniPlayer` layout — 16:9 thumbnail on the left, title +
 * restore/close circle buttons on the right — but rendered inline in the
 * mobile pinned slot rather than as a draggable floating element. Tapping
 * the maximize button expands back to the full pinned card.
 *
 * The thumbnail width is fixed (40% of the available row) so the title
 * always has at least enough room for two clamped lines, even on the
 * narrowest mobile widths in the prototype's responsive range.
 */
function MobilePinnedCompactStrip({
  video,
  onRestore,
}: MobilePinnedCompactStripProps): React.ReactNode {
  return (
    <Box
      background="elevationSurfaceFloating"
      shadow="elevationSurfaceFloating"
      borderRadius="containerLarge"
      padding="1.5u"
    >
      <Inline spacing="1.5u" alignY="center">
        {/*
         * Fixed-width video column. Easel `Box` only exposes `width="unset" | "full"`,
         * so the column width is anchored via a CSS module class — see the
         * `.mobileCompactStripVideo` rule in `DesignSchoolVideoPanel.module.css`.
         * Mirrors the desktop `.miniPlayerVideo` pattern.
         */}
        <div className={styles.mobileCompactStripVideo}>
          <Thumbnail aspectRatio={16 / 9} border="none" borderRadius="element">
            <iframe
              id={MOBILE_PINNED_IFRAME_ID}
              src={video.embedUrl}
              title={video.title}
              className={styles.videoIframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </Thumbnail>
        </div>
        <Box flex="auto" minWidth="0">
          <Rows spacing="0.5u">
            <Title size="xsmall" lineClamp={2}>
              {video.title}
            </Title>
            <Inline spacing="0.5u" alignY="center">
              <CircleButton
                variant="tertiary"
                icon={MaximizeIcon}
                ariaLabel="Restore video"
                tooltipLabel="Restore"
                size="small"
                onClick={onRestore}
              />
              <CircleButton
                variant="tertiary"
                icon={XIcon}
                ariaLabel="Close video"
                tooltipLabel="Close"
                size="small"
                onClick={closeDesignSchoolVideo}
              />
            </Inline>
          </Rows>
        </Box>
      </Inline>
    </Box>
  );
}
