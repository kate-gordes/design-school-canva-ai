import { signal, computed } from '@preact/signals-react';
import type { CanvasData, ElementData } from './canvasState';
import { canvases, activeCanvasId } from './canvasState';
import { blocks } from './documentState';
import type { BlockData } from './documentState';

// --- Types ---

export type HistoryScope = 'presentation' | 'page' | 'element' | 'document' | 'block';
export type ChangeSource = 'canva-ai' | 'human';
export type ActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'reorder'
  | 'style-change'
  | 'content-change'
  | 'background-change'
  | 'document-replace'
  | 'block-update';

export interface StateSnapshot {
  type: 'element' | 'canvas' | 'presentation' | 'document';
  elementData?: ElementData;
  canvasData?: CanvasData;
  presentationData?: CanvasData[];
  documentData?: BlockData[];
}

export interface AIMetadata {
  requestId: string;
  toolName: string;
  userPrompt?: string;
}

/**
 * Origin context - where the request was initiated from
 */
export interface OriginContext {
  scope: HistoryScope; // presentation, page, or element
  canvasId: number | null; // The canvas that was active/selected when initiated
  elementId: string | null; // The element that was selected when initiated (for element scope)
  elementType: string | null; // Type of the selected element
}

export interface DebugHistoryEntry {
  id: string;
  timestamp: Date;
  affectedScope: HistoryScope;
  initiationScope: HistoryScope;
  source: ChangeSource;
  actionType: ActionType;
  targetId: string | null; // What was mutated (element ID)
  targetCanvasId: number | null; // What canvas was mutated
  targetElementType: string | null; // Type of the mutated element
  origin: OriginContext; // Where the request was initiated from
  beforeState: StateSnapshot;
  afterState: StateSnapshot;
  description: string;
  aiMetadata?: AIMetadata;
  isReverted: boolean;
}

export interface HistoryFilter {
  scope: 'all' | HistoryScope;
  source: 'all' | ChangeSource;
  searchQuery: string;
  showReverted: boolean;
}

export interface HistoryStats {
  total: number;
  bySource: { 'canva-ai': number; human: number };
  byScope: { presentation: number; page: number; element: number; document: number; block: number };
  reverted: number;
  active: number;
}

// --- Signals ---

export const debugHistoryEntries = signal<DebugHistoryEntry[]>([]);

export const debugHistoryFilter = signal<HistoryFilter>({
  scope: 'all',
  source: 'all',
  searchQuery: '',
  showReverted: true,
});

export const debugHistoryPanelOpen = signal<boolean>(false);

// --- Computed ---

export const filteredHistoryEntries = computed<DebugHistoryEntry[]>(() => {
  const entries = debugHistoryEntries.value;
  const filter = debugHistoryFilter.value;

  return entries.filter(entry => {
    // Filter by scope
    if (filter.scope !== 'all' && entry.affectedScope !== filter.scope) {
      return false;
    }

    // Filter by source
    if (filter.source !== 'all' && entry.source !== filter.source) {
      return false;
    }

    // Filter by reverted status
    if (!filter.showReverted && entry.isReverted) {
      return false;
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      const matchesDescription = entry.description.toLowerCase().includes(query);
      const matchesTargetId = entry.targetId?.toLowerCase().includes(query);
      const matchesToolName = entry.aiMetadata?.toolName.toLowerCase().includes(query);
      if (!matchesDescription && !matchesTargetId && !matchesToolName) {
        return false;
      }
    }

    return true;
  });
});

export const historyStats = computed<HistoryStats>(() => {
  const entries = debugHistoryEntries.value;

  const stats: HistoryStats = {
    total: entries.length,
    bySource: { 'canva-ai': 0, human: 0 },
    byScope: { presentation: 0, page: 0, element: 0, document: 0, block: 0 },
    reverted: 0,
    active: 0,
  };

  for (const entry of entries) {
    stats.bySource[entry.source]++;
    stats.byScope[entry.affectedScope]++;
    if (entry.isReverted) {
      stats.reverted++;
    } else {
      stats.active++;
    }
  }

  return stats;
});

// --- Helper Functions ---

let entryIdCounter = 0;

export const generateEntryId = (): string => {
  return `debug_entry_${Date.now()}_${++entryIdCounter}`;
};

