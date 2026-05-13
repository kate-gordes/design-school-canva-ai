import { signal, computed } from '@preact/signals-react';
import type { ElementData, CanvasData } from './canvasState';
import {
  canvases,
  activeCanvasId,
  updateElementProperty,
  deleteElement as deleteCanvasElement,
} from './canvasState';

export type RequestScope = 'presentation' | 'page' | 'element';

// ============================================================================
// Pending Operations Tracking
// ============================================================================

export type PendingOperationType = 'generate_image' | 'edit_image' | 'generate_slide';

export interface PendingOperation {
  id: string;
  requestId: string;
  type: PendingOperationType;
  status: 'in_progress' | 'completed' | 'error';
  targetElementId?: string;
  description: string;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

// Signal tracking all pending operations
export const pendingOperations = signal<Map<string, PendingOperation>>(new Map());

// Computed: Check if any operations are in progress
export const hasPendingOperations = computed<boolean>(() =>
  Array.from(pendingOperations.value.values()).some(op => op.status === 'in_progress'),
);

// Add a new pending operation
export const addPendingOperation = (op: PendingOperation): void => {
  const newMap = new Map(pendingOperations.value);
  newMap.set(op.id, op);
  pendingOperations.value = newMap;
};

// Update an existing pending operation
export const updatePendingOperation = (
  id: string,
  updates: Partial<Omit<PendingOperation, 'id' | 'requestId'>>,
): void => {
  const operation = pendingOperations.value.get(id);
  if (!operation) return;

  const newMap = new Map(pendingOperations.value);
  newMap.set(id, { ...operation, ...updates });
  pendingOperations.value = newMap;
};

// Remove a pending operation
export const removePendingOperation = (id: string): void => {
  const newMap = new Map(pendingOperations.value);
  newMap.delete(id);
  pendingOperations.value = newMap;
};

// Get all pending operations for a specific request
export const getPendingOperationsForRequest = (requestId: string): PendingOperation[] => {
  return Array.from(pendingOperations.value.values()).filter(op => op.requestId === requestId);
};

// Generate unique operation ID
export const generateOperationId = (): string => {
  return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// AI Request Tracking
// ============================================================================

export interface OriginalState {
  type: 'element' | 'canvas';
  id: string;
  canvasId: number;
  data: Partial<ElementData> | Partial<CanvasData>;
}

export interface ChangeRecord {
  id: string;
  toolName: string;
  description: string;
  targetId: string;
  timestamp: Date;
  originalState: OriginalState;
  appliedState: OriginalState | null; // Captured when first reverted, for re-applying
  reverted: boolean;
}

export interface AIRequest {
  requestId: string;
  scope: RequestScope;
  status: 'processing' | 'completed' | 'error';
  userPrompt: string;
  changes: ChangeRecord[];
  error?: string;
  streamContent: string;
  targetCanvasId: number; // Canvas ID captured at request time for async operations
  threadId: string; // Thread ID captured at request time for routing responses
}

// Active AI requests map
export const activeRequests = signal<Map<string, AIRequest>>(new Map());

// Computed: Check if any request is processing
export const isAnyRequestProcessing = computed<boolean>(() => {
  return Array.from(activeRequests.value.values()).some(r => r.status === 'processing');
});

// Computed: Get all changes across all requests
export const allChanges = computed<ChangeRecord[]>(() => {
  const changes: ChangeRecord[] = [];
  activeRequests.value.forEach(request => {
    changes.push(...request.changes);
  });
  return changes.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
});

// Generate unique request ID
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique change ID
export const generateChangeId = (): string => {
  return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Add a new active request
export const addActiveRequest = (request: AIRequest): void => {
  const newMap = new Map(activeRequests.value);
  newMap.set(request.requestId, request);
  activeRequests.value = newMap;
};

// Update request status
export const updateRequestStatus = (
  requestId: string,
  status: AIRequest['status'],
  error?: string,
): void => {
  const request = activeRequests.value.get(requestId);
  if (!request) return;

  const newMap = new Map(activeRequests.value);
  newMap.set(requestId, { ...request, status, error });
  activeRequests.value = newMap;
};

// Update request stream content
export const updateRequestStreamContent = (requestId: string, content: string): void => {
  const request = activeRequests.value.get(requestId);
  if (!request) return;

  const newMap = new Map(activeRequests.value);
  newMap.set(requestId, { ...request, streamContent: request.streamContent + content });
  activeRequests.value = newMap;
};

// Add a change record to a request
export const addChangeToRequest = (requestId: string, change: ChangeRecord): void => {
  const request = activeRequests.value.get(requestId);
  if (!request) return;

  const newMap = new Map(activeRequests.value);
  newMap.set(requestId, {
    ...request,
    changes: [...request.changes, change],
  });
  activeRequests.value = newMap;
};

// Capture element state before modification
export const captureElementState = (elementId: string): OriginalState | null => {
  const canvasId = activeCanvasId.value;
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  const element = canvas?.elements?.find(el => el.elementId === elementId);

  if (!element) return null;

  return {
    type: 'element',
    id: elementId,
    canvasId,
    data: JSON.parse(JSON.stringify(element)),
  };
};

// Capture canvas state before modification
export const captureCanvasState = (canvasId: number): OriginalState | null => {
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  if (!canvas) return null;

  return {
    type: 'canvas',
    id: String(canvasId),
    canvasId,
    data: JSON.parse(JSON.stringify(canvas)),
  };
};

// Restore element state (for undo)
const restoreElementState = (
  canvasId: number,
  elementId: string,
  elementData: Partial<ElementData>,
): void => {
  // Check if element still exists
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  const elementExists = canvas?.elements?.some(el => el.elementId === elementId);

  if (!elementExists) {
    // Element was added - need to remove it
    // We'll use the canvasState delete function
    deleteCanvasElement(elementId);
  } else {
    // Element was modified - restore its properties
    if (elementData.style) {
      updateElementProperty(elementId, 'style', elementData.style);
    }
    if (elementData.content !== undefined) {
      updateElementProperty(elementId, 'content', elementData.content);
    }
  }
};

// Restore canvas state (for undo)
const restoreCanvasState = (canvasId: number, canvasData: Partial<CanvasData>): void => {
  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      return { ...c, ...canvasData };
    }
    return c;
  });
};

