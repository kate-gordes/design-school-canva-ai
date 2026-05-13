import React, { useEffect, useRef } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Box } from '@canva/easel';
import Block from '@/pages/Editor/Docs/components/Block';
import DocsToolbar from '@/pages/Editor/Docs/components/DocsToolbar';
import MobileDocsToolbar from '@/pages/Editor/Docs/components/MobileDocsToolbar';
import MobileDocsActionsSheet from '@/pages/Editor/Docs/components/MobileDocsActionsSheet';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import {
  blocks,
  activeBlockId,
  aiPanelOpen,
  canvases,
  selectedPageId,
  selectPage,
  reorderCanvases,
  handleAddCanvas,
} from '@/store';
import { activeCanvas, activeCanvasId } from '@/store/signals/canvasState';
import type { PageDocType } from '@/store/signals/canvasState';
import type { BlockData } from '@/store/signals/documentState';
import useIsMobile from '@/hooks/useIsMobile';
import docsStyles from '@/pages/Editor/Docs/docs.module.css';
import styles from '@/pages/Editor/Presentation/presentation.module.css';

export interface DocPageProps {
  currentPage: number;
  totalPages: number;
  zoomPercent: number;
  onZoomChange: (p: number) => void;
  onFit: () => void;
  onFill: () => void;
  onPageChange: (p: number) => void;
  onAddPage: () => void;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  onToggleViewMode: () => void;
  isGridMode?: boolean;
  onToggleGrid?: () => void;
}

/**
 * DocPage — renders a block editor for a doc-type canvas page,
 * wrapped with PageNavigator + EditorFooter so thumbnails stay visible.
 */
export default function DocPage(props: DocPageProps): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();
  const prevCanvasIdRef = useRef<number | null>(null);

  const {
    currentPage,
    totalPages,
    zoomPercent,
    onZoomChange,
    onFit,
    onFill,
    onPageChange,
    onAddPage,
    onDuplicatePage,
    onDeletePage,
    onToggleViewMode,
    isGridMode = false,
    onToggleGrid = () => {},
  } = props;

  // Sync blocks <-> canvas.blocks on page switch
  useEffect(() => {
    const canvas = activeCanvas.value;
    if (!canvas) return;

    const canvasId = canvas.canvasId;

    // Save blocks from the previous canvas before loading new ones
    if (prevCanvasIdRef.current != null && prevCanvasIdRef.current !== canvasId) {
      saveBlocksToCanvas(prevCanvasIdRef.current, blocks.value);
    }

    prevCanvasIdRef.current = canvasId;

    // Load blocks from the new canvas
    if (canvas.blocks && canvas.blocks.length > 0) {
      blocks.value = JSON.parse(JSON.stringify(canvas.blocks));
    } else {
      // Initialize with empty paragraph
      blocks.value = [{ blockId: `block_${canvasId}_1`, blockType: 'paragraph', markdown: '' }];
    }

    // Save on unmount
    return () => {
      saveBlocksToCanvas(canvasId, blocks.value);
    };
  }, [activeCanvasId.value]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains(docsStyles.docsScroll)) {
      const lastBlock = blocks.value[blocks.value.length - 1];
      if (lastBlock) {
        activeBlockId.value = lastBlock.blockId;
      }
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    const c = canvases.value[pageNumber - 1];
    if (c) selectPage(c.canvasId);
  };

  const handleReorderPage = (fromIndex: number, toIndex: number) => {
    reorderCanvases(fromIndex, toIndex);
  };

  const handleAddPageWithDocType = (docType: PageDocType) => {
    handleAddCanvas({ docType });
  };

  const isAIPanelOpen = aiPanelOpen.value;
  const hideNavigationUI = isMobile && isAIPanelOpen;

  const selectedPageNumber =
    selectedPageId.value !== null
      ? canvases.value.findIndex(c => c.canvasId === selectedPageId.value) + 1 || null
      : null;

  return (
    <Box className={styles.canvasArea}>
      {/* Doc block editor */}
      <Box className={docsStyles.docsArea}>
        {!isMobile && (
          <div className={docsStyles.docsToolbarContainer}>
            <DocsToolbar />
          </div>
        )}
        <div className={docsStyles.docsScroll} onClick={handleBackgroundClick}>
          <div className={docsStyles.docsContainer}>
            <div className={docsStyles.blocksWrapper}>
              {blocks.value.map((block, index) => (
                <Block
                  key={block.blockId}
                  block={block}
                  isActive={activeBlockId.value === block.blockId}
                  isFirst={index === 0}
                  isLast={index === blocks.value.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
        {isMobile && <MobileDocsToolbar />}
        {isMobile && <MobileDocsActionsSheet />}
      </Box>

      {/* Page navigator thumbnails */}
      {!hideNavigationUI && (
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onAddPage={onAddPage}
          onAddPageWithDocType={handleAddPageWithDocType}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          onReorderPage={handleReorderPage}
          doctype="presentation"
          selectedPage={selectedPageNumber}
          onPageSelect={handlePageSelect}
          fixed={false}
        />
      )}

      {/* Footer */}
      {!hideNavigationUI && (
        <EditorFooter
          currentPage={currentPage}
          totalPages={totalPages}
          zoomPercent={zoomPercent}
          onZoomChange={onZoomChange}
          onFit={onFit}
          onFill={onFill}
          viewMode="thumbnails"
          onToggleViewMode={onToggleViewMode}
          isGridMode={isGridMode}
          onToggleGrid={onToggleGrid}
        />
      )}
    </Box>
  );
}

/** Persist the current blocks array back into a specific canvas's data */
function saveBlocksToCanvas(canvasId: number, currentBlocks: BlockData[]): void {
  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      return { ...c, blocks: JSON.parse(JSON.stringify(currentBlocks)) };
    }
    return c;
  });
}
