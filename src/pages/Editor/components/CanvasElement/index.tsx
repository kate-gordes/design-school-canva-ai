import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  handleElementSelect,
  selectedElementId,
  selectedElementIds,
  toggleSelection,
  updateElementProperty,
  getElementLoadingState,
  elementLoadingStates,
  canvases,
  activeCanvasId,
  deleteElement,
  getElementFromCanvases,
  triggerImageGeneration,
  aiEditingElements,
} from '@/store';
import { imageGenerationService } from '@/services/image-generation';
import { useDragToMove } from '@/hooks/transforms/useDragToMove';
import { useResize } from '@/hooks/transforms/useResize';
import { useRotation } from '@/hooks/transforms/useRotation';
import type { Bounds } from '@/utils/transformUtils';
import TextElement from '@/pages/Editor/components/TextElement';
import ResizeHandlesPortal from '@/pages/Editor/components/ResizeHandlesPortal';
import AIEditingBadge from '@/pages/Editor/components/AIEditingBadge';
import useIsMobile from '@/hooks/useIsMobile';
import './CanvasElement.css';

interface CanvasElementProps {
  type: 'image' | 'shape' | 'text' | 'video' | 'html';
  elementId?: string;
  style?: React.CSSProperties;
  content?: string;
  htmlContent?: string;
  onClick?: (event: React.MouseEvent) => void;
  isSelected?: boolean;
  canvasScale?: number;
  // For self-updating image elements
  pendingImagePrompt?: string;
  imageGenerationStatus?: 'pending' | 'generating' | 'completed' | 'error';
}

