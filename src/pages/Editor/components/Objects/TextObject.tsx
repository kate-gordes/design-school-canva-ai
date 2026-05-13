import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import styles from './TextObject.module.css';
import SelectableObject from '@/pages/Editor/components/Objects/SelectableObject';
import { useAppContext } from '@/hooks/useAppContext';

export interface TextObjectProps {
  text: string;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  scale: number;
  getCanvasEl: () => HTMLElement | null;
  canvasWidth?: number;
  canvasHeight?: number;
  size?: { width: number; height: number };
  onSizeChange?: (size: { width: number; height: number }, kind?: 'corner' | 'side') => void;
  onTextChange?: (next: string) => void;
}

export default function TextObject(props: TextObjectProps): React.ReactNode {
  const {
    text,
    position,
    onPositionChange,
    scale,
    getCanvasEl,
    canvasWidth,
    canvasHeight,
    size: controlledSize,
    onSizeChange,
    onTextChange,
  } = props;
  // Track resizable box size for text objects similar to shapes
  const [uncontrolledSize, setUncontrolledSize] = useState<{ width: number; height: number }>({
    width: 320,
    height: 120,
  });
  const size = controlledSize ?? uncontrolledSize;
  const [fontSizePx, setFontSizePx] = useState<number>(150);
  const resizeKindRef = useRef<'corner' | 'side' | null>(null);
  const startHeightRef = useRef<number | null>(null);
  const startFontSizeRef = useRef<number | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const { state } = useAppContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const wasSelectedOnMouseDownRef = useRef<boolean>(false);
  const awaitingSecondClickRef = useRef<boolean>(false);
  // Buffer for in-progress edits that won't trigger rerenders (prevents caret jumps)
  const editingTextRef = useRef<string | null>(null);

  useEffect(() => {
    // If selection moves away from this text object type, reset the awaiting flag
    if (state.selectedObjectType !== 'text') {
      awaitingSecondClickRef.current = false;
    }
  }, [state.selectedObjectType]);

  // Grow width to fit content when editing (no text scaling)
  const ensureBoxEnclosesContent = () => {
    const node = textRef.current;
    if (!node) return;
    // Measure content width precisely
    const rect = node.getBoundingClientRect();
    const naturalW = node.scrollWidth || rect.width || 0;
    const naturalH = node.scrollHeight || rect.height || 0;
    const pad = 2; // small vertical safety to avoid pixel clipping
    const nextWidth = Math.max(size.width, naturalW);
    const nextHeight = Math.max(size.height, naturalH + pad);
    if (nextWidth !== size.width || nextHeight !== size.height) {
      const next = { width: nextWidth, height: nextHeight };
      if (controlledSize && onSizeChange) {
        onSizeChange(next, 'corner');
      } else {
        setUncontrolledSize(next);
      }
    }
  };

  useLayoutEffect(() => {
    // Ensure box always encloses text, whether editing or not
    ensureBoxEnclosesContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, size.width, size.height]);

  // When resizing via side handles (left/right), only change the box size (width)
  // without recalculating the text fit scale. Corner handles will still change both.
  const handleSizeChange = (next: { width: number; height: number }, kind?: 'corner' | 'side') => {
    // Initialize baseline on first corner-resize event
    if (kind === 'corner' && resizeKindRef.current !== 'corner') {
      resizeKindRef.current = 'corner';
      startHeightRef.current = size.height;
      startFontSizeRef.current = fontSizePx;
    }
    if (kind === 'side' && resizeKindRef.current !== 'side') {
      resizeKindRef.current = 'side';
      startHeightRef.current = null;
      startFontSizeRef.current = null;
    }

    if (controlledSize && onSizeChange) {
      // Controlled mode delegates changes upward
      onSizeChange(kind === 'side' ? { width: next.width, height: size.height } : next, kind);
      if (kind === 'corner' && startHeightRef.current && startFontSizeRef.current) {
        const rel = Math.max(0.05, next.height / startHeightRef.current);
        const target = Math.max(8, startFontSizeRef.current * rel);
        setFontSizePx(target);
      }
      return;
    }
    setUncontrolledSize(prev => {
      if (kind === 'side') {
        return { width: next.width, height: prev.height };
      }
      return next;
    });
    if (kind === 'corner' && startHeightRef.current && startFontSizeRef.current) {
      const rel = Math.max(0.05, next.height / startHeightRef.current);
      const target = Math.max(8, startFontSizeRef.current * rel);
      setFontSizePx(target);
    }
  };

  return (
    <SelectableObject
      objectType="text"
      position={position}
      onPositionChange={onPositionChange}
      scale={scale}
      getCanvasEl={getCanvasEl}
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      width={size.width}
      height={size.height}
      onSizeChange={handleSizeChange}
      onResizeEnd={(next, kind) => {
        // Persist final size and commit proportional font size update only once at end
        if (controlledSize && onSizeChange) {
          onSizeChange(kind === 'side' ? { width: next.width, height: size.height } : next, kind);
        } else {
          setUncontrolledSize(prev =>
            kind === 'side' ? { width: next.width, height: prev.height } : next,
          );
        }
        // Reset baseline
        resizeKindRef.current = null;
        startHeightRef.current = null;
        startFontSizeRef.current = null;
      }}
    >
      <div className={styles.textWrapper}>
        {/* Plain div: contentEditable host with dynamic font-size tied to resize
            handle ratio + ref-based selection/caret management; Easel Text
            cannot expose these imperative affordances. */}
        <div
          ref={textRef}
          className={styles.text}
          style={{ fontSize: `${fontSizePx}px` }}
          contentEditable={isEditing}
          suppressContentEditableWarning
          onMouseDown={e => {
            // While editing, suppress parent drag behavior
            if (isEditing) {
              e.stopPropagation();
              return;
            }
            // Record if it was selected for potential future logic
            const alreadySelected = state.selectedObjectType === 'text';
            wasSelectedOnMouseDownRef.current = alreadySelected;
            if (!alreadySelected) {
              // Mark that the next click should toggle into editing once selection is set
              awaitingSecondClickRef.current = true;
            }
          }}
          onClick={e => {
            // Enter edit mode only if it was already selected before this click (second click)
            if (
              !isEditing
              && (wasSelectedOnMouseDownRef.current || awaitingSecondClickRef.current)
            ) {
              e.stopPropagation();
              setIsEditing(true);
              editingTextRef.current = text;
              requestAnimationFrame(() => {
                const el = textRef.current;
                if (el) {
                  // Ensure starting content matches prop without causing rerender
                  el.textContent = text;
                  const range = document.createRange();
                  range.setStart(el.firstChild ?? el, 0);
                  range.collapse(true);
                  const sel = window.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                  el.focus();
                  // Ensure box grows if needed on entry
                  ensureBoxEnclosesContent();
                }
              });
              awaitingSecondClickRef.current = false;
            }
            wasSelectedOnMouseDownRef.current = false;
          }}
          onBlur={() => {
            setIsEditing(false);
            if (editingTextRef.current !== null && onTextChange) {
              onTextChange(editingTextRef.current);
            }
            editingTextRef.current = null;
          }}
          onInput={e => {
            const el = e.currentTarget as HTMLDivElement;
            const nextVal = el.textContent ?? '';
            editingTextRef.current = nextVal;
            // Grow horizontally as user types
            requestAnimationFrame(ensureBoxEnclosesContent);
          }}
        >
          {isEditing ? null : text}
        </div>
      </div>
    </SelectableObject>
  );
}
