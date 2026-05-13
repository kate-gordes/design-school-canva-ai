/**
 * Design School "X-ray" hotspot catalog.
 *
 * When the user holds Shift (desktop) or press-and-holds the 🎓 button
 * (mobile), the editor dims and these hotspots light up across the
 * interface. Each hotspot is colour-coded by category, and clicking one
 * opens the pinned Design School video player (`DesignSchoolVideoPanel`)
 * with a learning resource for that part of the editor.
 *
 * Positions are absolute viewport coordinates relative to the editor
 * container — the `XrayOverlay` is a `position: fixed; inset: 0` overlay,
 * so each hotspot's `position` value is a CSS-positioning object applied
 * directly. We deliberately use raw coordinates rather than DOM lookups
 * for two reasons:
 *
 *   1. Speed — no need to ref every editor region for a feature that's
 *      shown for a fraction of a second while the user holds Shift.
 *   2. Predictability — designers can iterate on placement here without
 *      threading refs through the whole editor tree.
 *
 * If editor chrome moves significantly, update `position` / `mobilePosition`
 * here. Hotspots whose anchor isn't visible on a given doctype are simply
 * off-screen and harmless.
 */

import { LOGO_DESIGN_LESSONS } from '@/data/designSchoolCatalog';

/** Top-level grouping for hotspots — drives colour, label, and emoji. */
export type XrayCategoryId =
  | 'aiTools'
  | 'typography'
  | 'photoEditing'
  | 'brand'
  | 'elements'
  | 'templates'
  | 'layout';

export type XrayCategory = {
  id: XrayCategoryId;
  label: string;
  /**
   * Solid hex used for the hotspot dot, glow, and tooltip accent.
   * Picked from the editor's existing palette wherever possible
   * (e.g. AI Tools = the same purple as `BrandedShimmeringText`'s gradient).
   */
  color: string;
  emoji: string;
};

export const XRAY_CATEGORIES: Record<XrayCategoryId, XrayCategory> = {
  aiTools: {
    id: 'aiTools',
    label: 'AI Tools',
    color: '#7d2ae8',
    emoji: '✨',
  },
  typography: {
    id: 'typography',
    label: 'Typography',
    color: '#ff6b6b',
    emoji: '🔤',
  },
  photoEditing: {
    id: 'photoEditing',
    label: 'Photo Editing',
    color: '#00c4cc',
    emoji: '📸',
  },
  brand: {
    id: 'brand',
    label: 'Brand',
    color: '#ec4899',
    emoji: '🎨',
  },
  elements: {
    id: 'elements',
    label: 'Elements',
    color: '#6bcb77',
    emoji: '🧩',
  },
  templates: {
    id: 'templates',
    label: 'Templates',
    color: '#ffa500',
    emoji: '📐',
  },
  layout: {
    id: 'layout',
    label: 'Layout',
    color: '#4d96ff',
    emoji: '🪟',
  },
};

/**
 * CSS-positioning props applied directly to the hotspot's wrapper.
 * Combine any of `top`/`right`/`bottom`/`left` (numbers = px, strings =
 * percentages or expressions). Anchors are absolute relative to the
 * `position: fixed` overlay (i.e. the viewport).
 */
export type HotspotPosition = {
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
};

/**
 * Where the hover tooltip should sit relative to the hotspot dot.
 * `top` is the default; pick `right` for hotspots near the left edge,
 * `left` for hotspots near the right edge, and `bottom` for hotspots
 * near the top edge — picking the side with the most viewport room
 * prevents the tooltip from being clipped off-screen.
 */
export type HotspotTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type XrayHotspot = {
  id: string;
  category: XrayCategoryId;
  /** Short heading shown on the tooltip / mobile sheet. */
  title: string;
  /** One-line subtitle explaining what the user can learn. */
  description: string;
  /** Position on desktop layouts. */
  position: HotspotPosition;
  /**
   * Override for mobile editor (smaller viewport, different chrome).
   * If omitted the hotspot is hidden on mobile.
   */
  mobilePosition?: HotspotPosition;
  /**
   * Where the tooltip docks relative to the dot. Defaults to `top`.
   * Same value applies on desktop and mobile; if a single hotspot needs
   * different placements per surface in future, split this into
   * `tooltipPlacement` / `mobileTooltipPlacement`.
   */
  tooltipPlacement?: HotspotTooltipPlacement;
  /** Catalog `LearningItem.id` to open when the hotspot is clicked. */
  videoId: string;
};

/**
 * The single Design School video the prototype currently ships with —
 * every hotspot opens this video for the demo, but each hotspot's own
 * title / description is what the user sees on the X-ray surface, so
 * the experience still reads as category-specific.
 */
const DEFAULT_VIDEO_ID = 'logo-design-in-3-minutes';

export const XRAY_HOTSPOTS: XrayHotspot[] = [
  // 1. AI Tools — Magic Studio in the top toolbar.
  // Tooltip drops *below* the dot so it doesn't get clipped against the
  // top of the viewport (the dot itself sits ~96px from the top).
  {
    id: 'toolbar-magic',
    category: 'aiTools',
    title: 'Magic Studio',
    description: 'Generate, edit and animate with AI from the top toolbar.',
    position: { top: 96, left: '50%' },
    mobilePosition: { top: 24, left: '50%' },
    tooltipPlacement: 'bottom',
    videoId: DEFAULT_VIDEO_ID,
  },
  // 2. Brand Kit — left rail (desktop) / bottom carousel (mobile).
  // Tooltip docks to the right of the dot on desktop because the dot
  // sits at left:24 and a centred-above tooltip would slide off the
  // left edge of the viewport. Mobile has the dot in the bottom nav,
  // where above-with-shift works fine.
  {
    id: 'brand-kit',
    category: 'brand',
    title: 'Brand Kit',
    description: 'Apply colours, fonts and logos in one click.',
    position: { top: 408, left: 24 },
    mobilePosition: { bottom: 96, left: 232 },
    tooltipPlacement: 'right',
    videoId: DEFAULT_VIDEO_ID,
  },
  // 3. Composition — centre of the canvas.
  // Default `top` placement — the canvas centre has plenty of room
  // above for a tooltip to sit without clipping anywhere.
  {
    id: 'canvas-composition',
    category: 'layout',
    title: 'Composition',
    description: 'Rule of thirds, alignment, and visual hierarchy in practice.',
    position: { top: '50%', left: '60%' },
    mobilePosition: { top: '40%', left: '50%' },
    videoId: DEFAULT_VIDEO_ID,
  },
];

/**
 * Look up a learning item by id from the catalog. Returns `null` if the
 * id doesn't exist (e.g. a stale hotspot definition); callers should
 * skip opening the video panel in that case.
 */
export function getXrayVideo(videoId: string) {
  return LOGO_DESIGN_LESSONS.find(item => item.id === videoId) ?? null;
}
