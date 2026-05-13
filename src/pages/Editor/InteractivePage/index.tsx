import React, { useRef, useEffect, useCallback } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import styles from './interactivePage.module.css';
import { interactivePageHtml } from '@/store/signals/interactivePageState';

export default function InteractivePageDoctype(): React.ReactNode {
  useSignals();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const html = interactivePageHtml.value;

  const resizeIframe = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      const body = doc.body;
      const docEl = doc.documentElement;
      if (body && docEl) {
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          docEl.scrollHeight,
          docEl.offsetHeight,
          600,
        );
        iframe.style.height = `${height}px`;
      }
    } catch {
      // Cross-origin — use min-height fallback
    }
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    let observer: MutationObserver | null = null;
    let rafId: number | null = null;
    let settled = false;

    const handleLoad = () => {
      resizeIframe();

      // Tailwind CDN and fonts load async — poll until height stabilizes
      let lastHeight = 0;
      let stableCount = 0;
      const poll = () => {
        resizeIframe();
        const currentHeight = parseInt(iframe.style.height) || 0;
        if (currentHeight === lastHeight) {
          stableCount++;
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }
        // Keep polling until height is stable for ~1s (20 frames)
        if (stableCount < 20 && !settled) {
          rafId = requestAnimationFrame(poll);
        }
      };
      rafId = requestAnimationFrame(poll);

      // Also observe DOM mutations for dynamic content changes
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc?.body) {
          observer = new MutationObserver(resizeIframe);
          observer.observe(doc.body, { childList: true, subtree: true, attributes: true });
        }
      } catch {
        // Cross-origin
      }
    };

    iframe.addEventListener('load', handleLoad);
    return () => {
      settled = true;
      iframe.removeEventListener('load', handleLoad);
      if (observer) observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [html, resizeIframe]);

  return (
    // Plain div: Easel Box's reset_f88b8e wipes the custom canvas background
    // (colorSurfaceCanvas) this wrapper relies on.
    <div className={styles.interactivePageArea}>
      <div className={styles.interactivePageScroll}>
        <div className={styles.interactivePageContainer}>
          <iframe
            ref={iframeRef}
            className={styles.iframe}
            srcDoc={html}
            sandbox="allow-scripts allow-same-origin"
            title="Interactive Page"
          />
        </div>
      </div>
    </div>
  );
}
