import React, { useRef } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import styles from './SelectableObject.module.css';

export interface SelectableObjectProps {
  objectType: 'text' | 'shape';
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  scale: number;
  getCanvasEl: () => HTMLElement | null;
  canvasWidth?: number;
  canvasHeight?: number;
  width?: number;
  height?: number;
  onSizeChange?: (size: { width: number; height: number }, kind?: 'corner' | 'side') => void;
  children: React.ReactNode;
  suppressSelection?: boolean; // Hide selection chrome/handles (e.g., while editing)
  onResizeEnd?: (size: { width: number; height: number }, kind?: 'corner' | 'side') => void;
}

export default function SelectableObject(props: SelectableObjectProps): React.ReactNode {
  const {
    objectType,
    position,
    onPositionChange,
    scale,
    getCanvasEl,
    canvasWidth,
    canvasHeight,
    children,
    width,
    height,
    onSizeChange,
    suppressSelection,
    onResizeEnd,
  } = props;
  const { setSelection, state } = useAppContext();
  const draggingRef = useRef<boolean>(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizingRef = useRef<null | {
    dir: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startCenterX: number;
    startCenterY: number;
    lastWidth: number;
    lastHeight: number;
  }>(null);

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = e => {
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;

    // Set selection bounds and type
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setSelection(objectType, { x: r.left, y: r.top, width: r.width, height: r.height });

    // Capture the cursor offset from the object's current center (in canvas coords)
    const canvasEl = getCanvasEl();
    if (canvasEl) {
      const rect = canvasEl.getBoundingClientRect();
      const cursorX = (e.clientX - rect.left) / scale;
      const cursorY = (e.clientY - rect.top) / scale;
      dragOffsetRef.current = { x: position.x - cursorX, y: position.y - cursorY };
    } else {
      dragOffsetRef.current = { x: 0, y: 0 };
    }

    window.addEventListener('mousemove', onMouseMove, { passive: false });
    window.addEventListener('mouseup', onMouseUp, { passive: false });
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;
    const canvasEl = getCanvasEl();
    if (!canvasEl) return;
    e.preventDefault();
    const rect = canvasEl.getBoundingClientRect();
    const cursorX = (e.clientX - rect.left) / scale;
    const cursorY = (e.clientY - rect.top) / scale;
    const targetX = cursorX + dragOffsetRef.current.x;
    const targetY = cursorY + dragOffsetRef.current.y;
    const clampedX = canvasWidth ? Math.max(0, Math.min(canvasWidth, targetX)) : targetX;
    const clampedY = canvasHeight ? Math.max(0, Math.min(canvasHeight, targetY)) : targetY;
    onPositionChange({ x: clampedX, y: clampedY });
  };

  const onMouseUp = () => {
    draggingRef.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeUp);
  };

  const isSelected = state.selectedObjectType === objectType && !suppressSelection;

  // Resize handlers
  const onResizeDown: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!onSizeChange) return;
    e.stopPropagation();
    e.preventDefault();
    const canvasEl = getCanvasEl();
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const startX = (e.clientX - rect.left) / scale;
    const startY = (e.clientY - rect.top) / scale;
    resizingRef.current = {
      dir: (e.currentTarget as HTMLElement).dataset.dir ?? '',
      startX,
      startY,
      startWidth:
        width
        ?? ((e.currentTarget.parentElement as HTMLElement)?.parentElement as HTMLElement)
          ?.offsetWidth
        ?? 0,
      startHeight:
        height
        ?? ((e.currentTarget.parentElement as HTMLElement)?.parentElement as HTMLElement)
          ?.offsetHeight
        ?? 0,
      startCenterX: position.x,
      startCenterY: position.y,
      lastWidth:
        width
        ?? ((e.currentTarget.parentElement as HTMLElement)?.parentElement as HTMLElement)
          ?.offsetWidth
        ?? 0,
      lastHeight:
        height
        ?? ((e.currentTarget.parentElement as HTMLElement)?.parentElement as HTMLElement)
          ?.offsetHeight
        ?? 0,
    };
    window.addEventListener('mousemove', onResizeMove, { passive: false });
    window.addEventListener('mouseup', onResizeUp, { passive: false });
  };

  const onResizeMove = (e: MouseEvent) => {
    if (!resizingRef.current || !onSizeChange) return;
    e.preventDefault();
    const canvasEl = getCanvasEl();
    if (!canvasEl) return;
    const rect = canvasEl.getBoundingClientRect();
    const curX = (e.clientX - rect.left) / scale;
    const curY = (e.clientY - rect.top) / scale;
    const { dir, startX, startY, startWidth, startHeight, startCenterX, startCenterY } =
      resizingRef.current;
    let newWidth = startWidth;
    let newHeight = startHeight;
    let newCenterX = startCenterX;
    let newCenterY = startCenterY;
    const dx = curX - startX;
    const dy = curY - startY;

    const minSize = 20;
    const cw = canvasWidth ?? Number.POSITIVE_INFINITY;
    const ch = canvasHeight ?? Number.POSITIVE_INFINITY;

    if (dir.includes('right')) {
      newWidth = Math.max(minSize, startWidth + dx);
      newCenterX = startCenterX + dx / 2;
    }
    if (dir.includes('left')) {
      newWidth = Math.max(minSize, startWidth - dx);
      newCenterX = startCenterX + dx / 2;
    }
    if (dir.includes('bottom')) {
      newHeight = Math.max(minSize, startHeight + dy);
      newCenterY = startCenterY + dy / 2;
    }
    if (dir.includes('top')) {
      newHeight = Math.max(minSize, startHeight - dy);
      newCenterY = startCenterY + dy / 2;
    }

    // Clamp center to stay within canvas based on half extents
    const halfW = newWidth / 2;
    const halfH = newHeight / 2;
    if (Number.isFinite(cw)) newCenterX = Math.max(halfW, Math.min(cw - halfW, newCenterX));
    if (Number.isFinite(ch)) newCenterY = Math.max(halfH, Math.min(ch - halfH, newCenterY));

    const isCorner =
      dir.includes('left') || dir.includes('right')
        ? dir.includes('top') || dir.includes('bottom')
        : false;
    const kind: 'corner' | 'side' = isCorner ? 'corner' : 'side';

    onSizeChange({ width: newWidth, height: newHeight }, kind);
    onPositionChange({ x: newCenterX, y: newCenterY });
    if (resizingRef.current) {
      resizingRef.current.lastWidth = newWidth;
      resizingRef.current.lastHeight = newHeight;
    }
  };

  const onResizeUp = () => {
    const current = resizingRef.current;
    if (current && onResizeEnd) {
      const isCorner =
        current.dir.includes('left') || current.dir.includes('right')
          ? current.dir.includes('top') || current.dir.includes('bottom')
          : false;
      const kind: 'corner' | 'side' = isCorner ? 'corner' : 'side';
      onResizeEnd({ width: current.lastWidth, height: current.lastHeight }, kind);
    }
    resizingRef.current = null;
    window.removeEventListener('mousemove', onResizeMove);
    window.removeEventListener('mouseup', onResizeUp);
  };

  return (
    // Plain div: absolute-positioned selection frame with per-object dynamic
    // left/top/width/height + dynamic --canvasScale CSS var consumed by handle
    // calc() rules. Easel Box reset would wipe positioning and CSS vars.
    <div
      className={`${styles.selectable} ${
        objectType === 'shape' ? styles.objectTypeShape : styles.objectTypeText
      } ${isSelected ? styles.selected : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        // Provide current canvas scale to CSS so borders/handles can stay constant
        ['--canvasScale' as unknown as string]: String(scale ?? 1),
        // Ensure consistent visual sizes regardless of zoom or device pixel ratio
        // by locking handle sizes via CSS variables on the container scope.
        // Using integers avoids sub-pixel rounding causing 15.66x5.22 results.
        ['--cornerSize' as unknown as string]: '12px',
        ['--cornerOffset' as unknown as string]: '-3px',
        ['--sideW' as unknown as string]: '18px',
        ['--sideH' as unknown as string]: '6px',
      }}
      onMouseDown={onMouseDown}
      onClick={e => e.stopPropagation()}
    >
      {/* Plain div: interaction surface with fixed z-index + 100% sizing so
          resizable children (contentEditable/imperatively-scaled nodes) fill
          the frame; Easel Box would reset the sizing. */}
      <div className={styles.contentLayer}>{children}</div>
      {isSelected && (
        <div className={styles.handles} aria-hidden>
          <div
            data-dir="top-left"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.cornerHandle} ${styles.cornerTopLeft}`}
          />
          <div
            data-dir="top-right"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.cornerHandle} ${styles.cornerTopRight}`}
          />
          <div
            data-dir="bottom-left"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.cornerHandle} ${styles.cornerBottomLeft}`}
          />
          <div
            data-dir="bottom-right"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.cornerHandle} ${styles.cornerBottomRight}`}
          />
          {objectType === 'shape' && (
            <>
              <div
                data-dir="top"
                onMouseDown={onResizeDown}
                className={`${styles.handleBase} ${styles.sideHandle} ${styles.sideTop}`}
              />
              <div
                data-dir="bottom"
                onMouseDown={onResizeDown}
                className={`${styles.handleBase} ${styles.sideHandle} ${styles.sideBottom}`}
              />
            </>
          )}
          <div
            data-dir="left"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.sideHandle} ${styles.sideLeft}`}
          />
          <div
            data-dir="right"
            onMouseDown={onResizeDown}
            className={`${styles.handleBase} ${styles.sideHandle} ${styles.sideRight}`}
          />
        </div>
      )}
    </div>
  );
}
