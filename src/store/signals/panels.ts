import { signal } from '@preact/signals-react';
import type { TranscriptLine } from '@/data/designSchoolCatalog';

/**
 * Design mode types for the Design panel
 */
export type DesignMode = 'instagram' | 'presentation' | 'video' | 'whiteboard';

/**
 * Currently selected design mode
 */
export const designMode = signal<DesignMode>('presentation');

/**
 * Whether the chat view is currently shown
 */
export const showChatView = signal<boolean>(false);

/**
 * Current search query in the active panel
 */
export const searchQuery = signal<string>('');

/**
 * Whether a search is currently in progress
 */
export const isSearching = signal<boolean>(false);

/**
 * Whether image generation is currently in progress
 */
export const isGenerating = signal<boolean>(false);

/**
 * Recently generated element type
 */
export interface GeneratedElement {
  id: string;
  title: string;
  image: string;
  prompt: string;
  createdAt: number;
}

/**
 * Array of recently generated elements
 */
export const recentlyGeneratedElements = signal<GeneratedElement[]>([]);

/**
 * Add a newly generated element to the recent list
 */
export function addGeneratedElement(element: Omit<GeneratedElement, 'createdAt'>) {
  const newElement: GeneratedElement = {
    ...element,
    createdAt: Date.now(),
  };

  // Add to beginning and keep only last 20
  recentlyGeneratedElements.value = [newElement, ...recentlyGeneratedElements.value.slice(0, 19)];
}

/**
 * Clear all recently generated elements
 */
export function clearRecentlyGeneratedElements() {
  recentlyGeneratedElements.value = [];
}

/**
 * Elements panel generation state - persists across panel navigation
 */
export interface ElementsGenerationState {
  showResults: boolean;
  prompt: string;
  images: Array<{ id: string; url: string; prompt: string }>;
}

export const elementsGenerationState = signal<ElementsGenerationState>({
  showResults: false,
  prompt: '',
  images: [],
});

/**
 * Update elements generation state
 */
export function setElementsGenerationState(state: Partial<ElementsGenerationState>) {
  elementsGenerationState.value = {
    ...elementsGenerationState.value,
    ...state,
  };
}

/**
 * Clear elements generation state
 */
export function clearElementsGenerationState() {
  elementsGenerationState.value = {
    showResults: false,
    prompt: '',
    images: [],
  };
}

/**
 * Set the design mode
 */
export function setDesignMode(mode: DesignMode) {
  designMode.value = mode;
}

/**
 * Toggle chat view visibility
 */
export function toggleChatView() {
  showChatView.value = !showChatView.value;
}

/**
 * Set search query
 */
export function setSearchQuery(query: string) {
  searchQuery.value = query;
}

/**
 * Set searching state
 */
export function setIsSearching(searching: boolean) {
  isSearching.value = searching;
}

/**
 * Set generating state
 */
export function setIsGenerating(generating: boolean) {
  isGenerating.value = generating;
}

/**
 * Whether the mobile AI panel is currently open
 */
export const aiPanelOpen = signal<boolean>(false);

/**
 * Set the AI panel open state
 */
export function setAIPanelOpen(open: boolean) {
  aiPanelOpen.value = open;
}

/**
 * A prompt that was typed into a *different* surface (e.g. the
 * `MobileWonderbox` inside `MobilePrimaryNav`'s Canva AI flyout) and needs
 * to be auto-submitted by the mobile chat panel as soon as it mounts /
 * sees the value. The handoff is signal-based because the chat panel only
 * mounts when `aiPanelOpen` flips to `true`, so the wonderbox can't call
 * the panel's submit handler directly.
 *
 * Lifecycle: the producer sets it to a non-empty string and opens the
 * panel; the consumer (`MobileCanvaAIPanel`) reads it in a `useEffect`,
 * fires its submit, and immediately clears it back to `null` so we don't
 * re-submit on every subsequent render.
 */
