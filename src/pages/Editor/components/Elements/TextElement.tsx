import React, { useRef, useEffect, useCallback } from 'react';
import type { ElementData } from '@/store/types';
import { updateElementContent } from '@/store';
import styles from './TextElement.module.css';

interface TextElementProps {
  element: ElementData;
  isSelected: boolean;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
}

export function TextElement({
  element,
  isSelected,
  isEditing = false,
  onStartEditing,
  onStopEditing,
}: TextElementProps): React.ReactNode {
  const textRef = useRef<HTMLDivElement | null>(null);
  const editingContentRef = useRef<string>(element.content ?? '');

  // Focus and select text when entering edit mode
  useEffect(() => {
    if (isEditing && textRef.current) {
      const el = textRef.current;
      el.textContent = element.content ?? '';
      el.focus();

      // Select all text
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing, element.content]);

  // Handle click to enter edit mode (double-click or click when selected)
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
      // Save content on blur
      updateElementContent(element.elementId, editingContentRef.current, true);
      onStopEditing?.();
    }
  }, [isEditing, element.elementId, onStopEditing]);

  // Handle input changes
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    editingContentRef.current = target.textContent ?? '';
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
        // Cancel editing, restore original content
        if (textRef.current) {
          textRef.current.textContent = element.content ?? '';
        }
        editingContentRef.current = element.content ?? '';
        onStopEditing?.();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Save and exit on Enter (shift+enter for newline)
        e.preventDefault();
        handleBlur();
      }
    },
    [element.content, onStopEditing, handleBlur],
  );

  // Extract text-specific styles from element
  const textStyle: React.CSSProperties = {
    fontSize: element.style.fontSize,
    fontFamily: element.style.fontFamily,
    fontWeight: element.style.fontWeight,
    color: element.style.color,
    textAlign: element.style.textAlign as React.CSSProperties['textAlign'],
    letterSpacing: element.style.letterSpacing,
    lineHeight: element.style.lineHeight,
    textShadow: element.style.textShadow,
    opacity: element.style.opacity,
    // Box styling for bordered text boxes
    border: element.style.border,
    borderRadius: element.style.borderRadius,
    padding: element.style.padding,
    backgroundColor: element.style.backgroundColor,
    display: element.style.display,
    alignItems: element.style.alignItems,
    justifyContent: element.style.justifyContent,
  };

  return (
    // Plain div: outer wrapper composes .textElement layout; Easel Box reset would defeat it.
    <div className={styles.textElement}>
      {/* Plain div: contentEditable host + fully dynamic per-element typography
          (font-family / size / weight / color / letter-spacing / etc) from element.style.
          Easel Text/Title don't accept contentEditable or ref-based selection. */}
      <div
        ref={textRef}
        className={`${styles.textContent} ${isEditing ? styles.editing : ''}`}
        style={textStyle}
        contentEditable={isEditing}
        suppressContentEditableWarning
        data-placeholder="Type something..."
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
  );
}

export default TextElement;
