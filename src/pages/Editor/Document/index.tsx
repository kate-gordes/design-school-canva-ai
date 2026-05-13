import React from 'react';
import type { RefObject } from 'react';
import { Box } from '@canva/easel';
import { PlusIcon } from '@canva/easel/icons';
import styles from './document.module.css';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import Canvas from '@/pages/Editor/components/Canvas';
import { useLayoutEffect, useRef, useState } from 'react';
import EditorFooter from '@/pages/Editor/components/EditorFooter';

export interface DocumentDoctypeProps {
  viewMode: 'thumbnails' | 'continuous' | 'grid';
  currentPage: number;
  totalPages: number;
  zoomPercent: number;
  onZoomChange: (p: number) => void;
  onFit: () => void;
  onFill: () => void;
  onPageChange: (p: number) => void;
  onAddPage: () => void;
  canvasScrollRef?: RefObject<HTMLDivElement>;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  onToggleViewMode: () => void;
  isMobile?: boolean;
}

export default function DocumentDoctype(props: DocumentDoctypeProps): React.ReactNode {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const titleRef = useRef<HTMLTextAreaElement | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement | null>(null);
  const [showQuickAction, setShowQuickAction] = useState<boolean>(false);
  const [quickActionTopPx, setQuickActionTopPx] = useState<number>(8);

  const adjustTitleHeight = () => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = '0';
    el.style.height = `${el.scrollHeight}px`;
  };

  useLayoutEffect(() => {
    adjustTitleHeight();
  }, [title]);

  useLayoutEffect(() => {
    adjustTitleHeight();
  }, []);

  const scheduleQuickActionVisibilityUpdate = () => {
    setTimeout(() => {
      const active = document.activeElement;
      const inDoc = active === titleRef.current || active === bodyRef.current;
      setShowQuickAction(inDoc);
    }, 0);
  };

  const renderContent = () => (
    <Box width="full" className={styles.contentRoot}>
      {showQuickAction && (
        // Plain <button>: Easel Button would impose its own surface/radius and
        // wouldn't accept the custom absolute-positioned floating affordance.
        <button
          type="button"
          aria-label="Quick actions"
          className={styles.quickActionButton}
          style={{ top: `${quickActionTopPx}px` }}
          onMouseDown={e => e.preventDefault()}
        >
          <PlusIcon size="medium" />
        </button>
      )}

      <textarea
        ref={titleRef}
        rows={2}
        value={title}
        onFocus={() => {
          setShowQuickAction(true);
          setQuickActionTopPx(8);
        }}
        onBlur={scheduleQuickActionVisibilityUpdate}
        onChange={e => {
          setTitle(e.target.value);
          requestAnimationFrame(adjustTitleHeight);
        }}
        onInput={adjustTitleHeight}
        placeholder="One day or day one. You decide."
        className={styles.docTitle}
      />
      {title === '' && <span className={styles.attribution}>— Unknown</span>}
      <textarea
        ref={bodyRef}
        value={body}
        onFocus={() => {
          setShowQuickAction(true);
          const th = parseFloat(titleHeight ?? '0');
          setQuickActionTopPx(Math.max(8, Math.round(th + 24)));
        }}
        onBlur={scheduleQuickActionVisibilityUpdate}
        onChange={e => setBody(e.target.value)}
        className={styles.docBody}
      />
    </Box>
  );
  const {
    viewMode,
    currentPage,
    totalPages,
    zoomPercent,
    onZoomChange,
    onFit,
    onFill,
    onPageChange,
    onAddPage,
    canvasScrollRef,
    onDuplicatePage,
    onDeletePage,
    onToggleViewMode,
    isMobile = false,
  } = props;

  if (isMobile) {
    return (
      <Box className={styles.mobileDocRoot} ref={canvasScrollRef as RefObject<HTMLDivElement>}>
        {renderContent()}
      </Box>
    );
  }

  return (
    <Box className={styles.canvasArea}>
      <Box className={styles.canvasScroll} ref={canvasScrollRef as RefObject<HTMLDivElement>}>
        {viewMode === 'thumbnails' ? (
          <Box paddingTop="2u" width="full">
            <Canvas
              doctype="document"
              currentPage={currentPage}
              zoomPercent={zoomPercent}
              totalPages={totalPages}
              viewMode="thumbnails"
              onPageChange={onPageChange}
              onAddPage={onAddPage}
              designWidth={880}
              designHeight={1232}
              contentAlign="center"
              contentPadding={'80px'}
              showSelectionRing
              suppressSelectionInsideContent
              rounded
              renderContent={() => renderContent()}
              showPageHeaderControls={false}
            />
          </Box>
        ) : (
          <Canvas
            doctype="document"
            currentPage={currentPage}
            zoomPercent={zoomPercent}
            totalPages={totalPages}
            viewMode="continuous"
            onPageChange={onPageChange}
            onAddPage={onAddPage}
            designWidth={880}
            designHeight={1232}
            contentAlign="center"
            contentPadding={'80px'}
            showSelectionRing
            suppressSelectionInsideContent
            rounded
            renderContent={() => renderContent()}
            showPageHeaderControls={false}
          />
        )}
      </Box>
      {viewMode === 'thumbnails' && (
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onAddPage={onAddPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          thumbWidthPx={64}
        />
      )}
      <EditorFooter
        currentPage={currentPage}
        totalPages={totalPages}
        zoomPercent={zoomPercent}
        onZoomChange={onZoomChange}
        onFit={onFit}
        onFill={onFill}
        viewMode={viewMode === 'grid' ? 'thumbnails' : viewMode}
        onToggleViewMode={onToggleViewMode}
        isGridMode={viewMode === 'grid'}
        onToggleGrid={() => {
          /* handled by parent */
        }}
        showFitFill={false}
      />
    </Box>
  );
}
