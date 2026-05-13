import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import styles from '../../docs.module.css';
import CommandMenu from '../CommandMenu';
import BlockCaret from '../BlockCaret';
import PlusCircleIcon from '@/shared_components/icons/PlusCircleIcon';
import type { BlockData, BlockType } from '@/store';
import {
  updateBlockMarkdown,
  updateBlockType,
  deleteBlock,
  addBlock,
  setActiveBlock,
  focusPreviousBlock,
  focusNextBlock,
  commandMenuOpen,
  commandMenuBlockId,
  openCommandMenu,
  closeCommandMenu,
  blocks,
  undo,
  redo,
  docsSelectedText,
  setDocsSelectedText,
  clearDocsSelectedText,
  mobileDocsEditingBlockId,
  enterMobileDocsEditing,
  exitMobileDocsEditing,
  aiPanelOpen,
} from '@/store';
import { flushPendingChange } from '@/store/signals/docsHistory';
import useIsMobile from '@/hooks/useIsMobile';
import {
  activeStreamingSession,
  streamingConfig,
  skipBlockAnimation,
  cancelStreamingSession,
} from '@/store/signals/docsStreaming';
import { collabSimSessions, getCollabSessionForBlock } from '@/store/signals/collaborationSim';

interface BlockProps {
  block: BlockData;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
}

// Get style class based on block type
function getBlockStyle(blockType: BlockType): string {
  switch (blockType) {
    case 'h1':
      return styles.blockHeading1;
    case 'h2':
      return styles.blockHeading2;
    case 'h3':
      return styles.blockHeading3;
    case 'bullet':
      return styles.blockBullet;
    case 'numbered':
      return styles.blockNumbered;
    case 'quote':
      return styles.blockQuote;
    default:
      return '';
  }
}

// Detect inline markdown prefix typed by the user
function detectInlinePrefix(text: string): { blockType: BlockType; content: string } | null {
  if (text.startsWith('### ')) return { blockType: 'h3', content: text.slice(4) };
  if (text.startsWith('## ') && !text.startsWith('### '))
    return { blockType: 'h2', content: text.slice(3) };
  if (text.startsWith('# ') && !text.startsWith('## '))
    return { blockType: 'h1', content: text.slice(2) };
  if (text.startsWith('- ')) return { blockType: 'bullet', content: text.slice(2) };
  if (text.startsWith('> ')) return { blockType: 'quote', content: text.slice(2) };
  if (/^\d+\. /.test(text)) {
    const match = text.match(/^(\d+\. )/);
    if (match) return { blockType: 'numbered', content: text.slice(match[1].length) };
  }
  return null;
}

// Convert inline markdown to HTML for rendering in contentEditable
function markdownToInlineHtml(markdown: string): string {
  let html = markdown;
  // Escape HTML entities
  html = html.replace(/&/g, '&amp;');
  html = html.replace(/</g, '&lt;');
  html = html.replace(/>/g, '&gt;');
  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic: *text* (but not ** which is bold)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  // Underline: __text__
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');
  return html;
}

// Convert HTML from contentEditable back to inline markdown
function htmlToInlineMarkdown(html: string): string {
  let md = html;
  // Convert <strong> and <b> to **
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  // Convert <em> and <i> to *
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');
  // Convert <u> to __
  md = md.replace(/<u>(.*?)<\/u>/gi, '__$1__');
  // Convert <br> to empty (single block, no line breaks)
  md = md.replace(/<br\s*\/?>/gi, '');
  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');
  // Decode HTML entities
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&amp;/g, '&');
  return md;
}

