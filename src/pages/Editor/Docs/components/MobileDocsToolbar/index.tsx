import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { PlusIcon, CheckIcon, MagicWandIcon, XIcon } from '@canva/easel/icons';
import { BoldIcon, ItalicIcon, UnderlineIcon } from '@canva/easel/icons';
import NavCanvaAIIconActive from '@/shared_components/icons/NavCanvaAIIconActive';
import {
  mobileDocsEditingBlockId,
  openMobileDocsActionsSheet,
  setAIPanelOpen,
  aiPanelOpen,
  docsSelectedText,
  clearDocsSelectedText,
  insertMarkdownPrefix,
} from '@/store';
import styles from './MobileDocsToolbar.module.css';

/**
 * Computes the toolbar's `top` value so it sits right above the keyboard.
 * Uses visualViewport (accounts for iOS scroll offset and keyboard) to
 * position the toolbar at the bottom of the *visible* area, not the layout viewport.
 */
function useToolbarTop(): number | undefined {
  const [top, setTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      // visualViewport.offsetTop = how far the visual viewport is scrolled within layout viewport
      // visualViewport.height = height of the visible area (shrinks when keyboard overlays or resizes)
      setTop(vv.offsetTop + vv.height - 44); // 44 = toolbar height
    };

    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

  return top;
}

export default function MobileDocsToolbar(): React.ReactNode {
  useSignals();

  const isEditing = !!mobileDocsEditingBlockId.value;
  const hasSelection = !!docsSelectedText.value && !isEditing;

  // Hide toolbar when AI panel is open — they should never coexist
  if (aiPanelOpen.value) return null;

  // Show toolbar when editing OR when text is selected (without keyboard)
  if (!isEditing && !hasSelection) return null;

  const preventFocus = (e: React.MouseEvent) => e.preventDefault();

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('bold');
  };

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('italic');
  };

  const handleActions = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    (document.activeElement as HTMLElement)?.blur();
    openMobileDocsActionsSheet();
  };

  const handleDone = () => {
    (document.activeElement as HTMLElement)?.blur();
  };

  const handleDismissSelection = () => {
    clearDocsSelectedText();
  };

  const handleAskAI = () => {
    // Wrap the native selection in a purple <mark> before opening the AI panel.
    // In non-editing mode there's no blur event to trigger mark wrapping, so we do it here.
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      try {
        const range = sel.getRangeAt(0);
        const mark = document.createElement('mark');
        mark.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
        mark.style.borderRadius = '2px';
        mark.dataset.docsHighlight = 'true';
        range.surroundContents(mark);
      } catch {
        // Range spans multiple elements — chip still works, just no visual highlight
      }
      sel.removeAllRanges();
    }
    setAIPanelOpen(true);
  };

  // Selection mode: simplified toolbar without keyboard-specific actions
  if (hasSelection) {
    return ReactDOM.createPortal(
      <SelectionToolbar onAskAI={handleAskAI} onDismiss={handleDismissSelection} />,
      document.body,
    );
  }

  // Editing mode: full toolbar above keyboard
  return ReactDOM.createPortal(
    <EditingToolbar
      onActions={handleActions}
      onBold={handleBold}
      onItalic={handleItalic}
      onDone={handleDone}
      preventFocus={preventFocus}
    />,
    document.body,
  );
}

function SelectionToolbar({
  onAskAI,
  onDismiss,
}: {
  onAskAI: () => void;
  onDismiss: () => void;
}): React.ReactNode {
  // Use onMouseDown + preventDefault on all buttons to prevent tapping from
  // collapsing the native selection (matches the pattern in EditingToolbar).
  const handleAskAI = (e: React.MouseEvent) => {
    e.preventDefault();
    onAskAI();
  };

  const handleBold = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('bold');
  };

  const handleItalic = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('italic');
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    onDismiss();
  };

  return (
    <div className={`${styles.toolbar} ${styles.toolbarSelection}`}>
      <button
        type="button"
        className={styles.toolbarButton}
        onMouseDown={handleAskAI}
        aria-label="Magic Write"
      >
        <MagicWandIcon size="small" />
        <span className={styles.toolbarLabel}>Ask AI</span>
      </button>

      <div className={styles.toolbarDivider} />

      <button
        type="button"
        className={styles.toolbarButton}
        onMouseDown={handleBold}
        aria-label="Bold"
      >
        <BoldIcon size="small" />
      </button>

      <button
        type="button"
        className={styles.toolbarButton}
        onMouseDown={handleItalic}
        aria-label="Italic"
      >
        <ItalicIcon size="small" />
      </button>

      <div className={styles.toolbarDivider} />

      <button
        type="button"
        className={styles.doneButton}
        onMouseDown={handleDismiss}
        aria-label="Clear selection"
      >
        <XIcon size="small" />
      </button>
    </div>
  );
}

function EditingToolbar({
  onActions,
  onBold,
  onItalic,
  onDone,
  preventFocus,
}: {
  onActions: (e: React.MouseEvent) => void;
  onBold: (e: React.MouseEvent) => void;
  onItalic: (e: React.MouseEvent) => void;
  onDone: () => void;
  preventFocus: (e: React.MouseEvent) => void;
}): React.ReactNode {
  const top = useToolbarTop();

  const handleAskCanva = (e: React.MouseEvent) => {
    e.preventDefault();
    setAIPanelOpen(true);
  };

  const handleUnderline = (e: React.MouseEvent) => {
    e.preventDefault();
    document.execCommand('underline');
  };

  const handleH1 = (e: React.MouseEvent) => {
    e.preventDefault();
    const blockId = mobileDocsEditingBlockId.value;
    if (blockId) insertMarkdownPrefix(blockId, '# ');
  };

  const handleH2 = (e: React.MouseEvent) => {
    e.preventDefault();
    const blockId = mobileDocsEditingBlockId.value;
    if (blockId) insertMarkdownPrefix(blockId, '## ');
  };

  // Use position:absolute + top from visualViewport — immune to iOS fixed-positioning bugs
  return (
    <div
      className={styles.toolbar}
      style={top !== undefined ? { position: 'absolute', bottom: 'auto', top } : undefined}
    >
      <div className={styles.toolbarScrollable}>
        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={handleAskCanva}
          aria-label="Ask Canva"
        >
          <NavCanvaAIIconActive size={20} />
          <span className={styles.toolbarLabel}>Ask Canva</span>
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={onActions}
          aria-label="Insert block"
        >
          <PlusIcon size="small" />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={onActions}
          aria-label="Actions"
        >
          <span className={styles.toolbarLabel}>Actions</span>
        </button>

        <div className={styles.toolbarDivider} />

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={handleH1}
          aria-label="Heading 1"
        >
          <span className={styles.toolbarLabel}>H1</span>
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={handleH2}
          aria-label="Heading 2"
        >
          <span className={styles.toolbarLabel}>H2</span>
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={onBold}
          aria-label="Bold"
        >
          <BoldIcon size="small" />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={onItalic}
          aria-label="Italic"
        >
          <ItalicIcon size="small" />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onMouseDown={handleUnderline}
          aria-label="Underline"
        >
          <UnderlineIcon size="small" />
        </button>
      </div>

      <div className={styles.toolbarDoneArea}>
        <button
          type="button"
          className={styles.doneButton}
          onClick={onDone}
          aria-label="Done editing"
        >
          <CheckIcon size="small" />
        </button>
      </div>
    </div>
  );
}
