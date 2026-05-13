import React, { useLayoutEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { getPortalTarget } from '@/utils/portalTarget';
import './ResizeHandlesPortal.css';

interface ResizeHandlesPortalProps {
  elementRef: React.RefObject<HTMLDivElement>;
  canvasScale: number;
  // Element rotation in degrees. Handles are placed in the rotated frame so
  // they track the element's actual edges instead of its axis-aligned
  // bounding box (which grows/shifts as the element rotates).
  rotation?: number;
  showRotation?: boolean;
  hideTopBottom?: boolean;
  onResizeStart: (handle: string) => (e: React.MouseEvent) => void;
  onResizeTouchStart: (handle: string) => (e: React.TouchEvent) => void;
  onRotationStart: (e: React.MouseEvent) => void;
}

interface ElementFrame {
  cx: number;
  cy: number;
  halfW: number;
  halfH: number;
}

const ResizeHandlesPortal: React.FC<ResizeHandlesPortalProps> = ({
  elementRef,
  canvasScale,
  rotation = 0,
  showRotation = false,
  hideTopBottom = false,
  onResizeStart,
  onResizeTouchStart,
  onRotationStart,
}) => {
  const [frame, setFrame] = useState<ElementFrame | null>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameRef = useRef<ElementFrame | null>(null);

  // Track the element's frame via a RAF loop, committing to state only when
  // it actually changes so handles don't re-render at 60 Hz forever.
  useLayoutEffect(() => {
    const updateFrame = () => {
      const el = elementRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // For a rotated rectangle, getBoundingClientRect returns the AABB; its
      // center is the same as the element's center (rotation is centered).
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // offsetWidth/offsetHeight give the unrotated CSS dimensions. Multiply
      // by canvasScale to map into screen space.
      const halfW = (el.offsetWidth * canvasScale) / 2;
      const halfH = (el.offsetHeight * canvasScale) / 2;
      const next: ElementFrame = { cx, cy, halfW, halfH };
      const last = lastFrameRef.current;
      if (
        last
        && last.cx === next.cx
        && last.cy === next.cy
        && last.halfW === next.halfW
        && last.halfH === next.halfH
      ) {
        return;
      }
      lastFrameRef.current = next;
      setFrame(next);
    };

    updateFrame();

    const loop = () => {
      updateFrame();
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [elementRef, canvasScale]);

  if (!frame) return null;

  // Cap counter-scale to prevent handles from getting too large on mobile.
  const rawCounterScale = 1 / canvasScale;
  const counterScale = Math.min(rawCounterScale, 1.5);
  const cornerSize = 14;
  const sideWidth = 22;
  const sideHeight = 7;
  const scaledCornerSize = cornerSize * counterScale;
  const scaledSideWidth = sideWidth * counterScale;
  const scaledSideHeight = sideHeight * counterScale;
  // CanvasElement's 2px selection border: its centerline sits 1 CSS px
  // (= canvasScale screen px) inside the element's outer edge.
  const borderInset = canvasScale;

  // Rotate a local offset (relative to element center) into screen space.
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const project = (lx: number, ly: number): { x: number; y: number } => ({
    x: frame.cx + lx * cos - ly * sin,
    y: frame.cy + lx * sin + ly * cos,
  });

  // Local offsets for each handle sit on the border centerline, so corners
  // and sides are inset by borderInset along their normal axis.
  const hW = frame.halfW - borderInset;
  const hH = frame.halfH - borderInset;

  const cornerHandles: { name: string; local: [number, number]; cursor: string }[] = [
    { name: 'top-left', local: [-hW, -hH], cursor: 'nwse-resize' },
    { name: 'top-right', local: [hW, -hH], cursor: 'nesw-resize' },
    { name: 'bottom-left', local: [-hW, hH], cursor: 'nesw-resize' },
    { name: 'bottom-right', local: [hW, hH], cursor: 'nwse-resize' },
  ];

  const sideHandles: {
    name: string;
    local: [number, number];
    width: number;
    height: number;
    cursor: string;
  }[] = [
    {
      name: 'top',
      local: [0, -hH],
      width: scaledSideWidth,
      height: scaledSideHeight,
      cursor: 'ns-resize',
    },
    {
      name: 'right',
      local: [hW, 0],
      width: scaledSideHeight,
      height: scaledSideWidth,
      cursor: 'ew-resize',
    },
    {
      name: 'bottom',
      local: [0, hH],
      width: scaledSideWidth,
      height: scaledSideHeight,
      cursor: 'ns-resize',
    },
    {
      name: 'left',
      local: [-hW, 0],
      width: scaledSideHeight,
      height: scaledSideWidth,
      cursor: 'ew-resize',
    },
  ];

  // Rotation handle — positioned below the element in its own rotated frame.
  const rotationHandleSize = 24 * counterScale;
  const rotationHandleOffset = 36 * counterScale;
  const rotationLocalY = frame.halfH + rotationHandleOffset;

  // Render a handle centered on a rotated local offset. The `transform`
  // visually rotates each handle so side pills align with the element's
  // rotated edges and the rotation icon faces the user naturally.
  const renderHandle = (
    key: string,
    width: number,
    height: number,
    local: [number, number],
    handleClass: string,
    cursor: string | undefined,
    onMouseDown: (e: React.MouseEvent) => void,
    onTouchStart?: (e: React.TouchEvent) => void,
  ): JSX.Element => {
    const pos = project(local[0], local[1]);
    return (
      // Plain div: fixed-position handle with dynamic left/top/width/height/transform/cursor
      // computed per-frame from element bounds; Easel Box reset would strip positioning.
      <div
        key={key}
        className={handleClass}
        style={{
          position: 'fixed',
          left: pos.x - width / 2,
          top: pos.y - height / 2,
          width,
          height,
          transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
          cursor,
          pointerEvents: 'auto',
        }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      />
    );
  };

  return ReactDOM.createPortal(
    // Plain div: global CSS class "resize-handles-portal" (non-module) composes
    // position:fixed + pointer-events:none. Easel Box would wipe those.
    <div className="resize-handles-portal">
      {cornerHandles.map(({ name, local, cursor }) =>
        renderHandle(
          name,
          scaledCornerSize,
          scaledCornerSize,
          local,
          'resize-handle-portal corner',
          cursor,
          e => {
            e.stopPropagation();
            onResizeStart(name)(e);
          },
          e => {
            e.stopPropagation();
            onResizeTouchStart(name)(e);
          },
        ),
      )}

      {sideHandles
        .filter(({ name }) => !(hideTopBottom && (name === 'top' || name === 'bottom')))
        .map(({ name, local, width, height, cursor }) =>
          renderHandle(
            name,
            width,
            height,
            local,
            'resize-handle-portal side',
            cursor,
            e => {
              e.stopPropagation();
              onResizeStart(name)(e);
            },
            e => {
              e.stopPropagation();
              onResizeTouchStart(name)(e);
            },
          ),
        )}

      {showRotation
        && renderHandle(
          'rotate',
          rotationHandleSize,
          rotationHandleSize,
          [0, rotationLocalY],
          'rotate-handle-portal',
          undefined,
          e => {
            e.stopPropagation();
            onRotationStart(e);
          },
        )}
    </div>,
    getPortalTarget(),
  );
};

export default ResizeHandlesPortal;
