import type React from 'react';

export type ElementType = 'text' | 'image' | 'shape' | 'video' | 'html';

// Extended CSSProperties with our custom properties
export interface ElementStyle extends React.CSSProperties {
  // These are always required for positioning
  top?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
  // Our custom rotation (degrees)
  rotation?: number;
  // zIndex for layering
  zIndex?: number;
}

export interface ElementData {
  elementId: string;
  type: ElementType;
  style: ElementStyle;
  content?: string;
  htmlContent?: string; // For html type: the full HTML/CSS/JS code to render
  locked?: boolean;
  visible?: boolean;
}

export interface PageElements {
  [elementId: string]: ElementData;
}

export interface DocumentElements {
  [pageIndex: number]: PageElements;
}

export interface HistoryEntry {
  timestamp: number;
  elements: DocumentElements;
  canvasOrder?: number[]; // Array of canvas IDs in order, for undo/redo of reordering
  description?: string;
}

export interface SelectionBounds {
  top: number;
  left: number;
  width: number;
  height: number;
  rotation: number;
}

// Helper to extract numeric values from style properties
export function getStyleNumber(value: number | string | undefined, fallback: number = 0): number {
  if (value === undefined) return fallback;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}
