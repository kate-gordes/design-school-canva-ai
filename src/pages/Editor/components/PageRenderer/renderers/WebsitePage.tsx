import React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Box } from '@canva/easel';
import InteractivePageDoctype from '@/pages/Editor/InteractivePage';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import {
  aiPanelOpen,
  canvases,
  selectedPageId,
  selectPage,
  reorderCanvases,
  handleAddCanvas,
} from '@/store';
import type { PageDocType } from '@/store/signals/canvasState';
import useIsMobile from '@/hooks/useIsMobile';
import styles from '@/pages/Editor/Presentation/presentation.module.css';

export interface WebsitePageProps {
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
 * WebsitePage — renders the interactive page iframe for a website-type canvas page,
 * wrapped with PageNavigator + EditorFooter so thumbnails stay visible.
 */
export default function WebsitePage(props: WebsitePageProps): React.ReactNode {
  useSignals();
  const isMobile = useIsMobile();

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
      {/* Interactive page iframe */}
      <InteractivePageDoctype />

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