export const pendingMobileAIPrompt = signal<string | null>(null);

export function setPendingMobileAIPrompt(prompt: string | null) {
  pendingMobileAIPrompt.value = prompt;
}

/**
 * Whether the object panel is docked (visible)
 */
export const objectPanelDocked = signal<boolean>(false);

/**
 * Set the object panel docked state
 */
export function setObjectPanelDocked(docked: boolean) {
  objectPanelDocked.value = docked;
}

/**
 * Whether the mobile AI compact input is focused (keyboard open with selection)
 * When true, other UI elements should hide to maximize canvas space
 */
export const mobileAIInputFocused = signal<boolean>(false);

/**
 * Set the mobile AI input focused state
 */
export function setMobileAIInputFocused(focused: boolean) {
  mobileAIInputFocused.value = focused;
}

/**
 * Mobile AI Edit Mode - full control over the focused editing experience
 * When active, shows only the selected element and input, everything else hidden
 */
export interface MobileAIEditModeState {
  active: boolean;
  elementId: string | null;
  keyboardHeight: number;
  viewportHeight: number;
  // Canvas should zoom to fit element with this padding (in pixels)
  elementPadding: number;
  // Whether the keyboard is currently open (keyboardHeight > threshold)
  keyboardOpen: boolean;
}

export const mobileAIEditMode = signal<MobileAIEditModeState>({
  active: false,
  elementId: null,
  keyboardHeight: 0,
  viewportHeight: typeof window !== 'undefined' ? window.innerHeight : 800,
  elementPadding: 40,
  keyboardOpen: false,
});

/**
 * Enter mobile AI edit mode for a specific element
 */
export function enterMobileAIEditMode(elementId: string) {
  mobileAIEditMode.value = {
    ...mobileAIEditMode.value,
    active: true,
    elementId,
  };
}

/**
 * Exit mobile AI edit mode
 */
export function exitMobileAIEditMode() {
  mobileAIEditMode.value = {
    ...mobileAIEditMode.value,
    active: false,
    elementId: null,
  };
}

/**
 * Update keyboard/viewport dimensions
 * Sets keyboardOpen to true when keyboardHeight > 50px threshold
 */
export function updateMobileAIEditModeDimensions(keyboardHeight: number, viewportHeight: number) {
  const keyboardOpen = keyboardHeight > 50;
  mobileAIEditMode.value = {
    ...mobileAIEditMode.value,
    keyboardHeight,
    viewportHeight,
    keyboardOpen,
  };
}

/**
 * A Design School video opened from a Canva AI suggestion card.
 * When set, the editor renders an inline video panel next to the artboard
 * (see `DesignSchoolVideoPanel`).
 */
export interface DesignSchoolVideoData {
  id: string;
  title: string;
  embedUrl: string;
  type: string;
  duration: string;
  series?: string;
  description?: string;
  transcript?: TranscriptLine[];
}

export const designSchoolVideo = signal<DesignSchoolVideoData | null>(null);

export function openDesignSchoolVideo(video: DesignSchoolVideoData) {
  designSchoolVideo.value = video;
}

export function closeDesignSchoolVideo() {
  designSchoolVideo.value = null;
  // Reset minimized state when the video is fully dismissed so the next
  // video opens in the expanded state (sheet on mobile, full panel on
  // desktop) rather than auto-pinning into the compact mini-player.
  designSchoolVideoMinimized.value = false;
  // Same reasoning for the mobile-only "compact strip" toggle: a freshly
  // opened video should never start in compact form.
  designSchoolVideoMobileCompact.value = false;
}

/**
 * Which side of the artboard the desktop Design School video panel is docked
 * to. Driven by the panel's drag-handle: the user grabs the move icon, drags
 * toward an edge, and on release the panel re-renders into that slot.
 */
export type DesignSchoolVideoPanelSide = 'left' | 'right' | 'top' | 'bottom';

