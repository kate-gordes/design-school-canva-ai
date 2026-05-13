import React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { canvases } from '@/store';
import { MiniCanvas } from '@/pages/Editor/components/PageNavigator/MiniCanvas';
import styles from './SlidePickerMessage.module.css';

interface SlidePickerMessageProps {
  excludeCanvasId: number;
  onSlideSelect: (canvasId: number, slideNumber: number) => void;
  disabled?: boolean;
}

export function SlidePickerMessage({
  excludeCanvasId,
  onSlideSelect,
  disabled,
}: SlidePickerMessageProps): React.ReactNode {
  useSignals();

  const allCanvases = canvases.value;
  const pickableCanvases = allCanvases.filter(
    c =>
      c.canvasId !== excludeCanvasId
      && (!c.docType || c.docType === 'presentation' || c.docType === 'fixed-design'),
  );

  if (pickableCanvases.length === 0) return null;

  return (
    // Plain div: 2-column grid container; Easel Grid would conflict with aspect-ratio
    // child and pass-through hover border-color on raw buttons.
    <div className={styles.grid}>
      {pickableCanvases.map(canvas => {
        const slideNumber = allCanvases.findIndex(c => c.canvasId === canvas.canvasId) + 1;
        return (
          <button
            key={canvas.canvasId}
            onClick={() => onSlideSelect(canvas.canvasId, slideNumber)}
            disabled={disabled}
            className={styles.slideButton}
          >
            {/* Plain div: aspect-ratio wrapper for the mini canvas thumbnail;
                Easel Box reset would wipe overflow:hidden clipping. */}
            <div className={styles.slideThumbnail}>
              <MiniCanvas pageNumber={slideNumber} doctype="presentation" />
            </div>
            <span className={styles.slideLabel}>Slide {slideNumber}</span>
          </button>
        );
      })}
    </div>
  );
}
