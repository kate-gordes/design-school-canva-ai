import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Text, Spacer, Button, Columns, Column } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import CanvasElement from '@/pages/Editor/components/CanvasElement';
import SelectionBox from '@/pages/Editor/components/SelectionBox';
import AIEditingBadge from '@/pages/Editor/components/AIEditingBadge';
import {
  activeCanvas,
  activeCanvasId,
  canvases,
  handleElementSelect,
  selectedElementId,
  selectedElementIds,
  selectedPageId,
  clearSelection,
  setMultiSelection,
  selectPage,
  setZoom,
  aiEditingPages,
} from '@/store';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CopyIcon,
  TrashIcon,
  CopyPlusIcon,
} from '@canva/easel/icons';
import styles from './Canvas.module.css';
import {
  CANVAS_DESIGN_WIDTH,
  CANVAS_DESIGN_HEIGHT,
  CANVAS_CALIBRATION,
} from '@/pages/Editor/components/Canvas/config';
import type { Doctype } from '@/types';

type EaselSpace = '0' | '0.25u' | '0.5u' | '1u' | '1.5u' | '2u' | '3u' | '4u' | '6u' | '8u' | '12u';
type PxSpace = `${number}px`;

interface CanvasProps {
  doctype: Doctype;
  currentPage?: number;
  onActivate?: () => void;
  onDeactivate?: () => void;
  zoomPercent?: number;
  totalPages?: number;
  viewMode?: 'thumbnails' | 'continuous';
  onPageChange?: (pageNumber: number) => void;
  onAddPage?: () => void;
  designWidth?: number;
  designHeight?: number;
  contentAlign?: 'center' | 'topLeft';
  showPageHeaderControls?: boolean;
  renderContent?: (pageIndex: number) => React.ReactNode;
  contentPadding?: EaselSpace | PxSpace;
  showSelectionRing?: boolean;
  rounded?: boolean;
  suppressSelectionInsideContent?: boolean;
  disableWheelPaging?: boolean;
  shrinkWrap?: boolean;
}

