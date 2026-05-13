import React, { useState, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import type { ElementData } from '@/store/types';
import { getStyleNumber } from '@/store/types';
import { selectElement, isElementSelected, inverseScale } from '@/store';
import { useDragToMove } from '@/hooks/transforms';
import TransformBox from './TransformBox';
import ElementRenderer from './ElementRenderer';
import styles from './Element.module.css';

interface ElementProps {
  element: ElementData;
  canvasRef: React.RefObject<HTMLElement | null>;
  canvasWidth?: number;
  canvasHeight?: number;
}

export function Element({
  element,
  canvasRef,
  canvasWidth,
  canvasHeight,
}: ElementProps): React.ReactNode {
  useSignals();

  const [isEditing, setIsEditing] = useState(false);
  const { elementId, style, locked = false, visible = true } = element;

  // Extract numeric values from style
  const left = getStyleNumber(style.left, 0);
  const top = getStyleNumber(style.top, 0);
  const width = getStyleNumber(style.width, 200);
  const height = getStyleNumber(style.height, 100);
  const rotation = style.rotation ?? 0;
  const zIndex = style.zIndex ?? 0;

  const selected = isElementSelected(elementId);

  const { onMouseDown: onDragMouseDown } = useDragToMove({
    elementId,
    initialLeft: left,
    initialTop: top,
    canvasWidth,
    canvasHeight,
    elementWidth: width,
    elementHeight: height,
    locked: locked || isEditing,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Select element on mouse down
      const addToSelection = e.shiftKey;
      selectElement(elementId, addToSelection);

      // Start drag unless editing
      if (!isEditing) {
        onDragMouseDown(e);
      }
    },
    [elementId, isEditing, onDragMouseDown],
  );

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleStopEditing = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Calculate inverse scale for counter-scaling UI elements
  const invScale = inverseScale.value;

  const elementClassName = [
    styles.element,
    locked && styles.locked,
    !visible && styles.hidden,
    isEditing && styles.editing,
  ]
    .filter(Boolean)
    .join(' ');

  // Build the element style, spreading all CSS properties
  const elementStyle: React.CSSProperties = {
    ...style,
    // Override position values with numeric px values for positioning
    left,
    top,
    width,
    height,
    zIndex,
    // Apply rotation transform
    transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
    transformOrigin: 'center center',
    // CSS custom property for counter-scaling
    ['--inverseScale' as string]: invScale,
  };

  return (
    // Plain div: dynamic per-element position/size/rotation/zIndex + --inverseScale custom
    // property plus the full spread of element.style; Easel Box would wipe margin/background
    // and reject CSS custom properties.
    <div
      className={elementClassName}
      style={elementStyle}
      onMouseDown={handleMouseDown}
      onClick={e => e.stopPropagation()}
    >
      {/* Plain div: class composition carries styles.editing toggle; wraps ElementRenderer's
          own chrome so no background/margin reset needed. */}
      <div className={`${styles.elementContent} ${isEditing ? styles.editing : ''}`}>
        <ElementRenderer
          element={element}
          isSelected={selected}
          isEditing={isEditing}
          onStartEditing={handleStartEditing}
          onStopEditing={handleStopEditing}
        />
      </div>

      {/* Transform box (selection UI) when selected and not editing */}
      {selected && !isEditing && (
        <TransformBox
          element={element}
          canvasRef={canvasRef}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          showRotation={true}
          showSideHandles={true}
        />
      )}
    </div>
  );
}

export default Element;
