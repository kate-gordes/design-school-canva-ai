import React from 'react';
import type { RefObject } from 'react';
import { Box } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import styles from './presentation.module.css';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import Canvas from '@/pages/Editor/components/Canvas';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import {
  canvases,
  activeCanvasId,
  handleAddCanvas,
  selectedPageId,
  clearPageSelection,
  selectedElementId,
  clearSelection,
  aiPanelOpen,
  setAIPanelOpen,
} from '@/store';
import useIsMobile from '@/hooks/useIsMobile';

export interface PresentationDoctypeProps {
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
  isMobile?: boolean;
  isCanvasSelected?: boolean;
  onCanvasDeactivate?: () => void;
  onCanvasActivate?: () => void;
}

export default function PresentationDoctype(props: PresentationDoctypeProps): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();

  const {
    viewMode,
    zoomPercent,
    onZoomChange,
    onFit,
    onFill,
    onPageChange,
    canvasScrollRef,
    onDuplicatePage,
    onDeletePage,
    onToggleViewMode,
    isGridMode = false,
    onToggleGrid = () => {},
    isCanvasSelected = false,
    onCanvasDeactivate,
    onCanvasActivate,
  } = props;

  const canvasesValue = canvases.value;
  const effectiveTotalPages = canvasesValue.length > 0 ? canvasesValue.length : props.totalPages;
  const effectiveCurrentPage = activeCanvasId.value > 0 ? activeCanvasId.value : props.currentPage;

  const handlePageChange = (pageNumber: number) => {
    const canvas = canvasesValue[pageNumber - 1];
    if (canvas) {
      activeCanvasId.value = canvas.canvasId;
    }
    onPageChange(pageNumber);
  };

  const handleAddPage = () => {
    handleAddCanvas();
    // onAddPage will be called but the actual count comes from signals
    onPageChange(canvasesValue.length + 1);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isOnCanvasElement = target.closest('[data-element-id]');
    const isOnToolbar = target.closest('[data-toolbar]');
    const isOnCanvasWrapper = target.closest('[data-canvas-wrapper]');

    const isBackgroundClick =
      target === e.currentTarget || (!isOnCanvasElement && !isOnToolbar && !isOnCanvasWrapper);

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

  const isAIPanelOpen = aiPanelOpen.value;
  const hideNavigationUI = isMobile && isAIPanelOpen;

  const scrollClassName = [styles.canvasScroll, isAIPanelOpen ? styles.aiPanelOpen : '']
    .filter(Boolean)
    .join(' ');

  const areaClassName = [
    styles.canvasArea,
    props.isMobile ? styles.mobileCanvasArea : '',
    hideNavigationUI ? styles.canvasAreaAIMode : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box className={areaClassName}>
      <div
        className={scrollClassName}
        ref={canvasScrollRef as RefObject<HTMLDivElement>}
        onClick={handleBackgroundClick}
      >
        <Canvas
          doctype="presentation"
          currentPage={effectiveCurrentPage}
          zoomPercent={zoomPercent}
          totalPages={effectiveTotalPages}
          viewMode={viewMode}
          onPageChange={handlePageChange}
          onAddPage={handleAddPage}
          onDeactivate={onCanvasDeactivate}
          onActivate={onCanvasActivate}
          disableWheelPaging={props.isMobile}
        />
      </div>
      {viewMode === 'thumbnails' && !hideNavigationUI && (
        <PageNavigator
          currentPage={effectiveCurrentPage}
          totalPages={effectiveTotalPages}
          onPageChange={handlePageChange}
          onAddPage={handleAddPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          fixed={!props.isMobile}
          isMobile={props.isMobile}
          isCanvasSelected={isCanvasSelected}
        />
      )}
      {!props.isMobile && !hideNavigationUI && (
        <EditorFooter
          currentPage={effectiveCurrentPage}
          totalPages={effectiveTotalPages}
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