/**
 * Deep clone helper for state snapshots
 */
const cloneState = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

/**
 * Capture an element snapshot
 */
export const captureElementSnapshot = (elementId: string): StateSnapshot | null => {
  for (const canvas of canvases.value) {
    const element = canvas.elements?.find(el => el.elementId === elementId);
    if (element) {
      return {
        type: 'element',
        elementData: cloneState(element),
      };
    }
  }
  return null;
};

/**
 * Capture a canvas snapshot
 */
export const captureCanvasSnapshot = (canvasId: number): StateSnapshot | null => {
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  if (canvas) {
    return {
      type: 'canvas',
      canvasData: cloneState(canvas),
    };
  }
  return null;
};

/**
 * Capture full presentation snapshot
 */
export const capturePresentationSnapshot = (): StateSnapshot => {
  return {
    type: 'presentation',
    presentationData: cloneState(canvases.value),
  };
};

// --- Actions ---

/**
 * Add a new debug history entry
 */
export const addDebugHistoryEntry = (
  entry: Omit<DebugHistoryEntry, 'id' | 'timestamp' | 'isReverted'>,
): string => {
  const id = generateEntryId();
  const newEntry: DebugHistoryEntry = {
    ...entry,
    id,
    timestamp: new Date(),
    isReverted: false,
  };

  const updated = [...debugHistoryEntries.value, newEntry];
  // Cap at 50 entries, drop oldest
  debugHistoryEntries.value = updated.length > 50 ? updated.slice(-50) : updated;
  return id;
};

/**
 * Group entries by requestId for display
 */
export const groupedHistoryEntries = computed(() => {
  const entries = filteredHistoryEntries.value;
  const groups: Map<string, DebugHistoryEntry[]> = new Map();
  const ungrouped: DebugHistoryEntry[] = [];

  for (const entry of entries) {
    if (entry.aiMetadata?.requestId) {
      const existing = groups.get(entry.aiMetadata.requestId) || [];
      existing.push(entry);
      groups.set(entry.aiMetadata.requestId, existing);
    } else {
      ungrouped.push(entry);
    }
  }

  // Convert to array format for rendering
  const result: Array<
    | { type: 'group'; requestId: string; prompt?: string; entries: DebugHistoryEntry[] }
    | { type: 'single'; entry: DebugHistoryEntry }
  > = [];

  // Add grouped entries
  for (const [requestId, groupEntries] of groups) {
    result.push({
      type: 'group',
      requestId,
      prompt: groupEntries[0]?.aiMetadata?.userPrompt,
      entries: groupEntries,
    });
  }

  // Add ungrouped entries
  for (const entry of ungrouped) {
    result.push({ type: 'single', entry });
  }

  // Sort by timestamp (most recent first for display)
  result.sort((a, b) => {
    const aTime = a.type === 'group' ? a.entries[0].timestamp : a.entry.timestamp;
    const bTime = b.type === 'group' ? b.entries[0].timestamp : b.entry.timestamp;
    return bTime.getTime() - aTime.getTime();
  });

  return result;
});

/**
 * Toggle a single history entry on/off (revert/re-apply)
 */
export const toggleHistoryEntry = (entryId: string): boolean => {
  const entries = debugHistoryEntries.value;
  const entryIndex = entries.findIndex(e => e.id === entryId);

  if (entryIndex === -1) {
    console.warn(`[DebugHistory] Entry not found: ${entryId}`);
    return false;
  }

  const entry = entries[entryIndex];

  if (entry.isReverted) {
    // Re-apply: restore afterState
    applyStateSnapshot(entry.afterState, entry.targetId, entry.targetCanvasId);
  } else {
    // Revert: restore beforeState
    applyStateSnapshot(entry.beforeState, entry.targetId, entry.targetCanvasId);
  }

  // Update the entry's reverted status
  debugHistoryEntries.value = entries.map(e =>
    e.id === entryId ? { ...e, isReverted: !e.isReverted } : e,
  );

  return true;
};

/**
 * Revert all changes after (and including) the selected entry
 */
