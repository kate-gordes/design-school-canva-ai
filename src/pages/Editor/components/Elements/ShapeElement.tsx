import React, { useRef, useEffect, useCallback } from 'react';
import type { ElementData } from '@/store/types';
import { updateElementContent } from '@/store';
import styles from './ShapeElement.module.css';

interface ShapeElementProps {
  element: ElementData;
  isSelected: boolean;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
}

export function ShapeElement({
  element,
  isSelected,
  isEditing = false,
  onStartEditing,
  onStopEditing,
}: ShapeElementProps): React.ReactNode {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const editingContentRef = useRef<string>(element.content);

  // Calculate font size based on element dimensions
  const fontSize = Math.max(
    12,
    Math.min(48, Math.min(element.style.width, element.style.height) * 0.12),
  );

  // Focus when entering edit mode
  useEffect(() => {
    if (isEditing && contentRef.current) {
      const el = contentRef.current;
      el.textContent = element.content;
      el.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing, element.content]);

  // Handle click to enter edit mode
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isSelected && !isEditing) {
        e.stopPropagation();
        onStartEditing?.();
      }
    },
    [isSelected, isEditing, onStartEditing],
  );

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!isEditing) {
        e.stopPropagation();
        onStartEditing?.();
      }
    },
    [isEditing, onStartEditing],
  );

  // Handle blur to exit edit mode
  const handleBlur = useCallback(() => {
    if (isEditing) {
      updateElementContent(element.elementId, editingContentRef.current, true);
      onStopEditing?.();
    }
  }, [isEditing, element.elementId, onStopEditing]);

  // Handle input changes
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    editingContentRef.current = e.currentTarget.textContent ?? '';
  }, []);

  // Prevent drag when editing
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isEditing) {
        e.stopPropagation();
      }
    },
    [isEditing],
  );

  // Handle key events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (contentRef.current) {
          contentRef.current.textContent = element.content;
        }
        editingContentRef.current = element.content;
        onStopEditing?.();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleBlur();
      }
    },
    [element.content, onStopEditing, handleBlur],
  );

  return (
    // Plain div: outer structural wrapper; Easel Box would wipe the module's
    // shape-element layout rules via its reset.
    <div className={styles.shapeElement}>
      {/* Plain div: dynamic per-element backgroundColor / borderRadius / opacity come from
          element.style; Easel Box wipes backgrounds via reset_f88b8e. */}
      <div
        className={styles.shape}
        style={{
          backgroundColor: element.style.backgroundColor ?? '#9d6eff',
          borderRadius: element.style.borderRadius ?? 8,
          opacity: element.style.opacity,
        }}
      >
        {/* Plain div: contentEditable host + dynamic fontSize derived from element
            dimensions + ref/data-placeholder hooks Easel Box does not expose. */}
        <div
          ref={contentRef}
          className={`${styles.shapeContent} ${isEditing ? styles.editing : ''}`}
          style={{ fontSize: `${fontSize}px` }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          data-placeholder="Add text"
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onBlur={handleBlur}
          onInput={handleInput}
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
        >
          {!isEditing ? element.content : null}
        </div>
      </div>
    </div>
  );
}

export default ShapeElement;
