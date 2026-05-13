import { useState, useRef, useCallback } from 'react';
import { selectByRect, clearSelection, canvasScale } from '@/store';

export interface SelectionRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface DragSelectionOptions {
  canvasRef: React.RefObject<HTMLElement | null>;
  onSelectionStart?: () => void;
  onSelectionEnd?: (rect: SelectionRect) => void;
}

export interface DragSelectionResult {
  isSelecting: boolean;
  selectionRect: SelectionRect | null;
  onMouseDown: (e: React.MouseEvent) => void;
}

export function useDragSelection(options: DragSelectionOptions): DragSelectionResult {
  const { canvasRef, onSelectionStart, onSelectionEnd } = options;

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);

  const startPosRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);

  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scale = canvasScale.value;

      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [canvasRef],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      const startX = startPosRef.current.x;
      const startY = startPosRef.current.y;
      const currentX = coords.x;
      const currentY = coords.y;

      // Calculate rectangle bounds
      const left = Math.min(startX, currentX);
      const top = Math.min(startY, currentY);
      const width = Math.abs(currentX - startX);
      const height = Math.abs(currentY - startY);

      // Only show selection rect if dragged at least 5px
      if (width > 5 || height > 5) {
        if (!isSelecting) {
          setIsSelecting(true);
          onSelectionStart?.();
        }
        setSelectionRect({ top, left, width, height });
      }
    },
    [getCanvasCoords, isSelecting, onSelectionStart],
  );

  const handleMouseUp = useCallback(() => {
    if (isMouseDownRef.current && selectionRect) {
      // Perform selection based on rect
      selectByRect(selectionRect);
      onSelectionEnd?.(selectionRect);
    } else if (isMouseDownRef.current && !selectionRect) {
      // Click without drag - clear selection
      clearSelection();
    }

    isMouseDownRef.current = false;
    setIsSelecting(false);
    setSelectionRect(null);

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [selectionRect, handleMouseMove, onSelectionEnd]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start selection on direct canvas click (not on elements)
      if (e.target !== e.currentTarget) return;

      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (!coords) return;

      e.preventDefault();
      isMouseDownRef.current = true;
      startPosRef.current = coords;

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [getCanvasCoords, handleMouseMove, handleMouseUp],
  );

  return {
    isSelecting,
    selectionRect,
    onMouseDown,
  };
}
