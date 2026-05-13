/**
 * AI Editing State — signals tracking which pages/elements are actively being AI-edited.
 * Used by visual indicator components (dashed borders, badges, thumbnail avatars).
 */
import { signal, computed } from '@preact/signals-react';
import { canvases } from '@/store/signals/canvasState';

const LINGER_DURATION_MS = 2500;

/** Canvas IDs currently being edited by AI */
export const aiEditingPages = signal<Set<number>>(new Set());

/** Element IDs currently being edited by AI */
export const aiEditingElements = signal<Set<string>>(new Set());

/** Pages in post-edit linger/fade-out phase, mapped to their timeout handles */
export const aiLingeringPages = signal<Map<number, ReturnType<typeof setTimeout>>>(new Map());

/** Union of active + lingering + pages-with-edited-elements — what thumbnails read */
export const aiVisiblePages = computed<Set<number>>(() => {
  const visible = new Set(aiEditingPages.value);
  for (const canvasId of aiLingeringPages.value.keys()) {
    visible.add(canvasId);
  }
  // Also include pages that contain any element currently being AI-edited
  const editingEls = aiEditingElements.value;
  if (editingEls.size > 0) {
    for (const canvas of canvases.value) {
      if (canvas.elements?.some(el => editingEls.has(el.elementId))) {
        visible.add(canvas.canvasId);
      }
    }
  }
  return visible;
});

// ---------- mutation helpers ----------

export function addAIEditingPage(canvasId: number): void {
  // If it was lingering, cancel the linger timer since it's actively editing again
  const lingering = aiLingeringPages.value;
  if (lingering.has(canvasId)) {
    clearTimeout(lingering.get(canvasId)!);
    const next = new Map(lingering);
    next.delete(canvasId);
    aiLingeringPages.value = next;
  }

  const pages = aiEditingPages.value;
  if (!pages.has(canvasId)) {
    const next = new Set(pages);
    next.add(canvasId);
    aiEditingPages.value = next;
  }
}

export function removeAIEditingPage(canvasId: number): void {
  const pages = aiEditingPages.value;
  if (!pages.has(canvasId)) return;

  // Remove from active set
  const next = new Set(pages);
  next.delete(canvasId);
  aiEditingPages.value = next;

  // Start linger timer
  const handle = setTimeout(() => {
    const current = aiLingeringPages.value;
    if (current.has(canvasId)) {
      const updated = new Map(current);
      updated.delete(canvasId);
      aiLingeringPages.value = updated;
    }
  }, LINGER_DURATION_MS);

  const lingerNext = new Map(aiLingeringPages.value);
  lingerNext.set(canvasId, handle);
  aiLingeringPages.value = lingerNext;
}

export function addAIEditingElement(elementId: string): void {
  const elements = aiEditingElements.value;
  if (!elements.has(elementId)) {
    const next = new Set(elements);
    next.add(elementId);
    aiEditingElements.value = next;
  }
}

export function removeAIEditingElement(elementId: string): void {
  const elements = aiEditingElements.value;
  if (!elements.has(elementId)) return;

  const next = new Set(elements);
  next.delete(elementId);
  aiEditingElements.value = next;
}

export function clearAllAIEditing(): void {
  aiEditingPages.value = new Set();
  aiEditingElements.value = new Set();

  // Clear all linger timers
  for (const handle of aiLingeringPages.value.values()) {
    clearTimeout(handle);
  }
  aiLingeringPages.value = new Map();
}
