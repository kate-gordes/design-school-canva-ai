import React, { useEffect, useRef } from 'react';
import { updateElementContent } from '@/store';
import './TextElement.css';

interface TextElementProps {
  content?: string;
  style?: React.CSSProperties;
  isEditing?: boolean;
  elementId?: string;
  onClick?: (event: React.MouseEvent) => void;
  onBlur?: () => void;
}

const TextElement: React.FC<TextElementProps> = ({
  content,
  style,
  isEditing = false,
  elementId,
  onClick,
  onBlur,
}) => {
  const {
    top,
    left,
    position,
    width,
    height,
    border,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    backgroundColor,
    background,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    boxShadow,
    display,
    alignItems,
    justifyContent,
    flexDirection,
    // Layout transforms (rotation, drag offset, resize preview) live on the
    // wrapper — stripping them here avoids a double application on the
    // inner text node which would visually compound the rotation.
    transform,
    willChange,
    ...textStyles
  } = style || {};
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== content) {
      contentRef.current.innerHTML = content || '';
    }
  }, [content]);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
      // Move cursor to end of text
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(contentRef.current);
      range.collapse(false);
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [isEditing]);

  const handleInput = (evt: React.FormEvent<HTMLDivElement>) => {
    const newContent = evt.currentTarget.innerHTML;
    if (elementId) {
      updateElementContent(elementId, newContent);
    }
  };

  return (
    // Plain div: contentEditable host (Easel Text doesn't forward contentEditable/ref),
    // spreads fully dynamic per-element text styles, and keeps the data-element-id hook
    // used by measure passes. Easel reset would wipe those style overrides.
    <div
      ref={contentRef}
      onClick={onClick}
      onInput={handleInput}
      onBlur={onBlur}
      contentEditable={isEditing}
      suppressContentEditableWarning
      className="text-content"
      style={{
        // Default line-height to font-based 'normal' so the line-box matches
        // glyph metrics; the app's body line-height would otherwise crush it.
        // style prop (textStyles) can still override this.
        lineHeight: 'normal',
        ...textStyles,
        cursor: isEditing ? 'text' : 'inherit',
        userSelect: isEditing ? 'text' : 'none',
        outline: 'none', // Remove default focus outline as we have selection border
      }}
      data-element-id={elementId}
    />
  );
};

export default TextElement;