const CanvasElement: React.FC<CanvasElementProps> = ({
  type,
  elementId,
  style,
  content,
  htmlContent,
  onClick,
  isSelected = false,
  canvasScale = 1,
  pendingImagePrompt,
  imageGenerationStatus,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isEditingText, setIsEditingText] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Reset editing state when selection changes
  useEffect(() => {
    if (!isSelected) {
      setIsEditingText(false);
    }
  }, [isSelected]);

  // Auto-trigger image generation for elements with pending prompts
  // This enables self-updating image elements created by create_slide_with_data
  useEffect(() => {
    if (
      elementId
      && type === 'image'
      && pendingImagePrompt
      && imageGenerationStatus === 'pending'
    ) {
      console.log(`[CanvasElement] Auto-triggering image generation for ${elementId}`);

      // Update status to 'generating' to prevent duplicate triggers
      triggerImageGeneration(elementId, pendingImagePrompt);

      // Find the canvas ID for this element
      const element = getElementFromCanvases(elementId);
      if (element) {
        // Get canvas ID by searching all canvases
        for (const canvas of canvases.value) {
          if (canvas.elements?.some(el => el.elementId === elementId)) {
            // Queue the image generation
            imageGenerationService.queueImageGeneration(
              canvas.canvasId,
              elementId,
              pendingImagePrompt,
            );
            break;
          }
        }
      }
    }
  }, [elementId, type, pendingImagePrompt, imageGenerationStatus]);

  // Extract position and size from style (always pixel values)
  const initialBounds: Bounds = useMemo(() => {
    const topStr = String(style?.top || '0');
    const leftStr = String(style?.left || '0');
    const widthStr = String(style?.width || '200');
    const heightStr = String(style?.height || '100');

    const top = parseInt(topStr) || 0;
    const left = parseInt(leftStr) || 0;
    const width = parseInt(widthStr) || 200;
    const height = parseInt(heightStr) || 100;

    return { x: left, y: top, width, height };
  }, [style?.top, style?.left, style?.width, style?.height]);

  const initialRotation = useMemo(() => {
    const transform = style?.transform as string | undefined;
    if (!transform) return 0;

    const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
    return match ? parseFloat(match[1]) : 0;
  }, [style?.transform]);

  // Get canvas element reference (use ref to keep stable)
  const canvasElementRef = useRef<HTMLElement | null>(null);
  if (!canvasElementRef.current) {
    canvasElementRef.current = document.querySelector('.canvas-container') as HTMLElement;
  }

  // Canvas bounds for constraint (stable reference)
  const canvasBounds = useRef<Bounds>({ x: 0, y: 0, width: 800, height: 600 });
  useEffect(() => {
    const updateCanvasBounds = () => {
      const canvas = canvasElementRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvasBounds.current = { x: 0, y: 0, width: rect.width, height: rect.height };
      }
    };

    updateCanvasBounds();
    window.addEventListener('resize', updateCanvasBounds);

    return () => window.removeEventListener('resize', updateCanvasBounds);
  }, []);

  // Check if this element is being AI-edited (subscribe to signal for reactivity)
  const aiEditingElementsValue = aiEditingElements.value;
  const isAIEditing = elementId ? aiEditingElementsValue.has(elementId) : false;

  // Drag to move hook
  const {
    position: dragPosition,
    isDragging,
    handleMouseDown: handleDragStart,
    handleTouchStart: handleDragTouchStart,
  } = useDragToMove({
    initialPosition: { x: initialBounds.x, y: initialBounds.y },
    elementSize: { width: initialBounds.width, height: initialBounds.height },
    canvasBounds: canvasBounds.current,
    canvasElement: canvasElementRef.current,
    onDragEnd: position => {
      if (!elementId) return;

      // Check for intersection with other image elements to trigger replacement
      const activeCanvas = canvases.value.find(c => c.canvasId === activeCanvasId.value);
      if (activeCanvas && activeCanvas.elements) {
        // Find intersecting element
        const intersectingElement = activeCanvas.elements.find(el => {
          if (el.elementId === elementId) return false; // Skip self
          if (el.type !== 'image') return false; // Only replace images

          // Get element bounds
          const elLeft = parseInt(String(el.style?.left || '0'));
          const elTop = parseInt(String(el.style?.top || '0'));
          const elWidth = parseInt(String(el.style?.width || '200'));
          const elHeight = parseInt(String(el.style?.height || '100'));

          // Check if center of dragged element is within bounds of target element
          const centerX = position.x + initialBounds.width / 2;
          const centerY = position.y + initialBounds.height / 2;

          return (
            centerX >= elLeft
            && centerX <= elLeft + elWidth
            && centerY >= elTop
            && centerY <= elTop + elHeight
          );
        });

        if (intersectingElement) {
          // Perform replacement
          const sourceStyle = style as Record<string, unknown>;
          if (sourceStyle?.backgroundImage) {
            // 1. Update target element with source image content
            updateElementProperty(intersectingElement.elementId, 'style', {
              backgroundImage: sourceStyle.backgroundImage as string,
              backgroundSize: (sourceStyle.backgroundSize as string) || 'cover',
              backgroundPosition: (sourceStyle.backgroundPosition as string) || 'center',
              backgroundRepeat: (sourceStyle.backgroundRepeat as string) || 'no-repeat',
            });

            // 2. Remove the source element from canvas
            deleteElement(elementId);
            return;
          }
        }
      }

      updateElementProperty(elementId, 'style', {
        top: `${position.y}px`,
        left: `${position.x}px`,
      });
    },
    enabled: !selectedElementIds.value.has(elementId || '') && !isEditingText && !isAIEditing,
  });

  // Resize hook
  const {
    bounds: resizeBounds,
    isResizing,
    activeHandle,
    aspectRatioLocked,
    handleResizeStart,
    handleResizeTouchStart,
  } = useResize({
    initialBounds,
    canvasBounds: canvasBounds.current,
    elementRef,
    onResizeEnd: (bounds, handle) => {
      if (!elementId) return;

      const isCorner =
        handle
        && (handle === 'top-left'
          || handle === 'top-right'
          || handle === 'bottom-left'
          || handle === 'bottom-right');

      // Text + corner: scale font size proportionally to the width change and
      // match the box height to the new font so the text fills the box as the
      // user expects. Side handles keep their default width-only behavior
      // (causing text wrap).
      if (type === 'text' && isCorner) {
        const scale = bounds.width / initialBounds.width;
        const fontSizePx =
          typeof style?.fontSize === 'number'
            ? style.fontSize
            : parseFloat(String(style?.fontSize ?? '16'));
        const nextFontSize = Math.max(6, fontSizePx * scale);
        updateElementProperty(elementId, 'style', {
          top: `${bounds.y}px`,
          left: `${bounds.x}px`,
          width: `${bounds.width}px`,
          height: `${initialBounds.height * scale}px`,
          fontSize: `${nextFontSize}px`,
        });
        return;
      }

      updateElementProperty(elementId, 'style', {
        top: `${bounds.y}px`,
        left: `${bounds.x}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
      });
    },
    minSize: { width: 50, height: 30 },
    enabled: isSelected && !isAIEditing,
    // Text corners scale the font: force proportional resize so width/height
    // stay locked to the aspect ratio during drag, and we can derive fontSize
    // from the width change without distortion.
    lockAspectRatio: handle =>
      type === 'text'
      && (handle === 'top-left'
        || handle === 'top-right'
        || handle === 'bottom-left'
        || handle === 'bottom-right'),
  });

  // During a text-corner drag, scale fontSize live so the glyphs grow/shrink
  // with the box instead of snapping only on release.
  const isTextCornerResizing =
    isResizing
    && type === 'text'
    && activeHandle !== null
    && activeHandle !== 'rotate'
    && activeHandle.includes('-');

  // A single "effective" font size used by both the child render and the
  // wrapper's ink-padding calculation. Using the same value in both places
  // prevents the box from snapping when the drag ends (the padding was
  // previously based on the stored font, which lagged the scaled text).
  const effectiveFontSize: number | null = useMemo(() => {
    if (type !== 'text') return null;
    const raw =
      typeof style?.fontSize === 'number'
        ? style.fontSize
        : parseFloat(String(style?.fontSize ?? ''));
    if (!Number.isFinite(raw) || raw <= 0) return null;
    if (!isTextCornerResizing) return raw;
    const scale = resizeBounds.width / initialBounds.width;
    return Math.max(6, raw * scale);
  }, [type, style?.fontSize, isTextCornerResizing, resizeBounds.width, initialBounds.width]);

  const textStyleForChild: React.CSSProperties | undefined = useMemo(() => {
    if (!isTextCornerResizing || !style || effectiveFontSize == null) return style;
    return { ...style, fontSize: `${effectiveFontSize}px` };
  }, [isTextCornerResizing, style, effectiveFontSize]);

  // Rotation hook
  const {
    rotation: rotationAngle,
    isRotating,
    handleRotationStart,
  } = useRotation({
    initialRotation,
    elementBounds: isResizing
      ? resizeBounds
      : isDragging
        ? {
            x: dragPosition.x,
            y: dragPosition.y,
            width: initialBounds.width,
            height: initialBounds.height,
          }
        : initialBounds,
    onRotationEnd: rotation => {
      if (!elementId) return;

      updateElementProperty(elementId, 'style', {
        transform: `rotate(${rotation}deg)`,
      });
    },
    enabled: isSelected,
    snapAngle: 15,
  });

  // Compute override styles during active transforms.
  // Drag uses GPU-composited `translate3d` instead of top/left so the browser
  // skips layout and paint — the selection box and content follow the cursor
  // with no frame lag. Width/height resize can't avoid layout, but we still
  // keep any rotation in the same transform string to avoid re-flowing twice.
  const transformOverride: React.CSSProperties = useMemo(() => {
    const overrides: React.CSSProperties = {};

    const transforms: string[] = [];

    if (isDragging) {
      const dx = dragPosition.x - initialBounds.x;
      const dy = dragPosition.y - initialBounds.y;
      transforms.push(`translate3d(${dx}px, ${dy}px, 0)`);
    } else if (isResizing) {
      overrides.top = `${resizeBounds.y}px`;
      overrides.left = `${resizeBounds.x}px`;
      overrides.width = `${resizeBounds.width}px`;
      overrides.height = `${resizeBounds.height}px`;
    }

    const activeRotation = isRotating ? rotationAngle : initialRotation;
    if (activeRotation !== 0) {
      transforms.push(`rotate(${activeRotation}deg)`);
    }

    if (transforms.length > 0) {
      overrides.transform = transforms.join(' ');
      // Hint the compositor so the drag lives on its own layer.
      if (isDragging || isResizing) {
        overrides.willChange = 'transform';
      }
    }

    return overrides;
  }, [
    isResizing,
    isDragging,
    isRotating,
    resizeBounds,
    dragPosition,
    rotationAngle,
    initialRotation,
    initialBounds.x,
    initialBounds.y,
  ]);

  // Check loading state for this element (subscribe to signal for reactivity)
  const loadingStatesValue = elementLoadingStates.value;
  const loadingState = elementId ? getElementLoadingState(elementId) : null;
  const isLoading = loadingState?.status === 'loading';
  const isEditing = loadingState?.status === 'editing';
  const hasError = loadingState?.status === 'error';
  const newImageUrl = loadingState?.newImageUrl;

  const getImagePath = (): string => {
    switch (type) {
      case 'image':
        return './icons/canvas-icons/image-placeholder.svg';
      case 'shape':
        return './icons/canvas-icons/shape-placeholder.svg';
      case 'text':
        return './icons/canvas-icons/text-placeholder.svg';
      case 'video':
        return './icons/canvas-icons/video-placeholder.svg';
      default:
        return '';
    }
  };

  const handleClick = (event: React.MouseEvent): void => {
    // Check for Cmd (Mac) or Ctrl (Windows/Linux) key for multi-selection
    const isMultiSelectKey = event.metaKey || event.ctrlKey;

    if (isMultiSelectKey && elementId) {
      // Toggle this element in the multi-selection
      event.stopPropagation();
      toggleSelection(elementId);
    } else {
      // Normal single selection behavior
      if (onClick) {
        onClick(event);
      }
    }
  };

  const handleMouseEnter = (): void => {
    setIsHovering(true);
  };

  const handleMouseLeave = (): void => {
    setIsHovering(false);
  };

  const handleDoubleClick = (event: React.MouseEvent) => {
    if (type === 'text') {
      event.stopPropagation();
      setIsEditingText(true);
    }
  };

  // Check if this element is part of a multi-selection
  const isInMultiSelection = elementId ? selectedElementIds.value.has(elementId) : false;
  const isMultiSelected = isInMultiSelection || (isSelected && selectedElementIds.value.size > 1);

  const elementClassName = `canvas-element ${type}-element ${
    isHovering && !isSelected && !isInMultiSelection && !isAIEditing ? 'hovering' : ''
  } ${isSelected || isInMultiSelection ? 'selected' : ''} ${
    isInMultiSelection ? 'multi-selected' : ''
  } ${isAIEditing ? 'ai-editing' : ''}`;

  // For image elements with background images, remove background properties from parent div
  const parentStyle =
    type === 'image' && style?.backgroundImage
      ? (() => {
          const {
            backgroundImage,
            backgroundSize,
            backgroundPosition,
            backgroundRepeat,
            ...restStyle
          } = style;
          return restStyle;
        })()
      : style;

  // Calculate counter-scale for UI elements (borders, indicators)
  const counterScale = 1 / canvasScale;

  // Merge transform overrides with parent style
  const mergedStyle: React.CSSProperties = {
    ...parentStyle,
    ...transformOverride,
    cursor: isAIEditing ? 'default' : isDragging ? 'grabbing' : isSelected ? 'move' : 'pointer',
    // CSS custom property for counter-scaling UI elements
    '--counter-scale': counterScale,
    '--border-width': `${2 * counterScale}px`,
  } as React.CSSProperties;

  // Selection box must wrap glyph ink (serif caps/descenders extend beyond the
  // line-box). Pad the outer div vertically and shift it up by the same amount
  // so the text's visual Y position is unchanged — only the selection border
  // grows symmetrically above and below. Use the live effective font so the
  // padding tracks the scaled glyphs during a text-corner drag and does not
  // snap on release.
  if (type === 'text' && effectiveFontSize != null) {
    const inkPad = effectiveFontSize * 0.12;
    const activeTopVal = mergedStyle.top ?? parentStyle?.top;
    const baseTop =
      typeof activeTopVal === 'number' ? activeTopVal : parseFloat(String(activeTopVal ?? '0'));
    mergedStyle.paddingTop = `${inkPad}px`;
    mergedStyle.paddingBottom = `${inkPad}px`;
    mergedStyle.boxSizing = 'content-box';
    if (!Number.isNaN(baseTop)) {
      mergedStyle.top = baseTop - inkPad;
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    if (type === 'image') {
      e.preventDefault(); // Allow drop
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (type !== 'image' || !elementId) return;

    const imageUrl = e.dataTransfer.getData('application/x-canva-image');
    if (imageUrl) {
      e.preventDefault();
      e.stopPropagation();

      // Update this element's background image
      updateElementProperty(elementId, 'style', {
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      });
    }
  };

  return (
    // Plain div: outer element host mixes dynamic transform/drag/resize overrides
    // with element-specific backgroundColor/image/borderRadius supplied by props —
    // Easel Box would wipe those via reset_f88b8e. The Editor also attaches
    // data-element-id hooks and class-based CSS driven by the global CanvasElement.css.
    <div
      ref={elementRef}
      className={elementClassName}
      style={mergedStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={e => {
        // Check if clicking on a handle or toolbar - don't start drag
        const target = e.target as HTMLElement;
        if (
          target.classList.contains('resize-handle')
          || target.classList.contains('rotation-handle')
          || target.closest('.contextual-toolbar')
        ) {
          return;
        }

        // Select on mousedown so click+drag works in one motion instead of
        // requiring click → release → mousedown → drag.
        if (!isSelected && onClick && !e.defaultPrevented) {
          onClick(e);
        }

        if (!e.defaultPrevented) {
          handleDragStart(e);
        }
      }}
      onTouchStart={e => {
        // Check if touching on a handle or toolbar - don't start drag
        const target = e.target as HTMLElement;
        if (
          target.classList.contains('resize-handle')
          || target.classList.contains('rotation-handle')
          || target.closest('.contextual-toolbar')
        ) {
          return;
        }

        handleDragTouchStart(e);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-element-id={elementId}
    >
      {type === 'text' ? (
        <>
          <TextElement
            content={content}
            elementId={elementId}
            isEditing={isEditingText}
            onClick={onClick}
            style={textStyleForChild}
            onBlur={() => setIsEditingText(false)}
          />
          {isEditing && (
            <div className="element-edit-shimmer-overlay">
              <div className="element-edit-shimmer" />
            </div>
          )}
        </>
      ) : type === 'image' && style?.backgroundImage ? (
        // For images with background images, render with loading/shimmer overlay
        <>
          {/* Plain div: background-image/size/position/border-radius are all dynamic
              element-level values; Easel Box would wipe them. */}
          <div
            className={`element-image-container ${newImageUrl ? 'crossfading' : ''}`}
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: newImageUrl ? `url('${newImageUrl}')` : style.backgroundImage,
              backgroundSize: style.backgroundSize || 'cover',
              backgroundPosition: style.backgroundPosition || 'center',
              backgroundRepeat: style.backgroundRepeat || 'no-repeat',
              borderRadius: style.borderRadius || 'inherit',
            }}
          />
          {/* Animated gradient overlay for async image generation/editing */}
          {isLoading && (
            <div className="element-generating-overlay">
              <div className="element-generating-gradient" />
            </div>
          )}
          {/* Shimmer overlay for editing state */}
          {isEditing && !newImageUrl && !isLoading && (
            <div className="element-edit-shimmer-overlay">
              <div className="element-edit-shimmer" />
            </div>
          )}
        </>
      ) : type === 'image' && isLoading ? (
        // Loading state for new image generation (no existing image) - simple animated gradient
        <div className="element-generating-overlay element-generating-overlay--placeholder">
          <div className="element-generating-gradient" />
        </div>
      ) : type === 'image' && hasError ? (
        // Error state for failed image generation
        <div className="element-error-overlay">
          <svg
            className="element-error-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{loadingState?.message || 'Failed to generate'}</span>
        </div>
      ) : type === 'shape' ? null : ( // The parent div already has backgroundColor, borderRadius, etc. from the style prop // Shape elements render as simple styled divs - styles are applied to parent
        <img src={getImagePath()} alt={`${type} element`} />
      )}
      {isAIEditing && <AIEditingBadge position="element" canvasScale={canvasScale} />}
      {isSelected && !isAIEditing && (
        <ResizeHandlesPortal
          elementRef={elementRef as React.RefObject<HTMLDivElement>}
          canvasScale={canvasScale}
          rotation={isRotating ? rotationAngle : initialRotation}
          showRotation={type === 'text' && !isMobile}
          hideTopBottom={type === 'text'}
          onResizeStart={handleResizeStart}
          onResizeTouchStart={handleResizeTouchStart}
          onRotationStart={handleRotationStart}
        />
      )}
    </div>
  );
};

export default CanvasElement;
