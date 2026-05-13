import React, { useRef, useState, useLayoutEffect } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { canvases, type ElementData, type CanvasData } from '@/store';
import { CANVAS_DESIGN_WIDTH, CANVAS_DESIGN_HEIGHT } from '@/pages/Editor/components/Canvas/config';
import type { Doctype } from '@/types';
import styles from './MiniCanvas.module.css';

interface MiniCanvasProps {
  pageNumber: number;
  doctype: Doctype;
  canvasData?: CanvasData;
}

export function MiniCanvas({ pageNumber, doctype, canvasData }: MiniCanvasProps): React.ReactNode {
  // Enable signals reactivity
  useSignals();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.14); // Default scale
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Use actual canvas dimensions when available (e.g. fixed-design pages)
  const canvas = canvasData ?? canvases.value[pageNumber - 1];
  const canvasWidth = canvas?.width ?? CANVAS_DESIGN_WIDTH;
  const canvasHeight = canvas?.height ?? CANVAS_DESIGN_HEIGHT;
  const isCustomSize = canvas?.width != null || canvas?.height != null;

  // Calculate scale factor and centering offset based on container size
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        // Calculate scale to fit canvas within container
        const scaleX = containerWidth / canvasWidth;
        const scaleY = containerHeight / canvasHeight;
        const newScale = Math.min(scaleX, scaleY);
        setScale(newScale);
        // Center the scaled canvas within the container
        setOffset({
          x: (containerWidth - canvasWidth * newScale) / 2,
          y: (containerHeight - canvasHeight * newScale) / 2,
        });
      }
    };

    updateScale();

    // Update on resize
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [canvasWidth, canvasHeight]);

  // Doc pages get a simplified text preview instead of canvas element rendering
  if (canvas?.docType === 'doc') {
    return <MiniDocPreview canvas={canvas} />;
  }

  // Website pages get a branded mini preview
  if (canvas?.docType === 'website') {
    return <MiniWebsitePreview canvas={canvas} />;
  }

  const elements = canvas?.elements ?? [];

  // Sort by zIndex (stored in style.zIndex)
  const sortedElements = [...elements].sort((a, b) => {
    const aZ = typeof a.style?.zIndex === 'number' ? a.style.zIndex : 0;
    const bZ = typeof b.style?.zIndex === 'number' ? b.style.zIndex : 0;
    return aZ - bZ;
  });

  return (
    // Plain div: ResizeObserver ref + per-canvas dynamic backgroundColor;
    // Easel Box reset would wipe the background.
    <div
      ref={containerRef}
      className={styles.viewport}
      style={{ backgroundColor: isCustomSize ? '#e8e8e8' : (canvas?.color ?? '#ffffff') }}
    >
      {/* Plain div: scaled canvas content layer; width/height/backgroundColor
          + dynamic transform scale + computed top/left from measured container. */}
      <div
        className={styles.scaledContent}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          backgroundColor: canvas?.color ?? '#ffffff',
          transform: `scale(${scale})`,
          top: offset.y,
          left: offset.x,
        }}
      >
        {/* Render each element */}
        {sortedElements.map(element => (
          <MiniElement key={element.elementId} element={element} />
        ))}
      </div>
    </div>
  );
}

/**
 * Scale-based doc preview: renders text at readable sizes inside a large
 * virtual page, then scales the whole thing down.
 */
const DOC_VIRTUAL_WIDTH = 680;
const DOC_VIRTUAL_HEIGHT = 480;

