import type { ElementData, ElementType, ElementStyle } from '../types';
import { getStyleNumber } from '../types';
import {
  elementsByDoctype,
  currentDoctype,
  currentPageIndex,
  getMaxZIndex,
} from '../signals/elements';
import { generateId, deepClone } from '../utils';
import { recordHistory } from '../signals/history';

// Default style for new elements
function getDefaultStyle(type: ElementType): ElementStyle {
  const baseStyle: ElementStyle = {
    position: 'absolute',
    top: 100,
    left: 100,
    width: 200,
    height: 100,
    zIndex: getMaxZIndex() + 1,
  };

  switch (type) {
    case 'text':
      return {
        ...baseStyle,
        width: 320,
        height: 120,
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#000000',
      };
    case 'shape':
      return {
        ...baseStyle,
        width: 260,
        height: 260,
        borderRadius: 8,
        backgroundColor: '#9d6eff',
      };
    case 'image':
      return {
        ...baseStyle,
        width: 300,
        height: 200,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 8,
      };
    default:
      return baseStyle;
  }
}

// Create a new element
export function createElement(
  type: ElementType,
  content: string = '',
  style?: Partial<ElementStyle>,
): ElementData {
  const elementId = generateId(type);
  const defaultStyle = getDefaultStyle(type);

  const element: ElementData = {
    elementId,
    type,
    style: { ...defaultStyle, ...style, zIndex: getMaxZIndex() + 1 },
    content,
    locked: false,
    visible: true,
  };

  // Record history before making changes
  recordHistory(`Create ${type} element`);

  // Add to state
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: {
        ...pageElements,
        [elementId]: element,
      },
    },
  };

  return element;
}

// Update element style (merges with existing style)
export function updateElementStyle(
  elementId: string,
  styleUpdates: Partial<ElementStyle>,
  recordInHistory: boolean = false,
): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};
  const element = pageElements[elementId];

  if (!element) return;

  if (recordInHistory) {
    recordHistory('Update element style');
  }

  const updatedElement: ElementData = {
    ...element,
    style: { ...element.style, ...styleUpdates },
  };

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: {
        ...pageElements,
        [elementId]: updatedElement,
      },
    },
  };
}

// Update element content
export function updateElementContent(
  elementId: string,
  content: string,
  recordInHistory: boolean = false,
): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};
  const element = pageElements[elementId];

  if (!element) return;

  if (recordInHistory) {
    recordHistory('Update element content');
  }

  const updatedElement: ElementData = {
    ...element,
    content,
  };

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: {
        ...pageElements,
        [elementId]: updatedElement,
      },
    },
  };
}

// Update full element
export function updateElement(
  elementId: string,
  updates: Partial<Omit<ElementData, 'elementId'>>,
  recordInHistory: boolean = false,
): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};
  const element = pageElements[elementId];

  if (!element) return;

  if (recordInHistory) {
    recordHistory('Update element');
  }

  const updatedElement: ElementData = {
    ...element,
    ...updates,
    style: updates.style ? { ...element.style, ...updates.style } : element.style,
  };

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: {
        ...pageElements,
        [elementId]: updatedElement,
      },
    },
  };
}

// Delete element
export function deleteElement(elementId: string): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = { ...currentElements[pageIndex] };

  if (!pageElements[elementId]) return;

  recordHistory('Delete element');

  delete pageElements[elementId];

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: pageElements,
    },
  };
}

// Delete multiple elements
export function deleteElements(elementIds: string[]): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = { ...currentElements[pageIndex] };

  let hasDeleted = false;
  for (const id of elementIds) {
    if (pageElements[id]) {
      delete pageElements[id];
      hasDeleted = true;
    }
  }

  if (!hasDeleted) return;

  recordHistory('Delete elements');

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: pageElements,
    },
  };
}

// Duplicate element
export function duplicateElement(elementId: string): ElementData | null {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};
  const element = pageElements[elementId];

  if (!element) return null;

  const currentTop = getStyleNumber(element.style.top, 0);
  const currentLeft = getStyleNumber(element.style.left, 0);

  const newElement: ElementData = {
    ...deepClone(element),
    elementId: generateId(element.type),
    style: {
      ...element.style,
      top: currentTop + 20,
      left: currentLeft + 20,
      zIndex: getMaxZIndex() + 1,
    },
  };

  recordHistory('Duplicate element');

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: {
        ...pageElements,
        [newElement.elementId]: newElement,
      },
    },
  };

  return newElement;
}

// Bring element to front
export function bringToFront(elementId: string): void {
  updateElementStyle(elementId, { zIndex: getMaxZIndex() + 1 }, true);
}

// Send element to back
export function sendToBack(elementId: string): void {
  const doctype = currentDoctype.value;
  const pageIndex = currentPageIndex.value;
  const currentElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = currentElements[pageIndex] ?? {};

  // Get all elements and reindex
  const elements = Object.values(pageElements).sort(
    (a, b) => getStyleNumber(a.style.zIndex, 0) - getStyleNumber(b.style.zIndex, 0),
  );
  const targetIndex = elements.findIndex(el => el.elementId === elementId);

  if (targetIndex <= 0) return; // Already at back

  recordHistory('Send to back');

  // Move target to index 0, shift others up
  const newPageElements: Record<string, ElementData> = {};
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    let newZIndex: number;
    if (el.elementId === elementId) {
      newZIndex = 0;
    } else if (i < targetIndex) {
      newZIndex = i + 1;
    } else {
      newZIndex = i;
    }
    newPageElements[el.elementId] = {
      ...el,
      style: { ...el.style, zIndex: newZIndex },
    };
  }

  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [doctype]: {
      ...currentElements,
      [pageIndex]: newPageElements,
    },
  };
}

// Lock/unlock element
export function toggleElementLock(elementId: string): void {
  const element =
    elementsByDoctype.value[currentDoctype.value]?.[currentPageIndex.value]?.[elementId];
  if (!element) return;
  updateElement(elementId, { locked: !element.locked }, true);
}

// Show/hide element
export function toggleElementVisibility(elementId: string): void {
  const element =
    elementsByDoctype.value[currentDoctype.value]?.[currentPageIndex.value]?.[elementId];
  if (!element) return;
  updateElement(elementId, { visible: !element.visible }, true);
}
