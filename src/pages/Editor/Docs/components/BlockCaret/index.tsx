import React, { useRef, useLayoutEffect, useCallback, useState } from 'react';
import {
  collabSimSessions,
  collabCanvaAIMode,
  collabAILingerMs,
} from '@/store/signals/collaborationSim';
import { streamingConfig } from '@/store/signals/docsStreaming';
import { getCollabName, clearCollabName } from './collabNames';
import styles from '../../docs.module.css';

const AI_COLOR = '#8B5CF6';
const DOT_SIZE = 8;

interface BlockCaretProps {
  blockRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  isStreaming: boolean;
  isCollab: boolean;
  collabSessionId?: string;
}

export default function BlockCaret({
  blockRef,
  contentRef,
  isStreaming,
  isCollab,
  collabSessionId,
}: BlockCaretProps): React.ReactNode {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Track last known position for lingering
  const lastPos = useRef<{ x: number; y: number; h: number } | null>(null);
  const isLingering = useRef(false);

  const caretId = isCollab && collabSessionId ? collabSessionId : isStreaming ? 'ai' : null;

  const getLabel = useCallback((): string => {
    if (!caretId) return '';
    if (caretId === 'ai') return 'Canva AI';
    const fullName = getCollabName(caretId);
    const firstName = fullName.split(' ')[0];
    return collabCanvaAIMode.value ? `${firstName} (Canva AI)` : fullName;
  }, [caretId]);

  const getColor = useCallback((): string => {
    if (!caretId || caretId === 'ai') return AI_COLOR;
    const session = collabSimSessions.value.find(s => s.id === caretId);
    return session?.color.cursor ?? AI_COLOR;
  }, [caretId]);

  const updateOverlay = useCallback(() => {
    const overlay = overlayRef.current;
    const block = blockRef.current;
    const content = contentRef.current;
    if (!overlay || !block || !content) return;

    // Find the inline cursor element within this block's content
    let cursorEl: HTMLElement | null = null;
    if (isStreaming) {
      cursorEl = content.querySelector(`.${styles.streamingCursorInline}`);
    } else if (isCollab && collabSessionId) {
      cursorEl = content.querySelector(`[data-collab-session="${collabSessionId}"]`);
    }

    if (cursorEl) {
      const blockRect = block.getBoundingClientRect();
      const cursorRect = cursorEl.getBoundingClientRect();
      if (cursorRect.height > 0) {
        const x = cursorRect.left - blockRect.left;
        const y = cursorRect.top - blockRect.top;
        const h = cursorRect.height;
        lastPos.current = { x, y, h };
        isLingering.current = false;

        // Clear any pending linger timer since cursor is active
        if (lingerTimer.current) {
          clearTimeout(lingerTimer.current);
          lingerTimer.current = null;
        }

        overlay.style.display = '';
        overlay.style.left = `${x - 1}px`;
        overlay.style.top = `${y - DOT_SIZE}px`;

        // Update cursor line height
        const cursorLine = overlay.querySelector<HTMLElement>('[data-caret-line]');
        if (cursorLine) cursorLine.style.height = `${h}px`;

        // Update dot color
        const dot = overlay.querySelector<HTMLElement>('[data-caret-dot]');
        if (dot) dot.style.backgroundColor = getColor();

        // Update cursor line color
        if (cursorLine) cursorLine.style.backgroundColor = getColor();

        return;
      }
    }

    // Cursor not found — if we were previously visible, start lingering
    if (lastPos.current && !isLingering.current && !lingerTimer.current) {
      isLingering.current = true;

      // For AI caret lingering: snap to end of last streaming highlight
      if (caretId === 'ai') {
        const highlights = content.querySelectorAll(
          `.${styles.streamingHighlight}, .${styles.streamingHighlightFade}`,
        );
        const highlightSpan = highlights.length > 0 ? highlights[highlights.length - 1] : null;
        if (highlightSpan) {
          const walker = document.createTreeWalker(highlightSpan, NodeFilter.SHOW_TEXT);
          let lastText: Text | null = null;
          let node: Node | null;
          while ((node = walker.nextNode())) lastText = node as Text;
          if (lastText && block) {
            const range = document.createRange();
            range.setStart(lastText, lastText.length);
            range.collapse(true);
            const rect = range.getBoundingClientRect();
            const blockRect = block.getBoundingClientRect();
            if (rect.height > 0) {
              lastPos.current = {
                x: rect.left - blockRect.left,
                y: rect.top - blockRect.top,
                h: rect.height,
              };
            }
          }
        }
      }

      // Position at last known location
      const pos = lastPos.current;
      overlay.style.display = '';
      overlay.style.left = `${pos.x - 1}px`;
      overlay.style.top = `${pos.y - DOT_SIZE}px`;

      const cursorLine = overlay.querySelector<HTMLElement>('[data-caret-line]');
      if (cursorLine) cursorLine.style.height = `${pos.h}px`;

      const collabLingerMs = collabCanvaAIMode.value ? collabAILingerMs.value : 2000;
      const lingerMs = caretId === 'ai' ? streamingConfig.value.lingerMs + 2000 : collabLingerMs;

      lingerTimer.current = setTimeout(() => {
        lingerTimer.current = null;
        isLingering.current = false;
        lastPos.current = null;
        if (overlayRef.current) overlayRef.current.style.display = 'none';
        if (caretId && caretId !== 'ai') clearCollabName(caretId);
      }, lingerMs);
    } else if (!lastPos.current) {
      overlay.style.display = 'none';
    }
  }, [blockRef, contentRef, isStreaming, isCollab, collabSessionId, caretId, getColor]);

  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content || !caretId) return;

    // Initial measurement
    updateOverlay();

    // Observe DOM mutations inside the block's content
    const mutationObserver = new MutationObserver(updateOverlay);
    mutationObserver.observe(content, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Observe size changes on the content div
    const resizeObserver = new ResizeObserver(updateOverlay);
    resizeObserver.observe(content);

    // Listen for window resize
    window.addEventListener('resize', updateOverlay);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateOverlay);
      if (lingerTimer.current) {
        clearTimeout(lingerTimer.current);
        lingerTimer.current = null;
      }
    };
  }, [caretId, contentRef, updateOverlay]);

  if (!caretId) return null;

  const color = getColor();
  const label = getLabel();

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1000,
        display: 'none',
      }}
    >
      <div
        data-caret-dot
        onMouseEnter={() => setHoveredId(caretId)}
        onMouseLeave={() => setHoveredId(null)}
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          borderRadius: '50%',
          backgroundColor: color,
          pointerEvents: 'auto',
          cursor: 'default',
          position: 'relative',
          left: -DOT_SIZE / 2 + 1,
        }}
      >
        {hoveredId === caretId && label && (
          <div
            style={{
              position: 'absolute',
              left: DOT_SIZE + 4,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: color,
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              lineHeight: '16px',
              padding: '2px 8px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              fontFamily:
                "'Canva Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            }}
          >
            {label}
          </div>
        )}
      </div>
      <div
        data-caret-line
        style={{
          width: 2,
          backgroundColor: color,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