export const designSchoolVideoPanelSide = signal<DesignSchoolVideoPanelSide>('right');

export function setDesignSchoolVideoPanelSide(side: DesignSchoolVideoPanelSide) {
  designSchoolVideoPanelSide.value = side;
}

/**
 * When `true`, the desktop video panel collapses into a small floating
 * mini-player (video + labels + restore/close buttons) that hovers over the
 * artboard and can be dragged anywhere on screen. The full docked panel is
 * unmounted while minimized.
 */
export const designSchoolVideoMinimized = signal<boolean>(false);

export function setDesignSchoolVideoMinimized(value: boolean) {
  designSchoolVideoMinimized.value = value;
}

export function toggleDesignSchoolVideoMinimized() {
  designSchoolVideoMinimized.value = !designSchoolVideoMinimized.value;
}

/**
 * Mobile-only secondary collapse layer. Only meaningful while the user has
 * also pinned the video (`designSchoolVideoMinimized = true`); when both
 * are `true` the pinned card renders as a compact horizontal strip
 * (16:9 thumbnail on the left, title + restore/close buttons on the right)
 * — mirroring the desktop `MiniPlayer` layout. Going back to the full
 * pinned card just flips this back to `false`.
 *
 * Kept separate from `designSchoolVideoMinimized` so the desktop pinned
 * (`MiniPlayer`) state isn't affected and so the mobile sheet → pinned →
 * compact transition is expressible without overloading a single boolean.
 */
export const designSchoolVideoMobileCompact = signal<boolean>(false);

export function setDesignSchoolVideoMobileCompact(value: boolean) {
  designSchoolVideoMobileCompact.value = value;
}

/**
 * Top-left viewport coordinates of the mini-player when the user has dragged
 * it. `null` means "use default position" (bottom-right corner of the
 * viewport with safe margins).
 */
export const designSchoolVideoMinimizedPosition = signal<{ x: number; y: number } | null>(null);

export function setDesignSchoolVideoMinimizedPosition(position: { x: number; y: number } | null) {
  designSchoolVideoMinimizedPosition.value = position;
}

/**
 * User-resized width (in pixels) of the desktop expanded video panel slot
 * when docked left/right. `null` = use the default `.panelVertical` width
 * from CSS (420px). Driven by the resize handle on the inner edge of the
 * panel — see `ResizeHandle` in `DesignSchoolVideoPanel`.
 *
 * Aspect ratio is locked implicitly: the inner video player is rendered via
 * `Thumbnail aspectRatio={16 / 9}` and is the dominant element, so the rest
 * of the card scales naturally with width.
 */
export const DESIGN_SCHOOL_VIDEO_PANEL_MIN_WIDTH = 320;
export const DESIGN_SCHOOL_VIDEO_PANEL_MAX_WIDTH = 800;

export const designSchoolVideoPanelWidth = signal<number | null>(null);

export function setDesignSchoolVideoPanelWidth(width: number | null) {
  if (width === null) {
    designSchoolVideoPanelWidth.value = null;
    return;
  }
  // Clamp to keep the video legible (lower bound) and prevent the panel from
  // eating the artboard / wider than the viewport (upper bound).
  const clamped = Math.max(
    DESIGN_SCHOOL_VIDEO_PANEL_MIN_WIDTH,
    Math.min(DESIGN_SCHOOL_VIDEO_PANEL_MAX_WIDTH, width),
  );
  designSchoolVideoPanelWidth.value = clamped;
}

/**
 * Dismiss the mobile AI panel completely
 * Closes the panel, blurs input, and brings back the toolbar
 * Used when user interacts with canvas elements while keyboard is open
 */
export function dismissMobileAIPanel() {
  // Close the AI panel (brings back toolbar)
  aiPanelOpen.value = false;
  // Clear focused state
  mobileAIInputFocused.value = false;
  // Blur any focused input element to close keyboard
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}
