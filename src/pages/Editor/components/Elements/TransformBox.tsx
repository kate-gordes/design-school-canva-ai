import React from 'react';
import { useResize, useRotation, type ResizeHandle } from '@/hooks/transforms';
import type { ElementData } from '@/store/types';
import { getStyleNumber } from '@/store/types';
import styles from './TransformBox.module.css';

interface TransformBoxProps {
  element: ElementData;
  canvasRef: React.RefObject<HTMLElement | null>;
  canvasWidth?: number;
  canvasHeight?: number;
  showRotation?: boolean;
  showSideHandles?: boolean;
}

export function TransformBox({
  element,
  canvasRef,
  canvasWidth,
  canvasHeight,
  showRotation = true,
  showSideHandles = true,
}: TransformBoxProps): React.ReactNode {
  const { style, elementId, locked = false } = element;

  // Extract numeric values from style
  const left = getStyleNumber(style.left, 0);
  const top = getStyleNumber(style.top, 0);
  const width = getStyleNumber(style.width, 200);
  const height = getStyleNumber(style.height, 100);
  const rotation = style.rotation ?? 0;

  const { createHandleMouseDown } = useResize({
    elementId,
    initialLeft: left,
    initialTop: top,
    initialWidth: width,
    initialHeight: height,
    canvasWidth,
    canvasHeight,
    locked,
  });

  const { onMouseDown: onRotationMouseDown } = useRotation({
    elementId,
    initialRotation: rotation,
    elementCenterX: left + width / 2,
    elementCenterY: top + height / 2,
    canvasRef,
    locked,
  });

  const cornerHandles: { handle: ResizeHandle; className: string }[] = [
    { handle: 'top-left', className: styles.topLeft },
    { handle: 'top-right', className: styles.topRight },
    { handle: 'bottom-left', className: styles.bottomLeft },
    { handle: 'bottom-right', className: styles.bottomRight },
  ];

  const sideHandles: { handle: ResizeHandle; className: string }[] = [
    { handle: 'top', className: styles.top },
    { handle: 'bottom', className: styles.bottom },
    { handle: 'left', className: styles.left },
    { handle: 'right', className: styles.right },
  ];

  return (
    // Plain div: overlay chrome composed from .transformBox positioning; Easel Box reset
    // would wipe the absolutely-positioned selection/handle system.
    <div className={styles.transformBox}>
      {/* Plain div: pure decorative selection border element. */}
      <div className={styles.selectionBorder} />

      {/* Plain div: handles container; children need bare DOM for onMouseDown hit-testing. */}
      <div className={styles.handles}>
        {/* Corner handles */}
        {cornerHandles.map(({ handle, className }) => (
          // Plain div: resize handle; onMouseDown drives useResize; Easel Box would wipe
          // absolute positioning and does not forward raw mouse events.
          <div
            key={handle}
            className={`${styles.handle} ${styles.cornerHandle} ${className}`}
            onMouseDown={createHandleMouseDown(handle)}
          />
        ))}

        {/* Side handles */}
        {showSideHandles
          && sideHandles.map(({ handle, className }) => (
            // Plain div: same rationale as corner handle above.
            <div
              key={handle}
              className={`${styles.handle} ${styles.sideHandle} ${className}`}
              onMouseDown={createHandleMouseDown(handle)}
            />
          ))}
      </div>

      {/* Rotation handle */}
      {showRotation && (
        // Plain div: rotation hit-target with onMouseDown (see rationale above).
        <div className={styles.rotationHandleContainer} onMouseDown={onRotationMouseDown}>
          {/* Plain div: inner chrome; composes .rotationHandle positioning. */}
          <div className={styles.rotationHandle}>
            <svg
              className={styles.rotationIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
              <path d="M3 22v-6h6" />
              <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransformBox;
