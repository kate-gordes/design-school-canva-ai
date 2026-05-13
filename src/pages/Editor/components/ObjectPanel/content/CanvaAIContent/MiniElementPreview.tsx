import React, { useRef, useState, useLayoutEffect } from 'react';
import type { ElementData } from '@/store';
import { CANVAS_DESIGN_WIDTH, CANVAS_DESIGN_HEIGHT } from '@/pages/Editor/components/Canvas/config';
import styles from './MiniElementPreview.module.css';

interface MiniElementPreviewProps {
  element: ElementData;
}

/**
 * Renders a single element preview scaled to fit the chip thumbnail container.
 * Reuses rendering logic from MiniCanvas but for a single selected element.
 */
export function MiniElementPreview({ element }: MiniElementPreviewProps): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.14);

  // Calculate scale factor based on container and element size
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        // Get element dimensions from style
        const elWidth =
          parseFloat(
            String(element.style?.width || '200')
              .replace('px', '')
              .replace('%', ''),
          ) || 200;
        const elHeight =
          parseFloat(
            String(element.style?.height || '100')
              .replace('px', '')
              .replace('%', ''),
          ) || 100;

        // Handle percentage-based dimensions (relative to canvas)
        const actualWidth = String(element.style?.width).includes('%')
          ? (elWidth / 100) * CANVAS_DESIGN_WIDTH
          : elWidth;
        const actualHeight = String(element.style?.height).includes('%')
          ? (elHeight / 100) * CANVAS_DESIGN_HEIGHT
          : elHeight;

        // Calculate scale to fit element within container with some padding
        const scaleX = (containerWidth * 0.9) / actualWidth;
        const scaleY = (containerHeight * 0.9) / actualHeight;
        setScale(Math.min(scaleX, scaleY, 1)); // Cap at 1 to not enlarge small elements
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [element]);

  return (
    // Plain div: needs ref for ResizeObserver; Easel Box reset would wipe
    // background-color on the container.
    <div ref={containerRef} className={styles.container}>
      {/* Plain div: dynamic scale transform based on measured container size. */}
      <div className={styles.scaleTransform} style={{ transform: `scale(${scale})` }}>
        <ElementPreviewContent element={element} />
      </div>
    </div>
  );
}

/**
 * Renders the content of an element for preview
 */
function ElementPreviewContent({ element }: { element: ElementData }): React.ReactNode {
  const { type, content, style } = element;

  // Get dimensions from style
  const width = style?.width ?? 200;
  const height = style?.height ?? 100;

  // Extract visual styles, excluding positioning
  const {
    top: _top,
    left: _left,
    zIndex: _zIndex,
    transform: _transform,
    position: _position,
    ...visualStyle
  } = (style ?? {}) as Record<string, unknown>;

  const baseStyle: React.CSSProperties = {
    width,
    height,
    ...visualStyle,
  };

  switch (type) {
    case 'text':
      return (
        // Plain div: dangerouslySetInnerHTML + spread visual style from element data
        // — every property is dynamic; Easel Box would wipe them.
        <div
          style={{
            ...baseStyle,
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
      );

    case 'shape':
      return (
        // Plain div: spreads dynamic per-element visualStyle (backgroundColor,
        // borderRadius) and baseStyle (dynamic width/height).
        <div
          style={{
            ...baseStyle,
            backgroundColor: (visualStyle.backgroundColor as string) ?? '#7c3aed',
            borderRadius: (visualStyle.borderRadius as number) ?? 0,
          }}
        >
          {content && (
            // Plain div: dangerouslySetInnerHTML + dynamic color/fontSize from
            // element visualStyle; Easel Box would wipe those.
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: (visualStyle.color as string) ?? '#ffffff',
                fontSize: (visualStyle.fontSize as number) ?? 16,
                overflow: 'hidden',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      );

    case 'image':
      return (
        // Plain div: per-element backgroundImage + size/position/radius from
        // visualStyle; Easel Box would wipe background.
        <div
          style={{
            ...baseStyle,
            backgroundImage: visualStyle.backgroundImage as string,
            backgroundSize: (visualStyle.backgroundSize as string) ?? 'cover',
            backgroundPosition: (visualStyle.backgroundPosition as string) ?? 'center',
            backgroundRepeat: 'no-repeat',
            borderRadius: (visualStyle.borderRadius as number) ?? 0,
          }}
        />
      );

    case 'video':
      return (
        // Plain div: dynamic width/height from baseStyle; static bg/color fixed
        // to #1a1a2e cannot be safely moved without color wiping on Easel Box.
        <div
          style={{
            ...baseStyle,
            backgroundColor: '#1a1a2e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '10px',
          }}
        >
          Video
        </div>
      );

    case 'html':
      return (
        // Plain div: dynamic baseStyle width/height + static f0 bg; Easel Box
        // would wipe backgroundColor.
        <div
          style={{
            ...baseStyle,
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          HTML
        </div>
      );

    default:
      return null;
  }
}

export default MiniElementPreview;
