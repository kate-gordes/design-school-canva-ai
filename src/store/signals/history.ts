import { signal, computed } from '@preact/signals-react';
import type { HistoryEntry } from '../types';
import { elementsByDoctype, currentDoctype } from './elements';
import { canvases } from './canvasState';
import { deepClone } from '../utils';

const MAX_HISTORY_ENTRIES = 50;

// History state signals
export const pastHistory = signal<HistoryEntry[]>([]);
export const futureHistory = signal<HistoryEntry[]>([]);

// Computed: Can undo
export const canUndo = computed<boolean>(() => {
  return pastHistory.value.length > 0;
});

// Computed: Can redo
export const canRedo = computed<boolean>(() => {
  return futureHistory.value.length > 0;
});

// Record current state to history
export function recordHistory(description?: string): void {
  const currentElements = elementsByDoctype.value[currentDoctype.value] ?? {};
  const currentCanvasOrder = canvases.value.map(c => c.canvasId);
  const entry: HistoryEntry = {
    timestamp: Date.now(),
    elements: deepClone(currentElements),
    canvasOrder: currentCanvasOrder,
    description,
  };

  // Add to past history
  const newPast = [...pastHistory.value, entry];
  if (newPast.length > MAX_HISTORY_ENTRIES) {
    newPast.shift(); // Remove oldest entry
  }
  pastHistory.value = newPast;

  // Clear future history (new action invalidates redo stack)
  futureHistory.value = [];
}

// Undo last action
export function undo(): void {
  const past = pastHistory.value;
  if (past.length === 0) return;

  // Save current state to future
  const currentElements = elementsByDoctype.value[currentDoctype.value] ?? {};
  const currentCanvasOrder = canvases.value.map(c => c.canvasId);
  const currentEntry: HistoryEntry = {
    timestamp: Date.now(),
    elements: deepClone(currentElements),
    canvasOrder: currentCanvasOrder,
  };
  futureHistory.value = [currentEntry, ...futureHistory.value];

  // Restore previous state
  const previousEntry = past[past.length - 1];
  pastHistory.value = past.slice(0, -1);

  // Update elements
  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [currentDoctype.value]: deepClone(previousEntry.elements),
  };

  // Restore canvas order if it was saved
  if (previousEntry.canvasOrder) {
    const currentCanvases = canvases.value;
    const reorderedCanvases = previousEntry.canvasOrder
      .map(id => currentCanvases.find(c => c.canvasId === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
    // Only update if we found all canvases (handles case where canvases were added/removed)
    if (reorderedCanvases.length === currentCanvases.length) {
      canvases.value = reorderedCanvases;
    }
  }
}

// Redo previously undone action
export function redo(): void {
  const future = futureHistory.value;
  if (future.length === 0) return;

  // Save current state to past
  const currentElements = elementsByDoctype.value[currentDoctype.value] ?? {};
  const currentCanvasOrder = canvases.value.map(c => c.canvasId);
  const currentEntry: HistoryEntry = {
    timestamp: Date.now(),
    elements: deepClone(currentElements),
    canvasOrder: currentCanvasOrder,
  };
  pastHistory.value = [...pastHistory.value, currentEntry];

  // Restore next state
  const nextEntry = future[0];
  futureHistory.value = future.slice(1);

  // Update elements
  elementsByDoctype.value = {
    ...elementsByDoctype.value,
    [currentDoctype.value]: deepClone(nextEntry.elements),
  };

  // Restore canvas order if it was saved
  if (nextEntry.canvasOrder) {
    const currentCanvases = canvases.value;
    const reorderedCanvases = nextEntry.canvasOrder
      .map(id => currentCanvases.find(c => c.canvasId === id))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);
    // Only update if we found all canvases (handles case where canvases were added/removed)
    if (reorderedCanvases.length === currentCanvases.length) {
      canvases.value = reorderedCanvases;
    }
  }
}

// Clear all history
export function clearHistory(): void {
  pastHistory.value = [];
  futureHistory.value = [];
}