export const revertToHistoryEntry = (entryId: string): boolean => {
  const entries = debugHistoryEntries.value;
  const entryIndex = entries.findIndex(e => e.id === entryId);

  if (entryIndex === -1) {
    console.warn(`[DebugHistory] Entry not found: ${entryId}`);
    return false;
  }

  // Revert all entries from the end back to (and including) the target entry
  // Process in reverse order to properly undo cascading changes
  const entriesToRevert = entries.slice(entryIndex).filter(e => !e.isReverted);

  for (let i = entriesToRevert.length - 1; i >= 0; i--) {
    const entry = entriesToRevert[i];
    applyStateSnapshot(entry.beforeState, entry.targetId, entry.targetCanvasId);
  }

  // Mark all entries from this point forward as reverted
  debugHistoryEntries.value = entries.map((e, index) =>
    index >= entryIndex ? { ...e, isReverted: true } : e,
  );

  return true;
};

/**
 * Apply a state snapshot to restore state
 */
const applyStateSnapshot = (
  snapshot: StateSnapshot,
  targetId: string | null,
  targetCanvasId: number | null,
): void => {
  switch (snapshot.type) {
    case 'element': {
      if (!snapshot.elementData || !targetId) {
        console.warn('[DebugHistory] Cannot apply element snapshot: missing data');
        return;
      }

      const canvasIdToUpdate = targetCanvasId ?? activeCanvasId.value;

      // Find which canvas contains this element
      let found = false;
      canvases.value = canvases.value.map(canvas => {
        if (canvas.canvasId === canvasIdToUpdate) {
          const elementExists = canvas.elements?.some(el => el.elementId === targetId);

          if (elementExists) {
            // Update existing element
            found = true;
            return {
              ...canvas,
              elements: canvas.elements?.map(el =>
                el.elementId === targetId ? cloneState(snapshot.elementData!) : el,
              ),
            };
          } else {
            // Element was deleted - restore it
            found = true;
            return {
              ...canvas,
              elements: [...(canvas.elements || []), cloneState(snapshot.elementData!)],
            };
          }
        }
        return canvas;
      });

      if (!found) {
        console.warn(`[DebugHistory] Could not find canvas ${canvasIdToUpdate} to apply snapshot`);
      }
      break;
    }

    case 'canvas': {
      if (!snapshot.canvasData) {
        console.warn('[DebugHistory] Cannot apply canvas snapshot: missing data');
        return;
      }

      const canvasId = snapshot.canvasData.canvasId;
      const existingIndex = canvases.value.findIndex(c => c.canvasId === canvasId);

      if (existingIndex !== -1) {
        // Update existing canvas
        canvases.value = canvases.value.map(c =>
          c.canvasId === canvasId ? cloneState(snapshot.canvasData!) : c,
        );
      } else {
        // Canvas was deleted - restore it at the appropriate position
        // For now, append to end
        canvases.value = [...canvases.value, cloneState(snapshot.canvasData)];
      }
      break;
    }

    case 'presentation': {
      if (!snapshot.presentationData) {
        console.warn('[DebugHistory] Cannot apply presentation snapshot: missing data');
        return;
      }
      canvases.value = cloneState(snapshot.presentationData);
      break;
    }

    case 'document': {
      if (!snapshot.documentData) {
        console.warn('[DebugHistory] Cannot apply document snapshot: missing data');
        return;
      }
      blocks.value = cloneState(snapshot.documentData);
      break;
    }
  }
};

/**
 * Open the debug history panel
 */
export const openDebugHistoryPanel = (): void => {
  debugHistoryPanelOpen.value = true;
};

/**
 * Close the debug history panel
 */
export const closeDebugHistoryPanel = (): void => {
  debugHistoryPanelOpen.value = false;
};

/**
 * Toggle the debug history panel
 */
export const toggleDebugHistoryPanel = (): void => {
  debugHistoryPanelOpen.value = !debugHistoryPanelOpen.value;
};

/**
 * Update the history filter
 */
export const setDebugHistoryFilter = (filter: Partial<HistoryFilter>): void => {
  debugHistoryFilter.value = { ...debugHistoryFilter.value, ...filter };
};

/**
 * Clear all history entries
 */
export const clearDebugHistory = (): void => {
  debugHistoryEntries.value = [];
};

/**
 * Get a specific entry by ID
 */
export const getDebugHistoryEntry = (entryId: string): DebugHistoryEntry | undefined => {
  return debugHistoryEntries.value.find(e => e.id === entryId);
};
