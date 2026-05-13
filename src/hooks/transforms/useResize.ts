import { useState, useCallback, useRef, useEffect } from 'react';
import type { Bounds, ResizeHandle } from '@/utils/transformUtils';
import {
  calculateResizeBounds,
  calculateAspectRatio,
  getCursorForHandle,
} from '@/utils/transformUtils';

// Read the element's rendered size in the same units CSS `width`/`height` are
// specified in — which depends on box-sizing. offsetWidth/offsetHeight are
// border-box values; writing them back as inline width/height on a
// content-box element (e.g. our text elements with ink-padding) reinterprets
// them as content size, making the box grow by padding+border on grab.
// getComputedStyle returns the used width/height in the element's own
// box-sizing model, so round-tripping keeps the visual size identical.
function readLiveBounds(bounds: Bounds, ref?: React.RefObject<HTMLElement | null>): Bounds {
  const el = ref?.current;
  if (!el) return bounds;
  const cs = getComputedStyle(el);
  const w = parseFloat(cs.width);
  const h = parseFloat(cs.height);
  return {
    x: bounds.x,
    y: bounds.y,
    width: Number.isFinite(w) && w > 0 ? w : bounds.width,
    height: Number.isFinite(h) && h > 0 ? h : bounds.height,
  };
}

interface UseResizeOptions {
  initialBounds: Bounds;
  canvasBounds: Bounds;
  onResizeStart?: (handle: ResizeHandle) => void;
  onResize?: (bounds: Bounds) => void;
  onResizeEnd: (bounds: Bounds, handle: ResizeHandle | null) => void;
  minSize?: { width: number; height: number };
  enabled?: boolean;
  // Per-handle aspect-ratio lock. Return true to force proportional resize
  // even without Shift held (e.g. text corners must stay proportional so
  // font and box scale together).
  lockAspectRatio?: (handle: ResizeHandle) => boolean;
  // Used to read the element's *actual* rendered size at resize start.
  // Elements without an explicit width/height in their stored style use
  // fallback values (e.g. height=100) in initialBounds that don't match what
  // the browser is drawing; applying those to the DOM would snap the element
  // to a new size the moment the handle is grabbed. We read offsetWidth/
  // offsetHeight (unscaled, border-box) so the grab feels seamless.
  elementRef?: React.RefObject<HTMLElement | null>;
}

interface UseResizeResult {
  bounds: Bounds;
  isResizing: boolean;
  activeHandle: ResizeHandle | null;
  aspectRatioLocked: boolean;
  handleResizeStart: (handle: ResizeHandle) => (e: React.MouseEvent) => void;
  handleResizeTouchStart: (handle: ResizeHandle) => (e: React.TouchEvent) => void;
}

