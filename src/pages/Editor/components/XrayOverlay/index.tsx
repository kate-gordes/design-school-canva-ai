import React, { useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { BasicButton } from '@canva/easel';
import {
  XRAY_CATEGORIES,
  XRAY_HOTSPOTS,
  getXrayVideo,
  type HotspotPosition,
  type HotspotTooltipPlacement,
  type XrayHotspot,
} from '@/data/xrayHotspots';
import {
  openDesignSchoolVideo,
  setDesignSchoolVideoMinimized,
  setDesignSchoolVideoPanelSide,
} from '@/store/signals/panels';
import { setXrayModeActive, xrayModeActive } from '@/store/signals/xray';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './XrayOverlay.module.css';

/**
 * Pick the right anchor for the current viewport. Mobile gets a separate
 * `mobilePosition` (or no hotspot at all if it's not defined for mobile).
 * Desktop always uses `position`.
 */
function resolvePosition(hotspot: XrayHotspot, isMobile: boolean): HotspotPosition | null {
  if (isMobile) {
    return hotspot.mobilePosition ?? null;
  }
  return hotspot.position;
}

/**
 * Convert a position offset (number or string) into a CSS length string.
 * Numbers become `${n}px`; strings (e.g. `'50%'`, `'calc(...)'`) pass through.
 * `undefined` → `undefined` so the consumer omits it and the CSS rule's
 * `auto` default kicks in.
 */
function asLength(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? `${value}px` : value;
}

/**
 * Build the inline style object for a hotspot wrapper. Contains ONLY CSS
 * custom properties (per Easel's `easel/no-inline-styles` rule, which
 * explicitly allows `style={{ '--token': value }}` as an escape hatch
 * for dynamic values that need to flow into CSS Modules).
 */
function hotspotWrapperStyle(position: HotspotPosition, color: string): React.CSSProperties {
  const style: Record<string, string | undefined> = {
    '--xray-color': color,
    '--xray-top': asLength(position.top),
    '--xray-right': asLength(position.right),
    '--xray-bottom': asLength(position.bottom),
    '--xray-left': asLength(position.left),
  };
  return style as React.CSSProperties;
}

/**
 * Renders the X-ray dim layer + every visible hotspot in a portal at the
 * document root, so it sits above the editor chrome but doesn't have to
 * inherit any of its layout / transform context. Returns `null` when the
 * mode is off.
 *
 * Hotspot click → open the Design School video pinned (mini-player on
 * desktop, pinned card on mobile) and immediately exit X-ray mode so the
 * user can engage with the video without holding Shift.
 *
 * Several Easel "escape hatches" are intentional in this component:
 *
 *   - The backdrop and legend are raw `<div>`s because Easel `<Box>`
 *     doesn't support `position: fixed` with a viewport-anchored inset.
 *   - Each hotspot button is wrapped in a `<div>` whose only inline
 *     style is CSS variables — the explicitly permitted exception in
 *     `easel/no-inline-styles` — so the dynamic per-hotspot position
 *     and tint can flow into the CSS Module's `var(--xray-*)` rules.
 *   - The button itself uses `BasicButton`, Easel's blessed unstyled
 *     button primitive.
 */
export function XrayOverlay(): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();
  const active = xrayModeActive.value;

  // Keyboard escape — pressing Esc while X-ray is on bails out cleanly.
  // Useful when Shift gets "stuck" (e.g. user releases Shift while focus
  // is in another app and the keyup never fires).
  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setXrayModeActive(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  // Toggle a body-level data attribute while X-ray is active. The
  // companion CSS rule in `XrayOverlay.module.css` (`:global(body[...])
  // :global(#root)`) fades the editor chrome via `opacity` — that's
  // cleaner than a dark backdrop overlay because the editor's real
  // colours stay visible (just dimmed) and the hotspots, which are
  // portaled to `document.body` *outside* `#root`, stay at full opacity.
  useEffect(() => {
    if (active) {
      document.body.dataset.xrayActive = 'true';
    } else {
      delete document.body.dataset.xrayActive;
    }
    return () => {
      delete document.body.dataset.xrayActive;
    };
  }, [active]);

  const visibleHotspots = useMemo(
    () =>
      XRAY_HOTSPOTS.map(hotspot => ({
        hotspot,
        position: resolvePosition(hotspot, isMobile),
      })).filter(
        (item): item is { hotspot: XrayHotspot; position: HotspotPosition } =>
          item.position !== null,
      ),
    [isMobile],
  );

  const handleHotspotClick = useCallback((hotspot: XrayHotspot) => {
    const item = getXrayVideo(hotspot.videoId);
    if (!item || !item.videoEmbedUrl) {
      // Stale or non-video catalog entry — bail out without opening
      // anything rather than crashing the panel.
      setXrayModeActive(false);
      return;
    }
    // Dock the panel on the right of the artboard and open it expanded
    // (not minimized into the mini-player) — the X-ray flow is "click and
    // start watching", so giving the user the full panel by default is
    // the right default. We force `minimized=false` explicitly because a
    // previous session might have left it `true`.
    setDesignSchoolVideoPanelSide('right');
    setDesignSchoolVideoMinimized(false);
    openDesignSchoolVideo({
      id: item.id,
      title: hotspot.title,
      embedUrl: item.videoEmbedUrl,
      type: item.type,
      duration: item.duration,
      series: item.series,
      description: hotspot.description,
      transcript: item.transcript,
    });
    setXrayModeActive(false);
  }, []);

  if (!active) return null;

  return ReactDOM.createPortal(
    <>
      <div className={styles.legend} aria-hidden="true">
        <span className={styles.legendBadge}>🎓 Design School X-ray</span>
        <span className={styles.legendHint}>
          {isMobile
            ? 'Tap any hotspot to open a lesson'
            : 'Release Shift to exit · Click any hotspot to open a lesson'}
        </span>
      </div>

      {visibleHotspots.map(({ hotspot, position }) => {
        const category = XRAY_CATEGORIES[hotspot.category];
        const placement: HotspotTooltipPlacement = hotspot.tooltipPlacement ?? 'top';
        // CSS Module classes for placement variants are camelCased to
        // match Easel's `tooltipTop` / `tooltipBottom` / etc. naming.
        const tooltipPlacementClass =
          placement === 'top'
            ? styles.tooltipTop
            : placement === 'bottom'
              ? styles.tooltipBottom
              : placement === 'left'
                ? styles.tooltipLeft
                : styles.tooltipRight;
        return (
          <div
            key={hotspot.id}
            className={styles.hotspotWrapper}
            style={hotspotWrapperStyle(position, category.color)}
          >
            <BasicButton
              className={styles.hotspot}
              onClick={() => handleHotspotClick(hotspot)}
              ariaLabel={`${category.label}: ${hotspot.title}`}
              noChildWrapper
            >
              <span className={styles.dot} aria-hidden="true" />
              <span className={`${styles.tooltip} ${tooltipPlacementClass}`}>
                <span className={styles.tooltipCategory}>
                  {category.emoji} {category.label}
                </span>
                <span className={styles.tooltipTitle}>{hotspot.title}</span>
                <span className={styles.tooltipDescription}>{hotspot.description}</span>
              </span>
            </BasicButton>
          </div>
        );
      })}
    </>,
    document.body,
  );
}
