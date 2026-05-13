/**
 * Transform utilities for element manipulation
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export type ResizeHandle =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left'
  | 'rotate';

/**
 * Constrain a point within canvas bounds
 */
export function constrainToCanvas(
  point: Point,
  elementSize: { width: number; height: number },
  canvasBounds: Bounds,
): Point {
  return {
    x: Math.max(0, Math.min(point.x, canvasBounds.width - elementSize.width)),
    y: Math.max(0, Math.min(point.y, canvasBounds.height - elementSize.height)),
  };
}

/**
 * Constrain bounds within canvas
 */
export function constrainBoundsToCanvas(bounds: Bounds, canvasBounds: Bounds): Bounds {
  const x = Math.max(0, Math.min(bounds.x, canvasBounds.width - bounds.width));
  const y = Math.max(0, Math.min(bounds.y, canvasBounds.height - bounds.height));
  const width = Math.min(bounds.width, canvasBounds.width - x);
  const height = Math.min(bounds.height, canvasBounds.height - y);

  return { x, y, width, height };
}

/**
 * Calculate new bounds when resizing from a handle
 */
export function calculateResizeBounds(
  handle: ResizeHandle,
  originalBounds: Bounds,
  delta: Point,
  aspectRatio?: number,
  minSize = { width: 20, height: 20 },
): Bounds {
  let { x, y, width, height } = originalBounds;

  switch (handle) {
    case 'top-left':
      if (aspectRatio) {
        // Maintain aspect ratio using the larger delta
        const scaleDelta = Math.max(Math.abs(delta.x), Math.abs(delta.y));
        const signX = delta.x < 0 ? 1 : -1;
        const newWidth = width + signX * scaleDelta;
        const newHeight = newWidth / aspectRatio;
        x = originalBounds.x + originalBounds.width - newWidth;
        y = originalBounds.y + originalBounds.height - newHeight;
        width = newWidth;
        height = newHeight;
      } else {
        x += delta.x;
        y += delta.y;
        width -= delta.x;
        height -= delta.y;
      }
      break;

    case 'top':
      y += delta.y;
      height -= delta.y;
      if (aspectRatio) {
        width = height * aspectRatio;
        x = originalBounds.x + (originalBounds.width - width) / 2;
      }
      break;

    case 'top-right':
      if (aspectRatio) {
        const scaleDelta = Math.max(Math.abs(delta.x), Math.abs(delta.y));
        const signX = delta.x > 0 ? 1 : -1;
        const newWidth = width + signX * scaleDelta;
        const newHeight = newWidth / aspectRatio;
        y = originalBounds.y + originalBounds.height - newHeight;
        width = newWidth;
        height = newHeight;
      } else {
        y += delta.y;
        width += delta.x;
        height -= delta.y;
      }
      break;

    case 'right':
      width += delta.x;
      if (aspectRatio) {
        height = width / aspectRatio;
        y = originalBounds.y + (originalBounds.height - height) / 2;
      }
      break;

    case 'bottom-right':
      if (aspectRatio) {
        const scaleDelta = Math.max(Math.abs(delta.x), Math.abs(delta.y));
        const sign = delta.x > 0 || delta.y > 0 ? 1 : -1;
        width += sign * scaleDelta;
        height = width / aspectRatio;
      } else {
        width += delta.x;
        height += delta.y;
      }
      break;

    case 'bottom':
      height += delta.y;
      if (aspectRatio) {
        width = height * aspectRatio;
        x = originalBounds.x + (originalBounds.width - width) / 2;
      }
      break;

    case 'bottom-left':
      if (aspectRatio) {
        const scaleDelta = Math.max(Math.abs(delta.x), Math.abs(delta.y));
        const signX = delta.x < 0 ? 1 : -1;
        const newWidth = width + signX * scaleDelta;
        const newHeight = newWidth / aspectRatio;
        x = originalBounds.x + originalBounds.width - newWidth;
        width = newWidth;
        height = newHeight;
      } else {
        x += delta.x;
        width -= delta.x;
        height += delta.y;
      }
      break;

    case 'left':
      x += delta.x;
      width -= delta.x;
      if (aspectRatio) {
        height = width / aspectRatio;
        y = originalBounds.y + (originalBounds.height - height) / 2;
      }
      break;

    default:
      break;
  }

  // Enforce minimum size
  if (width < minSize.width) {
    if (handle.includes('left')) {
      x -= minSize.width - width;
    }
    width = minSize.width;
  }
  if (height < minSize.height) {
    if (handle.includes('top')) {
      y -= minSize.height - height;
    }
    height = minSize.height;
  }

  return { x, y, width, height };
}

/**
 * Calculate rotation angle from center point
 */
export function calculateRotation(center: Point, currentPoint: Point, initialAngle = 0): number {
  const angle = Math.atan2(currentPoint.y - center.y, currentPoint.x - center.x) * (180 / Math.PI);
  return angle + 90 - initialAngle;
}

/**
 * Get cursor style for resize handle
 */
export function getCursorForHandle(handle: ResizeHandle, rotation = 0): string {
  if (handle === 'rotate') return 'grab';

  const cursorMap: Record<string, string> = {
    'top-left': 'nw-resize',
    top: 'n-resize',
    'top-right': 'ne-resize',
    right: 'e-resize',
    'bottom-right': 'se-resize',
    bottom: 's-resize',
    'bottom-left': 'sw-resize',
    left: 'w-resize',
  };

  // Adjust cursor based on rotation (simplified, could be more precise)
  if (rotation !== 0) {
    return 'grab';
  }

  return cursorMap[handle] || 'default';
}

/**
 * Calculate aspect ratio from bounds
 */
export function calculateAspectRatio(bounds: Bounds): number {
  return bounds.width / bounds.height;
}

/**
 * Round number to nearest pixel
 */
export function roundToPixel(value: number): number {
  return Math.round(value);
}

/**
 * Get element center point
 */
export function getCenter(bounds: Bounds): Point {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Check if two values are within threshold
 */
export function isNear(value1: number, value2: number, threshold = 5): boolean {
  return Math.abs(value1 - value2) <= threshold;
}

/**
 * Snap value to target if within threshold
 */
export function snapToValue(
  value: number,
  target: number,
  threshold = 5,
): { value: number; snapped: boolean } {
  if (isNear(value, target, threshold)) {
    return { value: target, snapped: true };
  }
  return { value, snapped: false };
}