export function useResize({
  initialBounds,
  canvasBounds,
  onResizeStart,
  onResize,
  onResizeEnd,
  minSize = { width: 20, height: 20 },
  enabled = true,
  lockAspectRatio,
  elementRef,
}: UseResizeOptions): UseResizeResult {
  const lockAspectRef = useRef<typeof lockAspectRatio>(lockAspectRatio);
  lockAspectRef.current = lockAspectRatio;
  const [bounds, setBounds] = useState<Bounds>(initialBounds);
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(false);

  const resizeStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialBoundsRef = useRef<Bounds>(initialBounds);
  const isResizingRef = useRef(false);
  const activeHandleRef = useRef<ResizeHandle | null>(null);
  const aspectRatioRef = useRef<number | undefined>(undefined);
  const prevInitialBoundsRef = useRef<Bounds>(initialBounds);
  const isTouchResizeRef = useRef(false);

  // Update bounds when initialBounds changes
  useEffect(() => {
    if (!isResizingRef.current) {
      const prev = prevInitialBoundsRef.current;
      // Only update if actually different
      if (
        prev.x !== initialBounds.x
        || prev.y !== initialBounds.y
        || prev.width !== initialBounds.width
        || prev.height !== initialBounds.height
      ) {
        setBounds(initialBounds);
        prevInitialBoundsRef.current = initialBounds;
      }
    }
  }, [initialBounds.x, initialBounds.y, initialBounds.width, initialBounds.height]);

  // Track Shift key for aspect ratio lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && isResizingRef.current) {
        setAspectRatioLocked(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setAspectRatioLocked(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleResizeStart = useCallback(
    (handle: ResizeHandle) => (e: React.MouseEvent) => {
      if (!enabled || handle === 'rotate') return;

      e.stopPropagation();
      e.preventDefault();

      const liveBounds = readLiveBounds(bounds, elementRef);
      resizeStartRef.current = { x: e.clientX, y: e.clientY };
      initialBoundsRef.current = liveBounds;
      isResizingRef.current = true;
      activeHandleRef.current = handle;
      setBounds(liveBounds);
      setIsResizing(true);
      setActiveHandle(handle);

      // Store aspect ratio if Shift is held, or if this handle forces locking
      const forceLock = lockAspectRef.current?.(handle) ?? false;
      if (e.shiftKey || forceLock) {
        aspectRatioRef.current = calculateAspectRatio(liveBounds);
        setAspectRatioLocked(true);
      } else {
        aspectRatioRef.current = undefined;
        setAspectRatioLocked(false);
      }

      onResizeStart?.(handle);

      const cursor = getCursorForHandle(handle);
      document.body.style.cursor = cursor;
      document.body.style.userSelect = 'none';
    },
    [enabled, bounds, onResizeStart, elementRef],
  );

  const handleResizeTouchStart = useCallback(
    (handle: ResizeHandle) => (e: React.TouchEvent) => {
      if (!enabled || handle === 'rotate') return;

      // Only handle single-finger touches
      if (e.touches.length !== 1) return;

      e.stopPropagation();

      const touch = e.touches[0];

      const liveBounds = readLiveBounds(bounds, elementRef);
      resizeStartRef.current = { x: touch.clientX, y: touch.clientY };
      initialBoundsRef.current = liveBounds;
      isResizingRef.current = true;
      isTouchResizeRef.current = true;
      activeHandleRef.current = handle;
      setBounds(liveBounds);
      setIsResizing(true);
      setActiveHandle(handle);

      // No shift key on touch, but handle may still force aspect lock.
      const forceLock = lockAspectRef.current?.(handle) ?? false;
      if (forceLock) {
        aspectRatioRef.current = calculateAspectRatio(liveBounds);
        setAspectRatioLocked(true);
      } else {
        aspectRatioRef.current = undefined;
        setAspectRatioLocked(false);
      }

      onResizeStart?.(handle);
    },
    [enabled, bounds, onResizeStart, elementRef],
  );

  useEffect(() => {
    if (!isResizingRef.current || !activeHandleRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !activeHandleRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      // Determine if aspect ratio should be locked. Handle-level force lock
      // (e.g. text corners) stays on regardless of Shift.
      const forceLock = activeHandleRef.current
        ? (lockAspectRef.current?.(activeHandleRef.current) ?? false)
        : false;
      const shouldLockAspect = e.shiftKey || aspectRatioLocked || forceLock;
      const aspectRatio = shouldLockAspect
        ? (aspectRatioRef.current ?? calculateAspectRatio(initialBoundsRef.current))
        : undefined;

      // Update aspect ratio lock state
      if (e.shiftKey && !aspectRatioLocked) {
        setAspectRatioLocked(true);
        aspectRatioRef.current = calculateAspectRatio(initialBoundsRef.current);
      } else if (!e.shiftKey && aspectRatioLocked && !forceLock) {
        setAspectRatioLocked(false);
        aspectRatioRef.current = undefined;
      }

      const newBounds = calculateResizeBounds(
        activeHandleRef.current,
        initialBoundsRef.current,
        { x: deltaX, y: deltaY },
        aspectRatio,
        minSize,
      );

      // No canvas constraints - allow free resizing

      setBounds(newBounds);
      onResize?.(newBounds);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isResizingRef.current || !activeHandleRef.current || isTouchResizeRef.current) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      const shouldLockAspect = e.shiftKey || aspectRatioLocked;
      const aspectRatio = shouldLockAspect
        ? (aspectRatioRef.current ?? calculateAspectRatio(initialBoundsRef.current))
        : undefined;

      const finalBounds = calculateResizeBounds(
        activeHandleRef.current,
        initialBoundsRef.current,
        { x: deltaX, y: deltaY },
        aspectRatio,
        minSize,
      );

      // No canvas constraints - allow free positioning

      const endedHandle = activeHandleRef.current;
      setBounds(finalBounds);
      setIsResizing(false);
      setActiveHandle(null);
      isResizingRef.current = false;
      activeHandleRef.current = null;
      aspectRatioRef.current = undefined;
      setAspectRatioLocked(false);

      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      onResizeEnd(finalBounds, endedHandle);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isResizingRef.current || !activeHandleRef.current || !isTouchResizeRef.current) return;

      // Cancel resize if multi-touch detected (for pinch-to-zoom)
      if (e.touches.length !== 1) {
        setIsResizing(false);
        setActiveHandle(null);
        isResizingRef.current = false;
        activeHandleRef.current = null;
        isTouchResizeRef.current = false;
        aspectRatioRef.current = undefined;
        setAspectRatioLocked(false);
        return;
      }

      const touch = e.touches[0];

      const deltaX = touch.clientX - resizeStartRef.current.x;
      const deltaY = touch.clientY - resizeStartRef.current.y;

      const newBounds = calculateResizeBounds(
        activeHandleRef.current,
        initialBoundsRef.current,
        { x: deltaX, y: deltaY },
        aspectRatioRef.current,
        minSize,
      );

      setBounds(newBounds);
      onResize?.(newBounds);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isResizingRef.current || !activeHandleRef.current || !isTouchResizeRef.current) return;

      const touch = e.changedTouches[0];

      const deltaX = touch.clientX - resizeStartRef.current.x;
      const deltaY = touch.clientY - resizeStartRef.current.y;

      const finalBounds = calculateResizeBounds(
        activeHandleRef.current,
        initialBoundsRef.current,
        { x: deltaX, y: deltaY },
        aspectRatioRef.current,
        minSize,
      );

      const endedHandle = activeHandleRef.current;
      setBounds(finalBounds);
      setIsResizing(false);
      setActiveHandle(null);
      isResizingRef.current = false;
      activeHandleRef.current = null;
      isTouchResizeRef.current = false;
      aspectRatioRef.current = undefined;
      setAspectRatioLocked(false);

      onResizeEnd(finalBounds, endedHandle);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [canvasBounds, minSize, onResize, onResizeEnd, aspectRatioLocked]);

  return {
    bounds,
    isResizing,
    activeHandle,
    aspectRatioLocked,
    handleResizeStart,
    handleResizeTouchStart,
  };
}