// Move cursor to end of a contentEditable element
function moveCursorToEnd(el: HTMLElement): void {
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

// Move cursor to a specific character offset within a contentEditable element
function setCursorPosition(el: HTMLElement, offset: number): void {
  const selection = window.getSelection();
  if (!selection) {
    moveCursorToEnd(el);
    return;
  }
  // Walk through text nodes to find the correct position
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const len = node.textContent?.length ?? 0;
    if (remaining <= len) {
      const range = document.createRange();
      range.setStart(node, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= len;
  }
  moveCursorToEnd(el);
}

// Compute the list number for a numbered block
function computeListNumber(blockId: string): number {
  const allBlocks = blocks.value;
  const index = allBlocks.findIndex(b => b.blockId === blockId);
  let num = 1;
  for (let j = index - 1; j >= 0; j--) {
    if (allBlocks[j].blockType === 'numbered') {
      num++;
    } else {
      break;
    }
  }
  return num;
}

export default function Block({ block, isActive, isFirst }: BlockProps): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();
  const isMobileEditing = isMobile && mobileDocsEditingBlockId.value === block.blockId;
  const blockRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastKnownContent = useRef<string>('');
  const savedCursorPos = useRef<number | null>(null);
  // Saved selection range for persisting visual highlight when focus leaves (mobile long-press)
  const pendingMarkRange = useRef<Range | null>(null);
  // Guard: suppress selectionchange → clearDocsSelectedText after we intentionally clear
  // native selection (e.g., after wrapping in <mark>)
  const suppressNextSelectionClear = useRef(false);
  const [slashQuery, setSlashQuery] = useState('');

  // Check if command menu is open for this block
  const isMenuOpen = commandMenuOpen.value && commandMenuBlockId.value === block.blockId;

  const blockStyle = getBlockStyle(block.blockType);
  const listNumber = block.blockType === 'numbered' ? computeListNumber(block.blockId) : undefined;

  // --- Streaming state ---
  const session = activeStreamingSession.value;
  const streamEntry = session?.queue.find(b => b.blockId === block.blockId);
  const isBlockStreaming = streamEntry?.status === 'streaming' || streamEntry?.status === 'pending';
  const isBlockLingering = streamEntry?.status === 'lingering';
  const isBlockCompleting = streamEntry?.status === 'completing';
  const isInStreamingMode = isBlockStreaming || isBlockLingering || isBlockCompleting;

  // --- Collab sim state (multi-session) ---
  // Read the sessions signal to subscribe to changes
  const _collabSessions = collabSimSessions.value;
  const collabSession = getCollabSessionForBlock(block.blockId);
  const isInCollabMode = !!collabSession;

  // Set initial content on mount
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = markdownToInlineHtml(block.markdown);
      lastKnownContent.current = block.markdown;
    }
  }, []); // Only on mount

  // Focus this block when it becomes active (desktop only — mobile uses tap-to-edit)
  useEffect(() => {
    if (isActive && contentRef.current && !isMobile) {
      contentRef.current.focus();
      moveCursorToEnd(contentRef.current);
    }
  }, [isActive, isMobile]);

  // Mobile: focus and scroll into view when entering editing mode
  useEffect(() => {
    if (isMobileEditing && contentRef.current) {
      contentRef.current.focus();
      moveCursorToEnd(contentRef.current);
      contentRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [isMobileEditing]);

  // Sync content when markdown changes externally (not from user input)
  useEffect(() => {
    if (isInStreamingMode || isInCollabMode) return; // Streaming/collab controls innerHTML directly
    if (contentRef.current && block.markdown !== lastKnownContent.current) {
      lastKnownContent.current = block.markdown;
      contentRef.current.innerHTML = markdownToInlineHtml(block.markdown);
    }
  }, [block.markdown, isInStreamingMode, isInCollabMode]);

  // Streaming content rendering — reveals content chunk by chunk
  useEffect(() => {
    if (!contentRef.current || !streamEntry) return;

    if (streamEntry.status === 'pending') {
      // Block exists but empty until its turn
      contentRef.current.innerHTML = '';
    } else if (streamEntry.status === 'selecting') {
      // Show OLD content highlighted — signals this block is about to be replaced
      const oldText = streamEntry.oldContent ?? block.markdown;
      const existingHtml = markdownToInlineHtml(oldText);
      contentRef.current.innerHTML = `<span class="${styles.streamingSelecting}">${existingHtml}</span>`;
    } else if (streamEntry.status === 'streaming') {
      const partialContent = streamEntry.fullContent.slice(0, streamEntry.revealedLength);
      const html = markdownToInlineHtml(partialContent);
      contentRef.current.innerHTML = `<span class="${styles.streamingHighlight}">${html}</span><span class="${styles.streamingCursorInline}"></span>`;
    } else if (streamEntry.status === 'lingering') {
      // Full content with solid highlight, no cursor. Sets the CSS variable
      // so the upcoming class-swap to streamingHighlightFade uses the right duration.
      const fadeDuration = streamingConfig.value.fadeDurationMs;
      const html = markdownToInlineHtml(streamEntry.fullContent);
      contentRef.current.innerHTML = `<span class="${styles.streamingHighlight}" style="--streaming-fade-ms: ${fadeDuration}ms">${html}</span>`;
    } else if (streamEntry.status === 'completing') {
      // Swap highlight class → fade class on the existing span to trigger CSS transition
      const highlightSpan = contentRef.current.querySelector(`.${styles.streamingHighlight}`);
      if (highlightSpan) {
        highlightSpan.className = styles.streamingHighlightFade;
      }
      lastKnownContent.current = streamEntry.fullContent;
    } else if (streamEntry.status === 'done') {
      // Streaming finished — sync to real content
      contentRef.current.innerHTML = markdownToInlineHtml(block.markdown);
      lastKnownContent.current = block.markdown;
    }
  }, [streamEntry?.status, streamEntry?.revealedLength, block.markdown]);

  // Collaboration simulation rendering — shows remote user selecting, deleting, typing
  // Uses inline styles with the session's color so multiple collaborators look distinct
  useEffect(() => {
    if (!contentRef.current || !collabSession) return;

    const {
      status,
      color,
      oldContent,
      diffStart,
      diffOldEnd,
      diffNewText,
      selectionProgress,
      typedLength,
      typoBuffer,
    } = collabSession;

    const bgStyle = `background:${color.bg};border-radius:2px;padding:1px 0`;
    const cursorStyle = `display:inline-block;width:2.5px;height:1.25em;background-color:${color.cursor};margin-left:1px;vertical-align:text-bottom;animation:collabBlink 1s step-end infinite`;
    const cursorHtml = `<span class="${styles.collabCursorInline}" data-collab-session="${collabSession.id}" style="${cursorStyle}"></span>`;

    if (status === 'selecting') {
      const prefix = markdownToInlineHtml(oldContent.slice(0, diffStart));
      const selectedPart = markdownToInlineHtml(
        oldContent.slice(diffStart, diffStart + selectionProgress),
      );
      const unselected = markdownToInlineHtml(
        oldContent.slice(diffStart + selectionProgress, diffOldEnd),
      );
      const suffix = markdownToInlineHtml(oldContent.slice(diffOldEnd));
      contentRef.current.innerHTML = `${prefix}<span style="${bgStyle}">${selectedPart}</span>${unselected}${suffix}`;
    } else if (status === 'deleting') {
      const prefix = markdownToInlineHtml(oldContent.slice(0, diffStart));
      const suffix = markdownToInlineHtml(oldContent.slice(diffOldEnd));
      contentRef.current.innerHTML = `${prefix}${cursorHtml}${suffix}`;
    } else if (status === 'typing') {
      const prefix = markdownToInlineHtml(oldContent.slice(0, diffStart));
      const typed = markdownToInlineHtml(diffNewText.slice(0, typedLength));
      const typo = typoBuffer ? markdownToInlineHtml(typoBuffer) : '';
      const suffix = markdownToInlineHtml(oldContent.slice(diffOldEnd));
      contentRef.current.innerHTML = `${prefix}<span style="${bgStyle}">${typed}${typo}</span>${cursorHtml}${suffix}`;
    }
  }, [
    collabSession?.status,
    collabSession?.selectionProgress,
    collabSession?.typedLength,
    collabSession?.typoBuffer,
    collabSession?.id,
  ]);

  // Refocus block when command menu closes for this block
  const wasMenuOpenForThisBlock = useRef(false);
  useEffect(() => {
    const isMenuOpenForThisBlock =
      commandMenuOpen.value && commandMenuBlockId.value === block.blockId;

    if (wasMenuOpenForThisBlock.current && !isMenuOpenForThisBlock) {
      // Menu just closed for this block - refocus with cursor at saved position
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          if (savedCursorPos.current !== null) {
            setCursorPosition(contentRef.current, savedCursorPos.current);
            savedCursorPos.current = null;
          } else {
            moveCursorToEnd(contentRef.current);
          }
        }
      }, 0);
    }

    wasMenuOpenForThisBlock.current = isMenuOpenForThisBlock;
  });

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      let text = htmlToInlineMarkdown(contentRef.current.innerHTML);

      // Check for slash command trigger (disabled on mobile)
      if (!isMobile) {
        const slashIndex = text.lastIndexOf('/');
        if (slashIndex !== -1) {
          const query = text.slice(slashIndex + 1);
          setSlashQuery(query);
          // Save cursor position and strip the slash (and query) from visible text
          savedCursorPos.current = slashIndex;
          text = text.slice(0, slashIndex);
          contentRef.current.innerHTML = markdownToInlineHtml(text);
          moveCursorToEnd(contentRef.current);
          if (!isMenuOpen) {
            openCommandMenu(block.blockId);
          }
        } else if (isMenuOpen) {
          closeCommandMenu();
          setSlashQuery('');
        }
      }

      // Check if user just typed a markdown prefix (e.g., "# " or "## ")
      if (block.blockType === 'paragraph') {
        const detected = detectInlinePrefix(text);
        if (detected) {
          updateBlockType(block.blockId, detected.blockType);
          text = detected.content;
          contentRef.current.innerHTML = markdownToInlineHtml(text);
          moveCursorToEnd(contentRef.current);
        }
      }

      lastKnownContent.current = text;
      updateBlockMarkdown(block.blockId, text);
    }
  }, [block.blockId, block.blockType, isMenuOpen, isMobile]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Undo: Cmd+Z (without Shift)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        cancelStreamingSession();
        flushPendingChange();
        undo();
        return;
      }

      // Redo: Cmd+Shift+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        cancelStreamingSession();
        redo();
        return;
      }

      const text = contentRef.current?.innerText ?? '';

      // Handle Escape - close command menu
      if (e.key === 'Escape' && isMenuOpen) {
        e.preventDefault();
        closeCommandMenu();
        setSlashQuery('');
        return;
      }

      // Handle Enter - creates new block (but not if menu is open)
      if (e.key === 'Enter' && !e.shiftKey) {
        if (isMenuOpen) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        addBlock(block.blockId);
        return;
      }

      // Handle Backspace on empty block
      if (e.key === 'Backspace' && text.trim() === '') {
        // If block has a non-paragraph type, revert to paragraph first
        if (block.blockType !== 'paragraph') {
          e.preventDefault();
          updateBlockType(block.blockId, 'paragraph');
          return;
        }
        // Empty paragraph block - delete it (unless it's the first/only block)
        if (!isFirst) {
          e.preventDefault();
          deleteBlock(block.blockId);
          return;
        }
      }

      // Handle Arrow Up at start of content
      if (e.key === 'ArrowUp') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (range.startOffset === 0 && range.collapsed) {
            const textBeforeCursor =
              contentRef.current?.innerText.slice(0, range.startOffset) ?? '';
            if (!textBeforeCursor.includes('\n')) {
              e.preventDefault();
              focusPreviousBlock(block.blockId);
            }
          }
        }
      }

      // Handle Arrow Down at end of content
      if (e.key === 'ArrowDown') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const textNode = range.startContainer;
          const isAtEnd =
            textNode.nodeType === Node.TEXT_NODE
              ? range.startOffset === (textNode.textContent?.length ?? 0)
              : range.startOffset === contentRef.current?.childNodes.length;

          if (isAtEnd && range.collapsed) {
            const fullText = contentRef.current?.innerText ?? '';
            const textAfterCursor = fullText.slice(range.startOffset);
            if (!textAfterCursor.includes('\n')) {
              e.preventDefault();
              focusNextBlock(block.blockId);
            }
          }
        }
      }
    },
    [block.blockId, block.blockType, isFirst, isMenuOpen],
  );

  const handleFocus = useCallback(() => {
    // If this block is in any active streaming state, skip to done
    if (streamEntry && streamEntry.status !== 'done') {
      skipBlockAnimation(block.blockId);
    }
    setActiveBlock(block.blockId);
  }, [block.blockId, streamEntry]);

  // Suppress browser's native undo/redo (we handle it ourselves)
  const handleBeforeInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const inputEvent = e.nativeEvent as InputEvent;
    if (inputEvent.inputType === 'historyUndo' || inputEvent.inputType === 'historyRedo') {
      e.preventDefault();
    }
  }, []);

  // Track text selection for AI panel integration
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    const selectedText = sel?.toString().trim();
    if (selectedText && selectedText.length > 0 && sel!.rangeCount > 0) {
      setDocsSelectedText(selectedText, block.blockId);
      // Desktop already wraps here — clear pending range so blur doesn't double-wrap
      pendingMarkRange.current = null;

      // Wrap selection in a <mark> so the highlight persists when focus moves to AI panel
      try {
        const range = sel!.getRangeAt(0);
        const mark = document.createElement('mark');
        mark.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
        mark.style.borderRadius = '2px';
        mark.dataset.docsHighlight = 'true';
        range.surroundContents(mark);
      } catch {
        // Range spans multiple elements — chip still works, just no visual highlight
      }
    }
  }, [block.blockId]);

  // Remove highlight <mark> elements when selection clears or moves to another block
  const currentDocsSelection = docsSelectedText.value;
  useEffect(() => {
    if (!contentRef.current) return;
    if (currentDocsSelection && currentDocsSelection.blockId === block.blockId) return;
    // Selection cleared or moved — unwrap any marks in this block
    const marks = contentRef.current.querySelectorAll('mark[data-docs-highlight]');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
        parent.removeChild(mark);
      }
    });
  }, [currentDocsSelection, block.blockId]);

  // On mobile: re-read the final selection on touchend (user finished adjusting handles).
  // We intentionally do NOT wrap in <mark> here — the native blue selection stays visible.
  // Purple <mark> is applied later when the user taps "Ask AI" (SelectionToolbar) or
  // when the block blurs (handleBlur) after the AI panel input auto-focuses.
  useEffect(() => {
    if (!isMobile) return;
    const el = contentRef.current;
    if (!el) return;

    const handleTouchEnd = () => {
      // Small delay to let the final selectionchange settle
      setTimeout(() => {
        if (!contentRef.current) return;

        const sel = window.getSelection();
        if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (contentRef.current.contains(range.commonAncestorContainer)) {
            const finalText = sel.toString().trim();
            if (finalText) {
              setDocsSelectedText(finalText, block.blockId);
              pendingMarkRange.current = range.cloneRange();
            }
          }
        }
      }, 50);
    };

    el.addEventListener('touchend', handleTouchEnd);
    return () => el.removeEventListener('touchend', handleTouchEnd);
  }, [isMobile, block.blockId]);

  // Track text selection changes for both clearing and detecting new selections.
  // Handles mobile long-press selection (which fires selectionchange but not always mouseup).
  // On mobile, use a longer debounce (300ms) to let the user finish adjusting selection handles
  // before wrapping in <mark>. On desktop, use immediate (0ms) debounce.
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    const debounceMs = isMobile ? 300 : 0;

    const handleSelectionChange = () => {
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        const active = document.activeElement;
        const isInContentEditable = active?.getAttribute('contenteditable') === 'true';
        // On desktop, skip if focus left contentEditable (moved to AI panel, etc.)
        // On mobile, selection can happen even when contentEditable=false (user-select: text),
        // so we only skip if focus is on something interactive like an input/textarea.
        if (!isMobile && !isInContentEditable) return;
        if (isMobile && (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA')) return;

        const sel = window.getSelection();
        if (!sel || sel.isCollapsed || !sel.toString().trim()) {
          // Only clear if the current docsSelectedText belongs to THIS block.
          // Otherwise another block's listener would wipe the selection.
          const current = docsSelectedText.value;
          if (!current || current.blockId !== block.blockId) return;
          // Don't clear if we just intentionally removed the native selection (mark wrapping)
          if (suppressNextSelectionClear.current) {
            suppressNextSelectionClear.current = false;
            return;
          }
          // Don't clear if the AI panel just opened — the debounced handler may fire
          // after setAIPanelOpen(true) collapsed the native selection
          if (aiPanelOpen.value) return;
          clearDocsSelectedText();
          return;
        }

        // Detect new non-empty selection within this block's contentRef
        const selectedText = sel.toString().trim();
        if (selectedText && contentRef.current && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          if (contentRef.current.contains(range.commonAncestorContainer)) {
            setDocsSelectedText(selectedText, block.blockId);
            pendingMarkRange.current = range.cloneRange();
          }
        }
      }, debounceMs);
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (timerId) clearTimeout(timerId);
    };
  }, [block.blockId, isMobile]);

  // Flush pending text changes when focus leaves, and persist visual highlight
  const handleBlur = useCallback(() => {
    flushPendingChange();
    if (isMobile) {
      exitMobileDocsEditing();
    }
    // Wrap saved selection range in <mark> so highlight persists after native selection collapses
    // (e.g., when user taps Canva AI button after long-press selecting text on mobile)
    if (pendingMarkRange.current && docsSelectedText.value?.blockId === block.blockId) {
      const existingMarks = contentRef.current?.querySelectorAll('mark[data-docs-highlight]');
      if (!existingMarks || existingMarks.length === 0) {
        try {
          const mark = document.createElement('mark');
          mark.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
          mark.style.borderRadius = '2px';
          mark.dataset.docsHighlight = 'true';
          pendingMarkRange.current.surroundContents(mark);
        } catch {
          // Range spans multiple elements or is no longer valid
        }
      }
      pendingMarkRange.current = null;
    }
  }, [block.blockId, isMobile]);

  const handleAddBlockClick = useCallback(() => {
    openCommandMenu(block.blockId);
  }, [block.blockId]);

  const placeholder = isFirst
    ? isMobile
      ? 'Start typing'
      : 'Start typing or hit / for Magic Write'
    : '';
  const contentClassName = [styles.blockContent, blockStyle].filter(Boolean).join(' ');
  const blockClassName = [
    styles.block,
    isActive && styles.blockActive,
    isInStreamingMode && styles.blockStreamingActive,
    isInCollabMode && styles.blockCollabActive,
  ]
    .filter(Boolean)
    .join(' ');

  const handleMobileTap = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile && !isMobileEditing) {
        // Don't enter editing mode if the AI panel is open — let the user
        // interact with the AI panel without the block stealing focus.
        if (aiPanelOpen.value) return;
        // Don't enter editing mode if user just selected text (long-press)
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) return;
        e.preventDefault();
        enterMobileDocsEditing(block.blockId);
      }
    },
    [isMobile, isMobileEditing, block.blockId],
  );

  const contentElement = (
    <div
      ref={contentRef}
      className={contentClassName}
      contentEditable={!isInStreamingMode && !isInCollabMode && (!isMobile || isMobileEditing)}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseUp={handleMouseUp}
      onBeforeInput={handleBeforeInput}
      onClick={handleMobileTap}
      data-placeholder={placeholder}
      data-list-number={listNumber}
      role="textbox"
      aria-label="Block content"
    />
  );

  return (
    <div ref={blockRef} className={blockClassName} data-block-id={block.blockId}>
      {!isMobile && (
        <button
          type="button"
          className={styles.blockAddButton}
          onClick={handleAddBlockClick}
          aria-label="Open block commands"
        >
          <PlusCircleIcon size={26} />
        </button>
      )}
      {contentElement}
      {!isMobile && (
        <BlockCaret
          blockRef={blockRef}
          contentRef={contentRef}
          isStreaming={isInStreamingMode}
          isCollab={isInCollabMode}
          collabSessionId={collabSession?.id}
        />
      )}
      <CommandMenu
        blockId={block.blockId}
        open={isMenuOpen}
        referenceElement={contentRef.current}
        searchQuery={slashQuery}
      />
    </div>
  );
}
