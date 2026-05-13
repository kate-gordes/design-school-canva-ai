import {
  selectedElementId,
  selectedElementIds,
  legacySelectedObjectType,
} from '../signals/selection';
import { currentPageElements } from '../signals/elements';
import { mobileAIEditMode, dismissMobileAIPanel } from '../signals/panels';
import type { ElementData } from '../types';

// Select a single element
export function selectElement(elementId: string, addToSelection: boolean = false): void {
  // Mobile: if keyboard is open (compact AI input visible), dismiss the AI panel
  // This allows the user to interact with canvas elements normally
  if (mobileAIEditMode.value.keyboardOpen) {
    dismissMobileAIPanel();
  }

  if (addToSelection) {
    // Shift-click: toggle in multi-selection
    const newSet = new Set(selectedElementIds.value);
    if (newSet.has(elementId)) {
      newSet.delete(elementId);
    } else {
      newSet.add(elementId);
    }
    selectedElementIds.value = newSet;
    // Update single selection to last added/first remaining
    selectedElementId.value = newSet.size > 0 ? elementId : null;
  } else {
    // Regular click: single selection
    selectedElementId.value = elementId;
    selectedElementIds.value = new Set([elementId]);
  }
}

// Clear all selection (both element-based and legacy)
export function clearSelection(): void {
  selectedElementId.value = null;
  selectedElementIds.value = new Set();
  legacySelectedObjectType.value = 'none';
}

// Select multiple elements by IDs
export function selectElements(elementIds: string[]): void {
  selectedElementIds.value = new Set(elementIds);
  selectedElementId.value = elementIds.length > 0 ? elementIds[0] : null;
}

// Select all elements on current page
export function selectAll(): void {
  const pageElements = currentPageElements.value;
  const allIds = Object.keys(pageElements).filter(
    id => pageElements[id].visible && !pageElements[id].locked,
  );
  selectElements(allIds);
}

// Select elements within a rectangle (drag-select)
export function selectByRect(rect: {
  top: number;
  left: number;
  width: number;
  height: number;
}): void {
  const pageElements = currentPageElements.value;
  const selectedIds: string[] = [];

  const rectRight = rect.left + rect.width;
  const rectBottom = rect.top + rect.height;

  for (const element of Object.values(pageElements)) {
    if (!element.visible || element.locked) continue;

    const { top, left, width, height } = element.style;
    const elRight = left + width;
    const elBottom = top + height;

    // Check intersection
    const intersects =
      left < rectRight && elRight > rect.left && top < rectBottom && elBottom > rect.top;

    if (intersects) {
      selectedIds.push(element.elementId);
    }
  }

  selectElements(selectedIds);
}

// Add element to current selection
export function addToSelection(elementId: string): void {
  const newSet = new Set(selectedElementIds.value);
  newSet.add(elementId);
  selectedElementIds.value = newSet;
  selectedElementId.value = elementId;
}

// Remove element from current selection
export function removeFromSelection(elementId: string): void {
  const newSet = new Set(selectedElementIds.value);
  newSet.delete(elementId);
  selectedElementIds.value = newSet;

  // Update single selection
  if (newSet.size > 0) {
    selectedElementId.value = Array.from(newSet)[0];
  } else {
    selectedElementId.value = null;
  }
}

// Toggle element in selection
export function toggleInSelection(elementId: string): void {
  if (selectedElementIds.value.has(elementId)) {
    removeFromSelection(elementId);
  } else {
    addToSelection(elementId);
  }
}

// Get selected elements data
export function getSelectedElements(): ElementData[] {
  const pageElements = currentPageElements.value;
  return Array.from(selectedElementIds.value)
    .map(id => pageElements[id])
    .filter((el): el is ElementData => el !== undefined);
}