function MiniDocPreview({ canvas }: { canvas: CanvasData }): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [docScale, setDocScale] = useState(0.167);
  const [docOffset, setDocOffset] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const cw = containerRef.current.offsetWidth;
        const ch = containerRef.current.offsetHeight;
        const pad = 8;
        const sx = (cw - pad * 2) / DOC_VIRTUAL_WIDTH;
        const sy = (ch - pad * 2) / DOC_VIRTUAL_HEIGHT;
        const s = Math.min(sx, sy);
        setDocScale(s);
        setDocOffset({
          x: (cw - DOC_VIRTUAL_WIDTH * s) / 2,
          y: (ch - DOC_VIRTUAL_HEIGHT * s) / 2,
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const visibleBlocks = (canvas.blocks ?? []).slice(0, 20);

  const getFontSize = (blockType: string) => {
    switch (blockType) {
      case 'h1':
        return 28;
      case 'h2':
        return 22;
      case 'h3':
        return 18;
      default:
        return 14;
    }
  };

  const getFontWeight = (blockType: string) => {
    switch (blockType) {
      case 'h1':
        return 700;
      case 'h2':
        return 600;
      case 'h3':
        return 600;
      default:
        return 400;
    }
  };

  return (
    // Plain div: ResizeObserver ref + fixed page bg; Easel Box would wipe bg.
    <div ref={containerRef} className={styles.viewport} style={{ backgroundColor: '#e8e8e8' }}>
      {/* Plain div: scaled doc card; dynamic transform scale and top/left
          offsets computed from measured container. */}
      <div
        className={styles.docPage}
        style={{
          width: DOC_VIRTUAL_WIDTH,
          height: DOC_VIRTUAL_HEIGHT,
          backgroundColor: '#ffffff',
          transform: `scale(${docScale})`,
          top: docOffset.y,
          left: docOffset.x,
        }}
      >
        {visibleBlocks.map((block, i) => (
          // Plain div: per-block dynamic font-size/weight/color/margin.
          <div
            key={i}
            className={styles.docBlock}
            style={{
              fontSize: getFontSize(block.blockType),
              fontWeight: getFontWeight(block.blockType),
              color: block.blockType.startsWith('h') ? '#1a1a1a' : '#555',
              marginTop: block.blockType === 'h1' ? 8 : block.blockType === 'h2' ? 6 : 0,
            }}
          >
            {block.markdown || '\u00A0'}
          </div>
        ))}
        {visibleBlocks.length === 0 && (
          <>
            {Array.from({ length: 8 }, (_, i) => (
              // Plain div: per-index dynamic marginTop for cascading rows.
              <div
                key={i}
                className={styles.docBlockEmpty}
                style={{ marginTop: i === 0 ? 12 : 8 }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Simplified website/interactive-page preview for thumbnails.
 */
function MiniWebsitePreview({ canvas }: { canvas: CanvasData }): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wsScale, setWsScale] = useState(0.12);
  const [wsOffset, setWsOffset] = useState({ x: 0, y: 0 });

  const WS_VIRTUAL_WIDTH = 800;
  const WS_VIRTUAL_HEIGHT = 560;

  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const cw = containerRef.current.offsetWidth;
        const ch = containerRef.current.offsetHeight;
        const pad = 4;
        const sx = (cw - pad * 2) / WS_VIRTUAL_WIDTH;
        const sy = (ch - pad * 2) / WS_VIRTUAL_HEIGHT;
        const s = Math.min(sx, sy);
        setWsScale(s);
        setWsOffset({
          x: (cw - WS_VIRTUAL_WIDTH * s) / 2,
          y: (ch - WS_VIRTUAL_HEIGHT * s) / 2,
        });
      }
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    // Plain div: ResizeObserver ref + per-canvas dynamic bg color; Easel Box
    // would wipe the background.
    <div
      ref={containerRef}
      className={styles.viewport}
      style={{ backgroundColor: canvas.color ?? '#E9E1FB' }}
    >
      {/* Plain div: scaled website page; dynamic bg + transform scale + offsets. */}
      <div
        className={styles.websitePage}
        style={{
          width: WS_VIRTUAL_WIDTH,
          height: WS_VIRTUAL_HEIGHT,
          backgroundColor: canvas.color ?? '#E9E1FB',
          transform: `scale(${wsScale})`,
          top: wsOffset.y,
          left: wsOffset.x,
        }}
      >
        <div className={styles.websiteTagline}>You're Invited</div>
        <div className={styles.websiteTitle}>Jacaranda</div>
        <div className={styles.websiteTitle}>Opening Party</div>
        <div className={styles.websiteMetaRow}>
          {['\u{1F4C5}', '\u{1F554}', '\u{1F4CD}'].map((emoji, i) => (
            <div key={i} className={styles.websiteMetaPill}>
              {emoji}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Simplified element renderer for thumbnails - no transforms, no editing
 */
function MiniElement({ element }: { element: ElementData }): React.ReactNode {
  const { type, content, style } = element;

  // Extract position from style (elements use style.top/left/width/height)
  const top = style?.top ?? 0;
  const left = style?.left ?? 0;
  const width = style?.width ?? 200;
  const height = style?.height ?? 100;
  const zIndex = style?.zIndex ?? 0;

  // Extract rotation from transform if present
  let rotation = 0;
  const transform = style?.transform as string | undefined;
  if (transform) {
    const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
    if (match) rotation = parseFloat(match[1]);
  }

  const elementStyle: React.CSSProperties = {
    left,
    top,
    width,
    height,
    zIndex: typeof zIndex === 'number' ? zIndex : 0,
    transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
  };

  return (
    // Plain div: per-element dynamic position/size/zIndex/rotation; Easel Box
    // reset would wipe the absolute coordinates.
    <div className={styles.miniElement} style={elementStyle}>
      <MiniElementContent element={element} />
    </div>
  );
}

/**
 * Simplified content renderer for mini elements
 */
function MiniElementContent({ element }: { element: ElementData }): React.ReactNode {
  const { type, content, style, src } = element;

  // Extract only visual styles, excluding positioning properties
  // that are already handled by the parent MiniElement wrapper
  const {
    top: _top,
    left: _left,
    width: _width,
    height: _height,
    zIndex: _zIndex,
    transform: _transform,
    position: _position,
    ...visualStyle
  } = (style ?? {}) as Record<string, unknown>;

  switch (type) {
    case 'text':
      return (
        // Plain div: spreads dynamic visualStyle + dangerouslySetInnerHTML;
        // every property is per-element.
        <div
          className={styles.miniElementContent}
          style={visualStyle}
          dangerouslySetInnerHTML={{ __html: content ?? '' }}
        />
      );
    case 'shape':
      return (
        // Plain div: per-element backgroundColor/borderRadius spread from
        // visualStyle; Easel Box would wipe background.
        <div
          className={styles.miniElementContent}
          style={{
            backgroundColor:
              ((visualStyle as Record<string, unknown>).backgroundColor as string) ?? '#7c3aed',
            borderRadius: ((visualStyle as Record<string, unknown>).borderRadius as number) ?? 0,
            ...visualStyle,
          }}
        >
          {content && (
            // Plain div: dangerouslySetInnerHTML + per-element color/fontSize.
            <div
              className={styles.miniShapeContent}
              style={{
                color: ((visualStyle as Record<string, unknown>).color as string) ?? '#ffffff',
                fontSize: ((visualStyle as Record<string, unknown>).fontSize as number) ?? 16,
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>
      );
    case 'image':
      // Images can use either src prop or backgroundImage in style
      if (src) {
        return (
          <img
            src={src}
            alt=""
            className={styles.miniImage}
            style={{
              borderRadius: ((visualStyle as Record<string, unknown>).borderRadius as number) ?? 0,
            }}
          />
        );
      }
      // Handle backgroundImage from style (common pattern in sample data)
      return (
        // Plain div: per-element backgroundImage + radius; Easel Box wipe loss.
        <div
          className={styles.miniImageBg}
          style={{
            backgroundImage: (visualStyle as Record<string, unknown>).backgroundImage as string,
            backgroundSize:
              ((visualStyle as Record<string, unknown>).backgroundSize as string) ?? 'cover',
            backgroundPosition:
              ((visualStyle as Record<string, unknown>).backgroundPosition as string) ?? 'center',
            borderRadius: ((visualStyle as Record<string, unknown>).borderRadius as number) ?? 0,
          }}
        />
      );
    case 'video':
      return <div className={styles.miniVideo}>Video</div>;
    case 'html':
      return (
        // Plain div: dangerouslySetInnerHTML with static chrome via class.
        <div className={styles.miniHtml} dangerouslySetInnerHTML={{ __html: content ?? '' }} />
      );
    default:
      return null;
  }
}

export default MiniCanvas;