export default function Canvas({
  doctype,
  currentPage = 1,
  onActivate,
  onDeactivate,
  zoomPercent = 100,
  totalPages = 1,
  viewMode = 'thumbnails',
  onPageChange,
  onAddPage,
  designWidth: overrideDesignWidth,
  designHeight: overrideDesignHeight,
  contentAlign = 'center',
  showPageHeaderControls = true,
  renderContent,
  contentPadding,
  showSelectionRing = true,
  rounded = false,
  suppressSelectionInsideContent = false,
  disableWheelPaging = false,
  shrinkWrap = false,
}: CanvasProps): React.ReactNode {
  useSignals();

  const isPx = (value: EaselSpace | PxSpace | undefined): value is PxSpace =>
    typeof value === 'string' && value.endsWith('px');

  const [isHovered, setIsHovered] = useState(false);
  const [hoveredPageIndex, setHoveredPageIndex] = useState<number | null>(null);
  const [activePageIndex, setActivePageIndex] = useState<number | null>(null);
  const [contentHoverPageIndex, setContentHoverPageIndex] = useState<number | null>(null);

  // Multi-selection drag state
  const [isDragSelecting, setIsDragSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionCurrent, setSelectionCurrent] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasInnerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wheelAccumRef = useRef<number>(0);
  const lastWheelChangeTsRef = useRef<number>(0);

  // Sync activeCanvasId with currentPage for presentations
  useEffect(() => {
    if (doctype !== 'presentation') return;
    const canvas = canvases.value[currentPage - 1];
    if (canvas && activeCanvasId.value !== canvas.canvasId) {
      activeCanvasId.value = canvas.canvasId;
    }
  }, [currentPage, doctype]);

  // Sync zoom with signals store for presentations
  useEffect(() => {
    if (doctype === 'presentation') {
      setZoom(zoomPercent);
    }
  }, [zoomPercent, doctype]);

  // Get current canvas data (only for presentations)
  const currentCanvas = doctype === 'presentation' ? activeCanvas.value : null;
  const elements = currentCanvas?.elements || [];

  const handlePageClick = useCallback(
    (index?: number) => {
      if (typeof index === 'number') {
        setActivePageIndex(index);
      }
      if (doctype === 'presentation') {
        clearSelection();
        selectPage(activeCanvasId.value);
      } else {
        // For non-presentation, clear any element selection
        if (onActivate) onActivate();
      }
    },
    [doctype, onActivate],
  );

  // Handle element click for selection
  const handleCanvasElementClick = useCallback(
    (elementId: string, elementType: string) => (event: React.MouseEvent) => {
      event.stopPropagation();
      handleElementSelect(elementType, elementId);
    },
    [],
  );

  // Multi-selection drag handlers (presentation only)
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only start drag selection if clicking on canvas background
      if ((e.target as HTMLElement).closest('[data-element-id]')) {
        return;
      }

      handlePageClick();

      if (doctype === 'presentation') {
        const rect = canvasInnerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          setSelectionStart({ x, y });
          setSelectionCurrent({ x, y });
          setIsDragSelecting(true);
        }
      }
    },
    [handlePageClick, doctype],
  );

  // Track mouse movement during drag selection
  useEffect(() => {
    if (!isDragSelecting) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasInnerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setSelectionCurrent({ x, y });
      }
    };

    const handleMouseUp = () => {
      if (isDragSelecting) {
        const minX = Math.min(selectionStart.x, selectionCurrent.x);
        const maxX = Math.max(selectionStart.x, selectionCurrent.x);
        const minY = Math.min(selectionStart.y, selectionCurrent.y);
        const maxY = Math.max(selectionStart.y, selectionCurrent.y);

        if (maxX - minX > 5 && maxY - minY > 5) {
          const selectedIds: string[] = [];

          elements.forEach(element => {
            const elLeft = parseInt(String(element.style?.left || '0'));
            const elTop = parseInt(String(element.style?.top || '0'));
            const elWidth = parseInt(String(element.style?.width || '100'));
            const elHeight = parseInt(String(element.style?.height || '100'));

            const intersects =
              elLeft < maxX && elLeft + elWidth > minX && elTop < maxY && elTop + elHeight > minY;

            if (intersects) {
              selectedIds.push(element.elementId);
            }
          });

          if (selectedIds.length > 0) {
            setMultiSelection(selectedIds);
          }
        }

        setIsDragSelecting(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragSelecting, selectionStart, selectionCurrent, elements]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const getCanvasClassName = () => `${styles.canvas} ${rounded ? styles.rounded : ''}`;

  const designWidth = overrideDesignWidth ?? CANVAS_DESIGN_WIDTH;
  const designHeight = overrideDesignHeight ?? CANVAS_DESIGN_HEIGHT;

  const finalScale = Math.max(0.1, ((zoomPercent ?? 100) / 100) * CANVAS_CALIBRATION);

  const [animatedScale, setAnimatedScale] = useState<number>(finalScale);
  const scaleRafRef = useRef<number | null>(null);
  const currentScaleRef = useRef<number>(finalScale);
  const targetScaleRef = useRef<number>(finalScale);

  useEffect(() => {
    targetScaleRef.current = finalScale;
    if (scaleRafRef.current !== null) return;

    const animate = () => {
      const current = currentScaleRef.current;
      const target = targetScaleRef.current;
      const delta = target - current;
      const next = current + delta * 0.22;

      if (Math.abs(delta) < 0.0005) {
        currentScaleRef.current = target;
        setAnimatedScale(target);
        scaleRafRef.current = null;
        return;
      }

      currentScaleRef.current = next;
      setAnimatedScale(next);
      scaleRafRef.current = requestAnimationFrame(animate);
    };

    scaleRafRef.current = requestAnimationFrame(animate);

    return () => {
      if (scaleRafRef.current !== null) {
        cancelAnimationFrame(scaleRafRef.current);
        scaleRafRef.current = null;
      }
    };
  }, [finalScale]);

  // Thumbnail mode wheel paging
  useEffect(() => {
    if (viewMode !== 'thumbnails' || disableWheelPaging) return;
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      wheelAccumRef.current += e.deltaY;

      const threshold = 120;
      const cooldownMs = 120;

      if (
        Math.abs(wheelAccumRef.current) >= threshold
        && now - lastWheelChangeTsRef.current >= cooldownMs
      ) {
        const direction = wheelAccumRef.current > 0 ? 1 : -1;
        const next = Math.min(Math.max(1, currentPage + direction), totalPages);
        if (next !== currentPage && onPageChange) {
          onPageChange(next);
        }
        wheelAccumRef.current = 0;
        lastWheelChangeTsRef.current = now;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as unknown as EventListener);
  }, [viewMode, currentPage, totalPages, onPageChange, disableWheelPaging]);

  // Continuous mode scroll tracking
  useEffect(() => {
    if (viewMode !== 'continuous') return;
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      let bestIndex = currentPage - 1;
      let bestDist = Number.POSITIVE_INFINITY;
      pageRefs.current.forEach((node, idx) => {
        if (!node) return;
        const r = node.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - centerY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = idx;
        }
      });
      const newPage = bestIndex + 1;
      if (newPage !== currentPage && onPageChange) {
        onPageChange(newPage);
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll as unknown as EventListener);
  }, [viewMode, currentPage, onPageChange]);

  if (viewMode === 'continuous') {
    const scaledWidth = designWidth * animatedScale;
    const scaledHeight = designHeight * animatedScale;
    const thresholdScale = 0.13 * CANVAS_CALIBRATION;
    const headerScale = Math.max(animatedScale, thresholdScale);
    const headerWidth = designWidth * headerScale;

    return (
      <Box className={styles.wrapper} alignItems="center">
        <Box ref={containerRef} width="full" height="full" paddingY="2u" paddingBottom="6u">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageCanvas = doctype === 'presentation' ? canvases.value[i] : null;
            const pageElements = pageCanvas?.elements || [];
            const pageBg = pageCanvas?.color;

            return (
              <Box key={i} display="flex" flexDirection="column" justifyContent="start">
                {i > 0 && <Spacer size="2u" />}
                {showPageHeaderControls && (
                  <Box display="flex" justifyContent="center">
                    {/* Plain div: dynamic header width tied to canvas scale (kept inline). */}
                    <div style={{ width: headerWidth }}>
                      <Columns alignY="center" spacing="0">
                        <Column width="fluid">
                          <Columns alignY="center" spacing="1u">
                            <Column width="content">
                              <Text size="medium" weight="bold">
                                Page {i + 1}
                              </Text>
                            </Column>
                            <Column width="content">
                              <Text size="medium" tone="secondary">
                                Add page title
                              </Text>
                            </Column>
                          </Columns>
                        </Column>
                        <Column width="content">
                          <Box display="flex" alignItems="center" className={styles.pageControls}>
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={ChevronUpIcon}
                              ariaLabel="Move up"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={ChevronDownIcon}
                              ariaLabel="Move down"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={EyeSlashIcon}
                              ariaLabel="Hide page"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={LockClosedIcon}
                              ariaLabel="Lock page"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={CopyIcon}
                              ariaLabel="Copy page"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={TrashIcon}
                              ariaLabel="Delete page"
                            />
                            <Spacer size="0.5u" />
                            <Button
                              variant="tertiary"
                              size="tiny"
                              icon={CopyPlusIcon}
                              ariaLabel="Add page after"
                            />
                          </Box>
                        </Column>
                      </Columns>
                    </div>
                  </Box>
                )}
                <Spacer size="1u" />
                <Box display="flex" justifyContent="center">
                  {/* Plain div: dynamic pixel width/height from animated canvas scale. */}
                  <div
                    ref={node => (pageRefs.current[i] = node)}
                    className={styles.continuousPageFrame}
                    style={{
                      width: scaledWidth,
                      height: scaledHeight,
                    }}
                  >
                    {/* Plain div: dynamic transform/scale + optional per-page background color
                        (Easel Box's reset_f88b8e would wipe the background). */}
                    <div
                      className={getCanvasClassName()}
                      style={{
                        width: designWidth,
                        height: designHeight,
                        transform: `translateZ(0) scale(${animatedScale})`,
                        transformOrigin: contentAlign === 'topLeft' ? 'top left' : 'center center',
                        ['--canvasScale' as unknown as string]: animatedScale,
                        ...(pageBg ? { backgroundColor: pageBg } : {}),
                      }}
                      onClick={() => handlePageClick(i)}
                      onMouseEnter={() => setHoveredPageIndex(i)}
                      onMouseLeave={() => setHoveredPageIndex(prev => (prev === i ? null : prev))}
                    >
                      {isPx(contentPadding) ? (
                        // Plain div: dynamic px padding + conditional pointer-events.
                        <div
                          style={{
                            padding: contentPadding,
                            pointerEvents: pageElements.length > 0 ? 'none' : undefined,
                          }}
                        >
                          <div className={styles.contentArea}>
                            {renderContent ? <>{renderContent(i)}</> : null}
                          </div>
                        </div>
                      ) : (
                        // Plain div: conditional pointer-events composed with .contentArea.
                        <div
                          className={styles.contentArea}
                          style={{ pointerEvents: pageElements.length > 0 ? 'none' : undefined }}
                        >
                          {renderContent ? <>{renderContent(i)}</> : null}
                        </div>
                      )}
                      {pageElements.length > 0 && (
                        <div className={styles.elementsLayer}>
                          {pageElements.map(element => (
                            <CanvasElement
                              key={element.elementId}
                              type={element.type}
                              elementId={element.elementId}
                              style={element.style}
                              content={element.content}
                              htmlContent={element.htmlContent}
                              isSelected={
                                selectedElementId.value === element.elementId
                                || selectedElementIds.value.has(element.elementId)
                              }
                              onClick={handleCanvasElementClick(element.elementId, element.type)}
                              canvasScale={animatedScale}
                              pendingImagePrompt={element.pendingImagePrompt}
                              imageGenerationStatus={element.imageGenerationStatus}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {showSelectionRing && (
                      <div
                        className={`${styles.selectionRing} ${
                          hoveredPageIndex === i
                          && (!suppressSelectionInsideContent || contentHoverPageIndex !== i)
                            ? styles.hovered
                            : ''
                        }`}
                        style={{ ['--canvasScale' as unknown as string]: animatedScale }}
                      />
                    )}
                  </div>
                </Box>
              </Box>
            );
          })}
          <Spacer size="2u" />
          <Box display="flex" justifyContent="center">
            {/* Plain div: dynamic width matches the scaled page width. */}
            <div style={{ width: designWidth * animatedScale }}>
              <Button
                variant="secondary"
                size="small"
                onClick={onAddPage}
                ariaLabel="Add page"
                stretch
              >
                + Add page
              </Button>
            </div>
          </Box>
        </Box>
      </Box>
    );
  }

  // Thumbnail mode single page
  const baseWrapperClass = shrinkWrap ? styles.wrapperShrink : styles.wrapper;
  const wrapperClass = `${baseWrapperClass} ${
    contentAlign === 'topLeft' ? styles.topLeft : styles.centered
  }`;

  const containerElement = (
    // Plain div: dynamic width/height from scaled canvas + data-canvas-wrapper hook for
    // global box-shadow selector in Canvas.module.css.
    <div
      ref={containerRef}
      data-canvas-wrapper
      className={contentAlign === 'topLeft' ? styles.thumbFrameTopLeft : styles.thumbFrameCentered}
      style={{
        width: designWidth * animatedScale,
        height: designHeight * animatedScale,
      }}
    >
      {/* Plain div: dynamic transform/scale + optional canvas background color
          (Easel Box's reset_f88b8e would wipe the backgroundColor). */}
      <div
        ref={canvasInnerRef}
        className={`${getCanvasClassName()} canvas-container`}
        onMouseDown={handleCanvasMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: designWidth,
          height: designHeight,
          transform: `translateZ(0) scale(${animatedScale})`,
          transformOrigin: contentAlign === 'topLeft' ? 'top left' : 'center center',
          ...(currentCanvas?.color ? { backgroundColor: currentCanvas.color } : {}),
        }}
      >
        {/* Content area (renderContent for Document, etc.) */}
        {isPx(contentPadding) ? (
          // Plain div: dynamic px padding + conditional pointer-events.
          <div
            style={{
              padding: contentPadding,
              pointerEvents: elements.length > 0 ? 'none' : undefined,
            }}
          >
            <div
              className={styles.contentArea}
              onMouseEnter={
                suppressSelectionInsideContent
                  ? () => setContentHoverPageIndex(currentPage - 1)
                  : undefined
              }
              onMouseLeave={
                suppressSelectionInsideContent
                  ? () => setContentHoverPageIndex(prev => (prev === currentPage - 1 ? null : prev))
                  : undefined
              }
              onClick={suppressSelectionInsideContent ? e => e.stopPropagation() : undefined}
            >
              {renderContent ? <>{renderContent(currentPage - 1)}</> : null}
            </div>
          </div>
        ) : (
          // Plain div: conditional pointer-events composed with .contentArea.
          <div
            className={styles.contentArea}
            style={{ pointerEvents: elements.length > 0 ? 'none' : undefined }}
            onMouseEnter={
              suppressSelectionInsideContent
                ? () => setContentHoverPageIndex(currentPage - 1)
                : undefined
            }
            onMouseLeave={
              suppressSelectionInsideContent
                ? () => setContentHoverPageIndex(prev => (prev === currentPage - 1 ? null : prev))
                : undefined
            }
            onClick={suppressSelectionInsideContent ? e => e.stopPropagation() : undefined}
          >
            {renderContent ? <>{renderContent(currentPage - 1)}</> : null}
          </div>
        )}

        {/* Elements layer (presentation only) */}
        {elements.length > 0 && (
          <div className={styles.elementsLayer}>
            {elements.map(element => (
              <CanvasElement
                key={element.elementId}
                type={element.type}
                elementId={element.elementId}
                style={element.style}
                content={element.content}
                htmlContent={element.htmlContent}
                isSelected={
                  selectedElementId.value === element.elementId
                  || selectedElementIds.value.has(element.elementId)
                }
                onClick={handleCanvasElementClick(element.elementId, element.type)}
                canvasScale={animatedScale}
                pendingImagePrompt={element.pendingImagePrompt}
                imageGenerationStatus={element.imageGenerationStatus}
              />
            ))}
          </div>
        )}

        {/* Drag selection box */}
        {isDragSelecting && (
          <SelectionBox
            startX={selectionStart.x}
            startY={selectionStart.y}
            currentX={selectionCurrent.x}
            currentY={selectionCurrent.y}
          />
        )}

        {/* Canvas-level AI editing badge */}
        {doctype === 'presentation' && aiEditingPages.value.has(activeCanvasId.value) && (
          <AIEditingBadge position="canvas" canvasScale={animatedScale} />
        )}
      </div>

      {showSelectionRing && (
        <div
          className={`${styles.selectionRing} ${
            doctype === 'presentation'
              ? aiEditingPages.value.has(activeCanvasId.value)
                ? styles.aiEditing
                : selectedPageId.value === activeCanvasId.value
                  ? styles.active
                  : isHovered
                      && (!suppressSelectionInsideContent
                        || contentHoverPageIndex !== currentPage - 1)
                    ? styles.hovered
                    : ''
              : isHovered
                  && (!suppressSelectionInsideContent || contentHoverPageIndex !== currentPage - 1)
                ? styles.hovered
                : ''
          }`}
        />
      )}
    </div>
  );

  if (shrinkWrap) {
    return containerElement;
  }

  return <Box className={wrapperClass as string}>{containerElement}</Box>;
}
