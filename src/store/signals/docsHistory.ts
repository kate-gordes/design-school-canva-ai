import { signal } from '@preact/signals-react';
import { blocks } from './documentState';
import type { BlockData } from './documentState';
import { addDebugHistoryEntry } from './debugHistory';
import type { StateSnapshot, AIMetadata } from './debugHistory';

// --- AI change tracking for docs ---

export const isDocsAIChange = signal<boolean>(false);
export const currentDocsAIMetadata = signal<AIMetadata | null>(null);

// --- Debounced text change tracking ---

const DEBOUNCE_MS = 500;

let pendingBlockId: string | null = null;
let pendingBeforeSnapshot: BlockData[] | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Deep-clone the current blocks array
 */
export const captureDocsSnapshot = (): BlockData[] => {
  return JSON.parse(JSON.stringify(blocks.value));
};

/**
 * Create a document-type StateSnapshot from a blocks array
 */
const makeDocSnapshot = (data: BlockData[]): StateSnapshot => ({
  type: 'document',
  documentData: data,
});

/**
 * Begin tracking a text change for a block.
 * On the first keystroke, captures a "before" snapshot.
 * Subsequent keystrokes within the debounce window reset the timer.
 */
export const beginTextChange = (blockId: string): void => {
  // If switching to a different block, flush the pending one first
  if (pendingBlockId !== null && pendingBlockId !== blockId) {
    flushPendingChange();
  }

  if (pendingBeforeSnapshot === null) {
    // First keystroke — capture before state
    pendingBeforeSnapshot = captureDocsSnapshot();
    pendingBlockId = blockId;
  }

  // Reset debounce timer
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
  }
  debounceTimer = setTimeout(() => {
    commitPendingChange();
  }, DEBOUNCE_MS);
};

/**
 * Commit the pending text change as a history entry (called by debounce timer).
 */
export const commitPendingChange = (): void => {
  if (pendingBeforeSnapshot === null || pendingBlockId === null) return;

  const afterSnapshot = captureDocsSnapshot();

  // Only record if something actually changed
  const beforeJson = JSON.stringify(pendingBeforeSnapshot);
  const afterJson = JSON.stringify(afterSnapshot);
  if (beforeJson !== afterJson) {
    const block = blocks.value.find(b => b.blockId === pendingBlockId);
    const description = block
      ? `Edited block "${block.markdown.slice(0, 30)}${block.markdown.length > 30 ? '...' : ''}"`
      : `Edited block ${pendingBlockId}`;

    addDebugHistoryEntry({
      affectedScope: 'block',
      initiationScope: 'block',
      source: isDocsAIChange.value ? 'canva-ai' : 'human',
      actionType: 'content-change',
      targetId: pendingBlockId,
      targetCanvasId: null,
      targetElementType: null,
      origin: {
        scope: 'block',
        canvasId: null,
        elementId: null,
        elementType: null,
      },
      beforeState: makeDocSnapshot(pendingBeforeSnapshot),
      afterState: makeDocSnapshot(afterSnapshot),
      description,
      ...(isDocsAIChange.value && currentDocsAIMetadata.value
        ? { aiMetadata: currentDocsAIMetadata.value }
        : {}),
    });
  }

  // Reset
  pendingBeforeSnapshot = null;
  pendingBlockId = null;
  debounceTimer = null;
};

/**
 * Immediately flush any pending text change (called before structural mutations).
 */
export const flushPendingChange = (): void => {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  commitPendingChange();
};
