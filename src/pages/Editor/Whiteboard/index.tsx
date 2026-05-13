import React, { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Box } from '@canva/easel';
import styles from './whiteboard.module.css';
import { useAppContext } from '@/hooks/useAppContext';
import TextObject from '@/pages/Editor/components/Objects/TextObject';
import ShapeTextObject from '@/pages/Editor/components/Objects/ShapeTextObject';
import type { PageObjectsState } from '@/types';

export interface WhiteboardDoctypeProps {
  viewMode: 'thumbnails' | 'continuous' | 'grid';
  currentPage: number;
  totalPages: number;
  zoomPercent: number;
  onZoomChange: (p: number) => void;
  onFit: () => void;
  onFill: () => void;
  onPageChange: (p: number) => void;
  onAddPage: () => void;
  canvasScrollRef?: RefObject<HTMLDivElement>;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  onToggleViewMode: () => void;
  isMobile?: boolean;
}

export default function WhiteboardDoctype(props: WhiteboardDoctypeProps): React.ReactNode {
  const CONTENT_SIZE = 8000; // Large surface to simulate expansive board
  const { state, setObjectPosition, setObjectSize, setObjectContent, setSelection } =
    useAppContext();

  const localViewportRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState<string>('#1e66ff');
  const [drawWidth, setDrawWidth] = useState<number>(3);

  const { canvasScrollRef } = props;

  // Use a callback ref to drive both our local ref and the upstream canvasScrollRef
  const setViewportRef = (node: HTMLDivElement | null) => {
    localViewportRef.current = node;
    if (canvasScrollRef) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (canvasScrollRef as any).current = node;
    }
  };

  const { isMobile = false } = props;
  const mobileScale = 0.35;

  useEffect(() => {
    const viewport = localViewportRef.current;
    if (!viewport) return;
    if (isMobile) {
      const scaledCenter = (CONTENT_SIZE * mobileScale) / 2;
      viewport.scrollLeft = scaledCenter - viewport.clientWidth / 2;
      viewport.scrollTop = scaledCenter - viewport.clientHeight / 2;
    } else {
      viewport.scrollLeft = CONTENT_SIZE / 2 - viewport.clientWidth / 2;
      viewport.scrollTop = CONTENT_SIZE / 2 - viewport.clientHeight / 2;
    }
  }, [isMobile]);

  useEffect(() => {
    const onToolChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { toolId: string };
      if (detail.toolId !== 'draw') {
        setIsDrawing(false);
      }
    };
    const onDrawSettings = (e: Event) => {
      const detail = (e as CustomEvent).detail as { color?: string; width?: number };
      if (detail.color) setDrawColor(detail.color);
      if (typeof detail.width === 'number') setDrawWidth(detail.width);
    };
    window.addEventListener('toolchange', onToolChange as EventListener);
    window.addEventListener('drawsettingschange', onDrawSettings as EventListener);
    return () => {
      window.removeEventListener('toolchange', onToolChange as EventListener);
      window.removeEventListener('drawsettingschange', onDrawSettings as EventListener);
    };
  }, []);

  const getSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const screenCTM = svg.getScreenCTM();
    if (!screenCTM) return { x: 0, y: 0 };
    const transformed = pt.matrixTransform(screenCTM.inverse());
    return { x: transformed.x, y: transformed.y };
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setIsDrawing(true);
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x} ${y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', drawColor);
    path.setAttribute('stroke-width', String(drawWidth));
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    pathRef.current = path;
    svgRef.current?.appendChild(path);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDrawing || !pathRef.current) return;
    const { x, y } = getSvgPoint(e.clientX, e.clientY);
    const d = pathRef.current.getAttribute('d') || '';
    pathRef.current.setAttribute('d', `${d} L ${x} ${y}`);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    pathRef.current = null;
  };

  return (
    <Box className={styles.canvasArea}>
      <div
        ref={setViewportRef}
        className={styles.canvasScroll}
        onClick={() => {
          setSelection('none', null);
        }}
      >
        <div
          className={styles.contentWrapper}
          style={
            isMobile
              ? {
                  width: CONTENT_SIZE * mobileScale,
                  height: CONTENT_SIZE * mobileScale,
                }
              : { width: CONTENT_SIZE, height: CONTENT_SIZE }
          }
        >
          <div
            className={isMobile ? styles.scaledLayer : undefined}
            style={
              isMobile
                ? {
                    width: CONTENT_SIZE,
                    height: CONTENT_SIZE,
                    transform: `scale(${mobileScale})`,
                  }
                : { width: CONTENT_SIZE, height: CONTENT_SIZE }
            }
          >
            <div
              className={styles.gridContent}
              style={{ width: CONTENT_SIZE, height: CONTENT_SIZE }}
            />
            {(() => {
              const docPages = state.objectsByDoctype?.whiteboard ?? {};
              const pageState: PageObjectsState | undefined = docPages[1];
              const textState = pageState?.text;
              const shapeState = pageState?.shape;
              const defaultTextPos = { x: CONTENT_SIZE / 2, y: CONTENT_SIZE / 2 - 200 };
              const defaultShapePos = { x: CONTENT_SIZE / 2, y: CONTENT_SIZE / 2 + 160 };
              return (
                <>
                  <TextObject
                    text={textState?.content ?? 'Add a heading'}
                    position={textState?.position ?? defaultTextPos}
                    onPositionChange={pos => setObjectPosition('whiteboard', 1, 'text', pos)}
                    scale={1}
                    getCanvasEl={() => localViewportRef.current}
                    canvasWidth={CONTENT_SIZE}
                    canvasHeight={CONTENT_SIZE}
                    size={textState?.size}
                    onSizeChange={size => setObjectSize('whiteboard', 1, 'text', size)}
                  />
                  <ShapeTextObject
                    position={shapeState?.position ?? defaultShapePos}
                    onPositionChange={pos => setObjectPosition('whiteboard', 1, 'shape', pos)}
                    scale={1}
                    getCanvasEl={() => localViewportRef.current}
                    canvasWidth={CONTENT_SIZE}
                    canvasHeight={CONTENT_SIZE}
                    initialText={''}
                    size={shapeState?.size}
                    onSizeChange={size => setObjectSize('whiteboard', 1, 'shape', size)}
                    content={shapeState?.content}
                    onContentChange={next => setObjectContent('whiteboard', 1, 'shape', next)}
                  />
                </>
              );
            })()}
            <svg
              ref={svgRef}
              className={styles.drawOverlay}
              width={CONTENT_SIZE}
              height={CONTENT_SIZE}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            />
          </div>
        </div>
      </div>
    </Box>
  );
}
