import { useState, useCallback, useRef } from 'react';

interface UseDragToDismissOptions {
  onDismiss: () => void;
  panelHeight: number;
  dismissThreshold?: number; // percentage (0-1), default 0.3
  velocityThreshold?: number; // px/ms, default 0.5
}

interface UseDragToDismissResult {
  dragHandleProps: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
  };
  panelStyle: React.CSSProperties;
  isDragging: boolean;
}

export function useDragToDismiss({
  onDismiss,
  panelHeight,
  dismissThreshold = 0.3,
  velocityThreshold = 0.5,
}: UseDragToDismissOptions): UseDragToDismissResult {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const startY = useRef(0);
  const startTime = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);

  const handleDragStart = useCallback((clientY: number) => {
    startY.current = clientY;
    lastY.current = clientY;
    startTime.current = Date.now();
    lastTime.current = Date.now();
    setIsDragging(true);
    setIsAnimating(false);
  }, []);

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      const deltaY = clientY - startY.current;
      // Only allow downward dragging (positive offset)
      const newOffset = Math.max(0, deltaY);
      setDragOffset(newOffset);

      // Track for velocity calculation
      lastY.current = clientY;
      lastTime.current = Date.now();
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    const now = Date.now();
    const timeDelta = now - lastTime.current;
    const velocityY =
      timeDelta > 0 ? (lastY.current - startY.current) / (now - startTime.current) : 0;

    const dismissDistance = panelHeight * dismissThreshold;
    const shouldDismiss = dragOffset > dismissDistance || velocityY > velocityThreshold;

    if (shouldDismiss) {
      // Animate out and dismiss
      setIsAnimating(true);
      setDragOffset(panelHeight);
      setTimeout(() => {
        onDismiss();
        setDragOffset(0);
        setIsDragging(false);
        setIsAnimating(false);
      }, 200);
    } else {
      // Snap back
      setIsAnimating(true);
      setDragOffset(0);
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    }

    setIsDragging(false);
  }, [isDragging, dragOffset, panelHeight, dismissThreshold, velocityThreshold, onDismiss]);

  // Touch handlers
  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientY);
    },
    [handleDragMove],
  );

  const onTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse handlers (for desktop testing)
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handleDragStart(e.clientY);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        handleDragMove(moveEvent.clientY);
      };

      const handleMouseUp = () => {
        handleDragEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleDragStart, handleDragMove, handleDragEnd],
  );

  const panelStyle: React.CSSProperties = {
    transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
    transition: isAnimating ? 'transform 0.2s ease-out' : undefined,
  };

  return {
    dragHandleProps: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
    },
    panelStyle,
    isDragging,
  };
}
