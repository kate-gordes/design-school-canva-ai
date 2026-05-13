import { useEffect } from 'react';
import {
  undo,
  redo,
  canUndo,
  canRedo,
  deleteElements,
  duplicateElement,
  selectAll,
  selectedElementId,
  selectedElementIds,
  hasSelection,
  bringToFront,
  sendToBack,
} from '@/store';

// Helper to get all selected element IDs (handles both single and multi-selection)
function getSelectedIds(): string[] {
  const multiIds = Array.from(selectedElementIds.value);
  if (multiIds.length > 0) {
    return multiIds;
  }
  // Fall back to single selection
  if (selectedElementId.value) {
    return [selectedElementId.value];
  }
  return [];
}

export function useElementKeyboardShortcuts(): void {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;

      // Don't handle shortcuts when typing in inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Undo: Cmd/Ctrl + Z
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        if (canUndo.value) {
          e.preventDefault();
          undo();
        }
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if ((isMeta && e.shiftKey && e.key === 'z') || (isMeta && e.key === 'y')) {
        if (canRedo.value) {
          e.preventDefault();
          redo();
        }
        return;
      }

      // Select All: Cmd/Ctrl + A
      if (isMeta && e.key === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      // Delete: Backspace or Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (hasSelection.value) {
          e.preventDefault();
          const ids = getSelectedIds();
          if (ids.length > 0) {
            deleteElements(ids);
          }
        }
        return;
      }

      // Duplicate: Cmd/Ctrl + D
      if (isMeta && e.key === 'd') {
        if (hasSelection.value) {
          e.preventDefault();
          const ids = getSelectedIds();
          if (ids.length > 0) {
            duplicateElement(ids[0]);
          }
        }
        return;
      }

      // Bring to Front: Cmd/Ctrl + ]
      if (isMeta && e.key === ']') {
        if (hasSelection.value) {
          e.preventDefault();
          const ids = getSelectedIds();
          ids.forEach(id => bringToFront(id));
        }
        return;
      }

      // Send to Back: Cmd/Ctrl + [
      if (isMeta && e.key === '[') {
        if (hasSelection.value) {
          e.preventDefault();
          const ids = getSelectedIds();
          ids.forEach(id => sendToBack(id));
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
