import React from 'react';
import type { RefObject } from 'react';
import { Box } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import Canvas from '@/pages/Editor/components/Canvas';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import {
  clearSelection,
  selectedElementId,
  selectedPageId,
  selectPage,
  clearPageSelection,
  aiPanelOpen,
  setAIPanelOpen,
  canvases,
  reorderCanvases,
  activeCanvas,
  activeDocType,
  handleAddCanvas,
} from '@/store';
import type { PageDocType } from '@/store/signals/canvasState';
import useIsMobile from '@/hooks/useIsMobile';
import styles from '@/pages/Editor/Presentation/presentation.module.css';

export interface PresentationPageProps {
  viewMode: 'thumbnails' | 'continuous';
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
  isGridMode?: boolean;
  onToggleGrid?: () => void;
}

export default function PresentationPage(props: PresentationPageProps): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();

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
    isGridMode = false,
    onToggleGrid = () => {},
  } = props;

  // For fixed-design pages, use custom width/height from CanvasData
  const canvas = activeCanvas.value;
  const docType = activeDocType.value;
  const designWidth = docType === 'fixed-design' && canvas?.width ? canvas.width : undefined;
  const designHeight = docType === 'fixed-design' && canvas?.height ? canvas.height : undefined;

  const handleBackgroundClick = (e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    const isOnCanvasElement = target.closest('[data-element-id]');
    const isOnToolbar = target.closest('[data-toolbar]');
    const isOnCanvasWrapper = target.closest('[data-canvas-wrapper]');

    const isBackgroundClick =
      target === currentTarget || (!isOnCanvasElement && !isOnToolbar && !isOnCanvasWrapper);

    if (!isBackgroundClick) return;

    if (selectedPageId.value !== null) {
      clearPageSelection();
      return;
    }

    if (selectedElementId.value) {
      clearSelection();
      return;
    }

    if (aiPanelOpen.value) {
      setAIPanelOpen(false);
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

  const scrollClassName = [styles.canvasScroll, isAIPanelOpen ? styles.aiPanelOpen : '']
    .filter(Boolean)
    .join(' ');

  const areaClassName = [styles.canvasArea, hideNavigationUI ? styles.canvasAreaAIMode : '']
    .filter(Boolean)
    .join(' ');

  return (
    <Box className={areaClassName}>
      <div className={scrollClassName} ref={canvasScrollRef} onClick={handleBackgroundClick}>
        <Canvas
          doctype="presentation"
          currentPage={currentPage}
          zoomPercent={zoomPercent}
          totalPages={totalPages}
          viewMode={viewMode}
          onPageChange={onPageChange}
          onAddPage={onAddPage}
          shrinkWrap
          {...(designWidth != null && { designWidth })}
          {...(designHeight != null && { designHeight })}
        />
      </div>
      {viewMode === 'thumbnails' && !hideNavigationUI && (
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
      {!hideNavigationUI && (
        <EditorFooter
          currentPage={currentPage}
          totalPages={totalPages}
          zoomPercent={zoomPercent}
          onZoomChange={onZoomChange}
          onFit={onFit}
          onFill={onFill}
          viewMode={viewMode}
          onToggleViewMode={onToggleViewMode}
          isGridMode={isGridMode}
          onToggleGrid={onToggleGrid}
        />
      )}
    </Box>
  );
}
