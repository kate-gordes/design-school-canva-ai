import { useState, useCallback, useRef, useEffect } from 'react';
import type { Point, Bounds } from '@/utils/transformUtils';

interface UseDragToMoveOptions {
  initialPosition: Point;
  elementSize: { width: number; height: number };
  canvasBounds: Bounds;
  canvasElement?: HTMLElement | null;
  onDragStart?: () => void;
  onDrag?: (position: Point) => void;
  onDragEnd: (position: Point) => void;
  enabled?: boolean;
}

interface UseDragToMoveResult {
  position: Point;
  isDragging: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleTouchStart: (e: React.TouchEvent) => void;
}

export function useDragToMove({
  initialPosition,
  elementSize,
  canvasBounds,
  canvasElement,
  onDragStart,
  onDrag,
  onDragEnd,
  enabled = true,
}: UseDragToMoveOptions): UseDragToMoveResult {
  const [position, setPosition] = useState<Point>(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<Point>({ x: 0, y: 0 });
  const initialPositionRef = useRef<Point>(initialPosition);
  const isDraggingRef = useRef(false);
  const prevInitialPositionRef = useRef<Point>(initialPosition);
  const isTouchDragRef = useRef(false);

  // Update position when initialPosition changes (but only if not dragging)
  useEffect(() => {
    if (!isDraggingRef.current) {
      // Only update if actually different from previous to avoid loops
      const prev = prevInitialPositionRef.current;
      if (prev.x !== initialPosition.x || prev.y !== initialPosition.y) {
        setPosition(initialPosition);
        prevInitialPositionRef.current = initialPosition;
      }
    }
  }, [initialPosition.x, initialPosition.y]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!enabled) return;

      // Only left click
      if (e.button !== 0) return;

      // Prevent if clicking on a handle or other interactive element
      const target = e.target as HTMLElement;
      if (
        target.classList.contains('resize-handle')
        || target.classList.contains('rotation-handle')
        || target.closest('.contextual-toolbar')
        || target.closest('.comment-icon')
      ) {
        return;
      }

      e.stopPropagation();
      e.preventDefault();

      // Store the starting mouse position (in viewport coordinates)
      dragStartRef.current = { x: e.clientX, y: e.clientY };

      // Store the element's current position
      initialPositionRef.current = { x: initialPosition.x, y: initialPosition.y };

      isDraggingRef.current = true;
      setIsDragging(true);

      onDragStart?.();

      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      // Global flag so CSS can suppress hover/highlight on siblings while a
      // drag is in flight (see CanvasElement.css).
      document.body.classList.add('is-dragging-canvas-element');
    },
    [enabled, initialPosition, onDragStart],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled) return;

      // Only handle single-finger touches
      if (e.touches.length !== 1) return;

      // Prevent if touching on a handle or other interactive element
      const target = e.target as HTMLElement;
      if (
        target.classList.contains('resize-handle')
        || target.classList.contains('rotation-handle')
        || target.closest('.contextual-toolbar')
        || target.closest('.comment-icon')
      ) {
        return;
      }

      e.stopPropagation();

      const touch = e.touches[0];

      // Store the starting touch position (in viewport coordinates)
      dragStartRef.current = { x: touch.clientX, y: touch.clientY };

      // Store the element's current position
      initialPositionRef.current = { x: initialPosition.x, y: initialPosition.y };

      isDraggingRef.current = true;
      isTouchDragRef.current = true;
      setIsDragging(true);

      onDragStart?.();
    },
    [enabled, initialPosition, onDragStart],
  );

  useEffect(() => {
    if (!isDraggingRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      // Calculate how much the mouse has moved since drag started
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Apply delta to initial position
      const newPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY,
      };

      // Don't constrain during drag for smoother interaction
      // Constraint will be applied on mouse up if needed

      setPosition(newPosition);
      onDrag?.(newPosition);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDraggingRef.current || isTouchDragRef.current) return;

      // Calculate how much the mouse has moved since drag started
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      // Apply delta to initial position
      const finalPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY,
      };

      // Allow free positioning - no canvas constraints
      // Elements can be positioned anywhere

      setPosition(finalPosition);
      setIsDragging(false);
      isDraggingRef.current = false;

      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.body.classList.remove('is-dragging-canvas-element');

      onDragEnd(finalPosition);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !isTouchDragRef.current) return;

      // Cancel drag if multi-touch detected (for pinch-to-zoom)
      if (e.touches.length !== 1) {
        setIsDragging(false);
        isDraggingRef.current = false;
        isTouchDragRef.current = false;
        return;
      }

      const touch = e.touches[0];

      // Calculate how much the touch has moved since drag started
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      // Apply delta to initial position
      const newPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY,
      };

      setPosition(newPosition);
      onDrag?.(newPosition);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current || !isTouchDragRef.current) return;

      // Use changedTouches to get the final position
      const touch = e.changedTouches[0];

      // Calculate how much the touch moved since drag started
      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      // Apply delta to initial position
      const finalPosition = {
        x: initialPositionRef.current.x + deltaX,
        y: initialPositionRef.current.y + deltaY,
      };

      setPosition(finalPosition);
      setIsDragging(false);
      isDraggingRef.current = false;
      isTouchDragRef.current = false;

      onDragEnd(finalPosition);
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
  }, [elementSize, canvasBounds, canvasElement, onDrag, onDragEnd]);

  return {
    position,
    isDragging,
    handleMouseDown,
    handleTouchStart,
  };
}
