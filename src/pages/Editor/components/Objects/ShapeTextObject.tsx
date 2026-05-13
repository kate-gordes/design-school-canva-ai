import React, { useRef, useState } from 'react';
import SelectableObject from '@/pages/Editor/components/Objects/SelectableObject';
import styles from './ShapeTextObject.module.css';
import { useAppContext } from '@/hooks/useAppContext';

export interface ShapeTextObjectProps {
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  scale: number;
  getCanvasEl: () => HTMLElement | null;
  canvasWidth?: number;
  canvasHeight?: number;
  initialText?: string;
  size?: { width: number; height: number };
  onSizeChange?: (size: { width: number; height: number }, kind?: 'corner' | 'side') => void;
  content?: string;
  onContentChange?: (next: string) => void;
}

export default function ShapeTextObject(props: ShapeTextObjectProps): React.ReactNode {
  const {
    position,
    onPositionChange,
    scale,
    getCanvasEl,
    canvasWidth,
    canvasHeight,
    initialText,
    size: controlledSize,
    onSizeChange,
    content,
    onContentChange,
  } = props;
  const [uncontrolledText, setUncontrolledText] = useState<string>(initialText ?? '');
  const text = content ?? uncontrolledText;
  const inputRef = useRef<HTMLDivElement | null>(null);
  const { setSelection } = useAppContext();
  const [uncontrolledSize, setUncontrolledSize] = useState<{ width: number; height: number }>({
    width: 260,
    height: 260,
  });
  const size = controlledSize ?? uncontrolledSize;

  return (
    <SelectableObject
      objectType="shape"
      position={position}
      onPositionChange={onPositionChange}
      scale={scale}
      getCanvasEl={getCanvasEl}
      canvasWidth={canvasWidth}
      canvasHeight={canvasHeight}
      width={size.width}
      height={size.height}
      onSizeChange={next => {
        if (onSizeChange) {
          onSizeChange(next);
          return;
        }
        setUncontrolledSize(next);
      }}
    >
      <div className={styles.shape}>
        <div
          ref={inputRef}
          className={styles.content}
          contentEditable
          suppressContentEditableWarning
          onMouseDown={e => e.stopPropagation()}
          onClick={e => e.stopPropagation()}
          onFocus={e => {
            const el = (e.currentTarget.parentElement ?? e.currentTarget) as HTMLElement;
            const r = el.getBoundingClientRect();
            setSelection('shape', { x: r.left, y: r.top, width: r.width, height: r.height });
          }}
          onInput={e => {
            const target = e.currentTarget as HTMLDivElement;
            const next = target.textContent ?? '';
            if (onContentChange) {
              onContentChange(next);
            } else {
              setUncontrolledText(next);
            }
          }}
        >
          {text}
        </div>
      </div>
    </SelectableObject>
  );
}