// Capture current state for a change (element or canvas)
const captureCurrentState = (change: ChangeRecord): OriginalState | null => {
  if (change.originalState.type === 'element') {
    return captureElementState(change.originalState.id);
  } else {
    return captureCanvasState(change.originalState.canvasId);
  }
};

// Toggle a change on/off (revert or re-apply)
export const toggleChange = (requestId: string, changeId: string): void => {
  const request = activeRequests.value.get(requestId);
  const change = request?.changes.find(c => c.id === changeId);

  if (!change) return;

  if (change.reverted) {
    // Re-apply the change - restore the applied state
    if (change.appliedState) {
      if (change.appliedState.type === 'element') {
        restoreElementState(
          change.appliedState.canvasId,
          change.appliedState.id,
          change.appliedState.data as Partial<ElementData>,
        );
      } else {
        restoreCanvasState(
          change.appliedState.canvasId,
          change.appliedState.data as Partial<CanvasData>,
        );
      }
    }

    // Mark as applied
    const newMap = new Map(activeRequests.value);
    const updatedRequest = {
      ...request!,
      changes: request!.changes.map(c => (c.id === changeId ? { ...c, reverted: false } : c)),
    };
    newMap.set(requestId, updatedRequest);
    activeRequests.value = newMap;
  } else {
    // Revert the change - capture current state first, then restore original
    const currentState = captureCurrentState(change);

    if (change.originalState.type === 'element') {
      restoreElementState(
        change.originalState.canvasId,
        change.originalState.id,
        change.originalState.data as Partial<ElementData>,
      );
    } else {
      restoreCanvasState(
        change.originalState.canvasId,
        change.originalState.data as Partial<CanvasData>,
      );
    }

    // Mark as reverted and store applied state
    const newMap = new Map(activeRequests.value);
    const updatedRequest = {
      ...request!,
      changes: request!.changes.map(c =>
        c.id === changeId ? { ...c, reverted: true, appliedState: currentState } : c,
      ),
    };
    newMap.set(requestId, updatedRequest);
    activeRequests.value = newMap;
  }
};

// Legacy alias for backwards compatibility
export const revertChange = toggleChange;

// Revert all changes in a request
export const revertAllChanges = (requestId: string): void => {
  const request = activeRequests.value.get(requestId);
  if (!request) return;

  // Revert in reverse order (newest first)
  const reversedChanges = [...request.changes].reverse();
  for (const change of reversedChanges) {
    if (!change.reverted) {
      revertChange(requestId, change.id);
    }
  }
};

// Clear a completed request
export const clearRequest = (requestId: string): void => {
  const newMap = new Map(activeRequests.value);
  newMap.delete(requestId);
  activeRequests.value = newMap;
};

// Clear all completed/errored requests
export const clearCompletedRequests = (): void => {
  const newMap = new Map(activeRequests.value);
  activeRequests.value.forEach((request, requestId) => {
    if (request.status !== 'processing') {
      newMap.delete(requestId);
    }
  });
  activeRequests.value = newMap;
};

// Get request by ID
export const getRequest = (requestId: string): AIRequest | undefined => {
  return activeRequests.value.get(requestId);
};

// Get non-reverted changes for a request
export const getActiveChanges = (requestId: string): ChangeRecord[] => {
  const request = activeRequests.value.get(requestId);
  if (!request) return [];
  return request.changes.filter(c => !c.reverted);
};
