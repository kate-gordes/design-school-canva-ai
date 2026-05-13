import { signal, computed } from '@preact/signals-react';
import type { ElementData, SelectionBounds } from '../types';
import { currentPageElements } from './elements';
import { selectedPageId } from './canvasState';

// Selection state signals
export const selectedElementId = signal<string | null>(null);
export const selectedElementIds = signal<Set<string>>(new Set());

// Legacy selection type for standalone objects (text/shape) not in signals store
// This is used by TextObject, ShapeTextObject, SelectableObject
export const legacySelectedObjectType = signal<'text' | 'shape' | 'none'>('none');

// Computed: Get single selected element data
export const selectedElement = computed<ElementData | null>(() => {
  if (!selectedElementId.value) return null;
  return currentPageElements.value[selectedElementId.value] ?? null;
});

// Computed: Get all selected elements
export const selectedElements = computed<ElementData[]>(() => {
  const ids = selectedElementIds.value;
  const pageElements = currentPageElements.value;
  return Array.from(ids)
    .map(id => pageElements[id])
    .filter((el): el is ElementData => el !== undefined);
});

// Computed: Check if multiple elements are selected
export const hasMultiSelection = computed<boolean>(() => {
  return selectedElementIds.value.size > 1;
});

// Computed: Check if any element or page is selected
export const hasSelection = computed<boolean>(() => {
  return selectedElementIds.value.size > 0 || selectedPageId.value !== null;
});

// Computed: Calculate combined bounds for multi-selection
export const selectionBounds = computed<SelectionBounds | null>(() => {
  const elements = selectedElements.value;
  if (elements.length === 0) return null;

  if (elements.length === 1) {
    const el = elements[0];
    return {
      top: el.style.top,
      left: el.style.left,
      width: el.style.width,
      height: el.style.height,
      rotation: el.style.rotation,
    };
  }

  // For multi-selection, compute bounding box (ignoring rotation for simplicity)
  let minTop = Infinity;
  let minLeft = Infinity;
  let maxBottom = -Infinity;
  let maxRight = -Infinity;

  for (const el of elements) {
    const { top, left, width, height } = el.style;
    minTop = Math.min(minTop, top);
    minLeft = Math.min(minLeft, left);
    maxBottom = Math.max(maxBottom, top + height);
    maxRight = Math.max(maxRight, left + width);
  }

  return {
    top: minTop,
    left: minLeft,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
    rotation: 0, // Multi-selection doesn't have rotation
  };
});

// Check if element is selected
export function isElementSelected(elementId: string): boolean {
  return selectedElementIds.value.has(elementId);
}

// Computed: Get the type of the selected object ('text' | 'shape' | 'image' | 'video' | 'html' | 'none')
// Combines both signals-based element selection and legacy object selection
export const selectedObjectType = computed<string>(() => {
  // First check signals-based element selection
  const element = selectedElement.value;
  if (element) return element.type;
  // Fall back to legacy selection type
  return legacySelectedObjectType.value;
});

// Set legacy selection type (for standalone TextObject/ShapeTextObject)
export function setLegacySelection(type: 'text' | 'shape' | 'none'): void {
  legacySelectedObjectType.value = type;
  // Clear element selection when using legacy selection
  if (type !== 'none') {
    selectedElementId.value = null;
    selectedElementIds.value = new Set();
  }
}
