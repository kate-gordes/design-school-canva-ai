import { useEffect, useRef, useState } from 'react';
import { Box } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import '@canva/easel/styles.css';
import styles from '@/pages/Editor/Editor.module.css';
import ObjectPanelTabs from '@/pages/Editor/components/ObjectPanel';
import EditPanel from '@/pages/Editor/components/EditPanel';
import Header from '@/shared_components/Header';
import EditorToolbar from '@/pages/Editor/components/EditorToolbar';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import MobileHeader from '@/pages/Editor/components/MobileHeader';
import MobileToolbar from '@/pages/Editor/components/MobileActionBar';
import MobilePrimaryNav from '@/pages/Editor/components/MobilePrimaryNav';
import MobileContextToolbar from '@/pages/Editor/components/MobileContextToolbar';
import MobileGridActionBar from '@/pages/Editor/components/MobileGridActionBar';
import MobileCanvaAIPanel from '@/pages/Editor/components/MobileCanvaAIPanel';
import { MobileCanvaAIFocusProxy } from '@/pages/Editor/components/MobileCanvaAIFocusProxy';
import DesignSchoolVideoPanel, {
  DESIGN_SCHOOL_MOBILE_PINNED_SLOT_ID,
} from '@/pages/Editor/components/DesignSchoolVideoPanel';
import { XrayOverlay } from '@/pages/Editor/components/XrayOverlay';
import { XrayTrigger } from '@/pages/Editor/components/XrayOverlay/XrayTrigger';
import PresentationDoctype from '@/pages/Editor/Presentation';
import DocumentDoctype from '@/pages/Editor/Document';
import SpreadsheetDoctype from '@/pages/Editor/Spreadsheet';
import WhiteboardDoctype from '@/pages/Editor/Whiteboard';
import PagesGrid from '@/pages/Editor/components/PagesGrid';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { useParams, Navigate } from 'react-router-dom';
import { CANVAS_DESIGN_WIDTH, CANVAS_CALIBRATION } from '@/pages/Editor/components/Canvas/config';
import {
  aiPanelOpen,
  designSchoolVideo,
  designSchoolVideoMinimized,
  designSchoolVideoPanelSide,
  setAIPanelOpen,
} from '@/store/signals/panels';

export function Editor() {
  useSignals();
  const { setSidebarVisible, state } = useAppContext();
  const isMobile = useIsMobile();
  const params = useParams();
  const doctype = (params.doctype ?? 'presentation').toLowerCase();
  const isMobileAIPanelOpen = isMobile && aiPanelOpen.value;
  // When the user has pinned a Design School video below the artboard, hide
  // the mobile AI sheet entirely so the pinned card + artboard own the
  // screen. Gating at the parent (vs. an early `return null` inside
  // `MobileCanvaAIPanel`) avoids violating the Rules of Hooks and gives a
  // clean unmount/remount when the user pins → unpins.
  const isDesignSchoolVideoPinned =
    Boolean(designSchoolVideo.value) && designSchoolVideoMinimized.value;
  const shouldRenderMobileAIPanel = isMobileAIPanelOpen && !isDesignSchoolVideoPinned;

  // Page state management
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [isPageSelected, setIsPageSelected] = useState(false); // true after clicking thumb or canvas element
  const [selectionSource, setSelectionSource] = useState<'none' | 'canvas' | 'thumbnail'>('none');
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomKind, setZoomKind] = useState<'fit' | 'fill' | 'percent'>('fit');
  const [viewMode, setViewMode] = useState<'thumbnails' | 'continuous'>('thumbnails');
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const [mobileGridOpen, setMobileGridOpen] = useState(false);
  const zoomRafRef = useRef<number | null>(null);
  const canvasScrollRef = useRef<HTMLDivElement | null>(null);
  const latestZoomRef = useRef<number>(100);
  const fitZoomRef = useRef<number>(100); // remember last fit zoom for grid threshold
  const containerResizeObserverRef = useRef<ResizeObserver | null>(null);

  // Hide sidebar when Editor component mounts
  useEffect(() => {
    setSidebarVisible(false);
  }, [setSidebarVisible]);

  // On mobile, prevent the Easel root container from clipping canvas box-shadow
  useEffect(() => {
    if (!isMobile) return;
    const rootContainer = document.querySelector('#root > div') as HTMLElement;
    if (rootContainer) {
      rootContainer.style.overflow = 'visible';
      return () => {
        rootContainer.style.overflow = '';
      };
    }
  }, [isMobile]);

  // Default view mode by doctype
  useEffect(() => {
    if (
      doctype === 'document'
      || doctype === 'presentation'
      || doctype === 'spreadsheet'
      || doctype === 'whiteboard'
    ) {
      setViewMode('thumbnails');
    }
  }, [doctype]);

  const designWidth = CANVAS_DESIGN_WIDTH;
  const designHeight = Math.round((9 / 16) * designWidth);

  // Compute viewport-based zooms using both width and height constraints
  const computeFitZoom = (): number => {
    // Prefer actual container size to avoid double-counting fixed rails/footers
    const containerWidth =
      canvasScrollRef.current?.clientWidth
      ?? (typeof window !== 'undefined' ? window.innerWidth : 1440);
    const containerHeight =
      canvasScrollRef.current?.clientHeight
      ?? (typeof window !== 'undefined' ? window.innerHeight : 900);

    // Small breathable gutters only; side rails already accounted by container width
    // On mobile, use larger gutters so the canvas shadow has room to render
    const reservedGutters = isMobile ? 40 : 32;
    const availableWidth = Math.max(320, containerWidth - reservedGutters);
    const widthScale = availableWidth / designWidth;

    // Account for fixed overlays (footer + page navigator) and small gaps
    const footerHeight = 40; // EditorFooter height
    const thumbsHeight = doctype === 'presentation' && !isGridViewOpen ? 64 + 32 : 0; // 64px thumb + 32px padding
    const fixedBottomOverlays = footerHeight + thumbsHeight;

    const requiredTopGap = 16; // small breathable gap at top
    const requiredBottomGap = 16; // small breathable gap above overlays
    const availableHeight = Math.max(
      200,
      containerHeight - (requiredTopGap + requiredBottomGap + fixedBottomOverlays),
    );
    const heightScale = availableHeight / designHeight;

    // Leave some breathing room around the canvas in Fit mode
    // Fit exactly to the limiting dimension; gaps handled by requiredTop/Bottom
    const scale = Math.max(0.1, Math.min(widthScale, heightScale));
    const pct = (scale * 100) / CANVAS_CALIBRATION;
    // Return with 0.1% precision to avoid visible stepping during resize
    const result = Math.max(10, Math.min(500, parseFloat(pct.toFixed(1))));
    fitZoomRef.current = result;
    return result;
  };

  const computeFillZoom = (): number => {
    const containerWidth =
      canvasScrollRef.current?.clientWidth
      ?? (typeof window !== 'undefined' ? window.innerWidth : 1440);
    const containerHeight =
      canvasScrollRef.current?.clientHeight
      ?? (typeof window !== 'undefined' ? window.innerHeight : 900);

    const minimalMargin = 8; // nearly edge-to-edge within container
    const availableWidth = Math.max(200, containerWidth - minimalMargin);
    const availableHeight = Math.max(200, containerHeight - minimalMargin);
    const widthScale = availableWidth / designWidth;
    const heightScale = availableHeight / designHeight;

    const scale = Math.max(0.1, Math.min(widthScale, heightScale));
    const pct = (scale * 100) / CANVAS_CALIBRATION;
    return Math.max(10, Math.min(500, parseFloat(pct.toFixed(1))));
  };

  // Default zoom behavior on mount
  useEffect(() => {
    if (doctype === 'document') {
      // Docs start at 100% and do not auto-fit
      setZoomKind('percent');
      setZoomPercent(100);
      return;
    }
    if (doctype === 'spreadsheet') {
      // Spreadsheet uses Fit mode at 100% by default, even if it overflows
      setZoomKind('fit');
      setZoomPercent(100);
      return;
    }
    if (doctype === 'whiteboard') {
      setZoomKind('fit');
      if (isMobile) {
        const id = requestAnimationFrame(() => {
          const fit = computeFitZoom();
          latestZoomRef.current = fit;
          setZoomPercent(fit);
        });
        return () => cancelAnimationFrame(id);
      }
      setZoomPercent(100);
      return;
    }
    setZoomKind('fit');
    const id = requestAnimationFrame(() => {
      const fit = computeFitZoom();
      latestZoomRef.current = fit;
      setZoomPercent(fit);
    });
    return () => cancelAnimationFrame(id);
  }, [doctype]);

  // Keep Fit/Fill responsive to container size (not used for Docs)
  useEffect(() => {
    if (doctype === 'document' || doctype === 'spreadsheet') return;
    const el = canvasScrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (zoomKind === 'fit') {
        const fit = computeFitZoom();
        latestZoomRef.current = fit;
        setZoomPercent(fit);
      } else if (zoomKind === 'fill') {
        const fill = computeFillZoom();
        latestZoomRef.current = fill;
        setZoomPercent(fill);
      }
    });
    observer.observe(el);
    containerResizeObserverRef.current = observer;
    return () => {
      observer.disconnect();
      if (containerResizeObserverRef.current === observer) {
        containerResizeObserverRef.current = null;
      }
    };
  }, [zoomKind, doctype]);

  const handleZoomChange = (percent: number) => {
    latestZoomRef.current = percent;

    // On mobile, snap to grid view when zooming out past threshold
    if (isMobile && !mobileGridOpen) {
      const threshold = fitZoomRef.current * 0.8;
      if (percent < threshold) {
        setMobileGridOpen(true);
        return; // don't update zoom further
      }
    }

    if (zoomRafRef.current !== null) {
      cancelAnimationFrame(zoomRafRef.current);
    }
    zoomRafRef.current = requestAnimationFrame(() => {
      setZoomKind('percent');
      setZoomPercent(latestZoomRef.current);
      zoomRafRef.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (zoomRafRef.current !== null) {
        cancelAnimationFrame(zoomRafRef.current);
      }
    };
  }, []);

  const handleFit = () => {
    setZoomKind('fit');
    const fit = computeFitZoom();
    latestZoomRef.current = fit;
    setZoomPercent(fit);
  };

  const handleFill = () => {
    setZoomKind('fill');
    const fill = computeFillZoom();
    latestZoomRef.current = fill;
    setZoomPercent(fill);
  };

  // Smooth scroll zooming (Cmd/Ctrl + Scroll on desktop, plain scroll on mobile)
  // Disabled for mobile documents — they fill the viewport directly
  useEffect(() => {
    if (isMobile && (doctype === 'document' || doctype === 'spreadsheet')) return;
    const el = canvasScrollRef.current;
    if (!el) return;

    // Exponential zoom factor per wheel delta unit for smooth feel across devices
    const ZOOM_BASE = 1.0015; // tune for sensitivity (1.001 - 1.005 typical)

    const onWheel = (e: WheelEvent) => {
      // On mobile, any scroll zooms; on desktop, require Cmd/Ctrl
      if (!isMobile && !(e.metaKey || e.ctrlKey)) return;
      e.preventDefault();

      // Compute multiplicative factor from deltaY (trackpad-friendly)
      const factor = Math.pow(ZOOM_BASE, -e.deltaY);
      const current = latestZoomRef.current;
      const next = Math.min(500, Math.max(10, current * factor));

      // Coalesce updates with existing RAF logic
      handleZoomChange(next);
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel as unknown as EventListener);
    };
  }, [computeFitZoom, isMobile, doctype]);

  // Pinch-to-zoom on touch devices (disabled for mobile documents)
  useEffect(() => {
    if (!isMobile) return;
    if (doctype === 'document' || doctype === 'spreadsheet') return;
    const el = canvasScrollRef.current;
    if (!el) return;

    let lastDistance = 0;
    let initialZoom = 0;

    const getDistance = (touches: TouchList) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastDistance = getDistance(e.touches);
        initialZoom = latestZoomRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches);
        if (lastDistance > 0) {
          const scale = currentDistance / lastDistance;
          const next = Math.min(500, Math.max(10, initialZoom * scale));
          handleZoomChange(next);
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastDistance = 0;
        initialZoom = 0;
      }
    };

    // Safari gesture events (prevents browser zoom, drives canvas zoom)
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      initialZoom = latestZoomRef.current;
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      const ge = e as unknown as { scale: number };
      const next = Math.min(500, Math.max(10, initialZoom * ge.scale));
      handleZoomChange(next);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('gesturestart', onGestureStart, { passive: false });
    el.addEventListener('gesturechange', onGestureChange, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('gesturestart', onGestureStart);
      el.removeEventListener('gesturechange', onGestureChange);
    };
  }, [isMobile]);

  const handlePageChange = (pageNumber: number) => {
    console.log(`Switching to page ${pageNumber}`);
    setCurrentPage(pageNumber);
    setIsPageSelected(true);
    setSelectionSource('thumbnail');
  };

  const handleAddPage = () => {
    console.log('Adding new blank page');
    setTotalPages(prev => prev + 1);
    setCurrentPage(totalPages + 1);
  };

  const handleDuplicatePage = (pageNumber: number) => {
    console.log(`Duplicating page ${pageNumber}`);
    setTotalPages(prev => prev + 1);
    setCurrentPage(totalPages + 1);
  };

  const handleDeletePage = (pageNumber: number) => {
    if (totalPages > 1) {
      console.log(`Deleting page ${pageNumber}`);
      setTotalPages(prev => prev - 1);
      if (currentPage >= pageNumber && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    }
  };

  const handleExitMobileGrid = () => {
    setMobileGridOpen(false);
    // Restore fit zoom when leaving grid view
    setZoomKind('fit');
    requestAnimationFrame(() => {
      const fit = computeFitZoom();
      latestZoomRef.current = fit;
      setZoomPercent(fit);
    });
  };

  const handleMobileGridPageChange = (pageNumber: number) => {
    handlePageChange(pageNumber);
    handleExitMobileGrid();
  };

  const handleToggleGrid = () => {
    setIsGridViewOpen(prev => !prev);
  };

  // --- Mobile layout ---
  if (isMobile) {
    // Grid view on mobile (triggered by zooming out)
    if (mobileGridOpen) {
      return (
        <>
          <Box
            className={`${styles.editorContainer} ${styles.mobileEditor}`}
            width="full"
            height="full"
            display="flex"
            flexDirection="column"
          >
            <MobileHeader />
            <Box className={`${styles.mobileMain} ${styles.mobileMainGrid}`}>
              <PagesGrid
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handleMobileGridPageChange}
                onAddPage={handleAddPage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                isMobile
              />
            </Box>
            <MobileGridActionBar
              onAddPage={handleAddPage}
              onDuplicate={() => handleDuplicatePage(currentPage)}
              onDelete={() => handleDeletePage(currentPage)}
              onHide={() => console.log('Hide page', currentPage)}
              onSelect={() => console.log('Select mode')}
              onDone={handleExitMobileGrid}
            />
          </Box>
          <MobileCanvaAIFocusProxy />
          {shouldRenderMobileAIPanel && (
            <MobileCanvaAIPanel onClose={() => setAIPanelOpen(false)} />
          )}
          <DesignSchoolVideoPanel />
          <XrayTrigger />
          <XrayOverlay />
        </>
      );
    }

    return (
      <>
        <Box
          className={`${styles.editorContainer} ${styles.mobileEditor}`}
          width="full"
          height="full"
          display="flex"
          flexDirection="column"
        >
          <MobileHeader />
          <Box className={styles.mobileMain}>
            {/* Floating context toolbar (shown above selected element) */}
            {!isMobileAIPanelOpen
              && (state.selectedObjectType === 'text' || state.selectedObjectType === 'shape') && (
                <MobileContextToolbar />
              )}

            {/* Canvas area — full width */}
            {doctype === 'document' ? (
              <DocumentDoctype
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                zoomPercent={zoomPercent}
                onZoomChange={handleZoomChange}
                onFit={handleFit}
                onFill={handleFill}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
                onToggleViewMode={() =>
                  setViewMode(prev => (prev === 'thumbnails' ? 'continuous' : 'thumbnails'))
                }
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                canvasScrollRef={canvasScrollRef}
                isMobile
              />
            ) : doctype === 'spreadsheet' ? (
              <SpreadsheetDoctype
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                zoomPercent={zoomPercent}
                onZoomChange={handleZoomChange}
                onFit={handleFit}
                onFill={handleFill}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                canvasScrollRef={canvasScrollRef}
                isMobile
              />
            ) : doctype === 'whiteboard' ? (
              <WhiteboardDoctype
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                zoomPercent={zoomPercent}
                onZoomChange={handleZoomChange}
                onFit={handleFit}
                onFill={handleFill}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                canvasScrollRef={canvasScrollRef}
                onToggleViewMode={() => {}}
                isMobile
              />
            ) : doctype !== 'presentation' ? (
              <Navigate to="/editor/presentation" replace />
            ) : (
              <PresentationDoctype
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                zoomPercent={zoomPercent}
                onZoomChange={handleZoomChange}
                onFit={handleFit}
                onFill={handleFill}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
                onDuplicatePage={handleDuplicatePage}
                onDeletePage={handleDeletePage}
                canvasScrollRef={canvasScrollRef}
                onToggleViewMode={() =>
                  setViewMode(prev => (prev === 'thumbnails' ? 'continuous' : 'thumbnails'))
                }
                isGridMode={false}
                onToggleGrid={() => {}}
                isMobile
              />
            )}
          </Box>
          {/*
           * Inline portal slot for the Design School video pinned card.
           * When the user taps "Pin below artboard" on the mobile sheet,
           * `DesignSchoolVideoPanel` portals its compact card into this
           * div so the card sits in the editor's flex column — directly
           * below the canvas area, above the bottom nav/toolbar — instead
           * of floating as a fixed overlay. The slot has zero height when
           * empty, so it doesn't disturb the layout.
           *
           * Raw `<div>` (rather than Easel `Box`) is the smallest escape
           * hatch here: the slot needs `max-height` + `overflow-y: auto`
           * so the transcript drawer in the pinned card scrolls inside
           * the slot rather than overflowing `.mobileEditor`'s hidden
           * boundary. Easel `Box` only exposes `display`, `padding`,
           * `gap`, `flex` and a few size atoms — `max-height` / `overflow`
           * have no Box-prop equivalent, so the styles live in
           * `Editor.module.css` (`.designSchoolMobilePinnedSlot`).
           */}
          <div
            id={DESIGN_SCHOOL_MOBILE_PINNED_SLOT_ID}
            className={styles.designSchoolMobilePinnedSlot}
          />
          {!isMobileAIPanelOpen
          && (state.selectedObjectType === 'text'
            || state.selectedObjectType === 'shape'
            || isPageSelected) ? (
            <MobileToolbar
              selectedType={state.selectedObjectType !== 'none' ? state.selectedObjectType : 'page'}
              selectionSource={selectionSource}
              onDone={() => {
                setIsPageSelected(false);
                setSelectionSource('none');
              }}
            />
          ) : !isMobileAIPanelOpen ? (
            <MobilePrimaryNav />
          ) : null}
        </Box>
        <MobileCanvaAIFocusProxy />
        {shouldRenderMobileAIPanel && <MobileCanvaAIPanel onClose={() => setAIPanelOpen(false)} />}
        <DesignSchoolVideoPanel />
        <XrayTrigger />
        <XrayOverlay />
      </>
    );
  }

  const getLeftRailClass = () => {
    if (!state.objectPanelDocked) return styles.leftRailUndocked;
    switch (state.dockedPanelName) {
      case 'Brand':
        return styles.leftRailDockedBrand;
      case 'BrandSidebar':
        return styles.leftRailDockedBrandSidebar;
      case 'Tools':
        return styles.leftRailDockedTools;
      default:
        return styles.leftRailDocked;
    }
  };

  // Design School video panel — chooses which side of the artboard to dock to.
  // The panel itself returns null when there is no active video, so when none
  // is open both `panelBeforeDoctype` / `panelAfterDoctype` slots render
  // nothing and the wrapper degenerates to a single-child flex container —
  // i.e. the layout is identical to rendering the doctype directly.
  const dsVideoSide = designSchoolVideoPanelSide.value;
  const dsVideoOpen = designSchoolVideo.value !== null;
  const dsVideoIsHorizontal = dsVideoSide === 'top' || dsVideoSide === 'bottom';
  const dsVideoWrapperClass = `${styles.canvasAndPanelWrapper} ${
    dsVideoIsHorizontal ? styles.canvasAndPanelWrapperColumn : styles.canvasAndPanelWrapperRow
  }`;
  const dsVideoPanelBefore = dsVideoOpen && (dsVideoSide === 'left' || dsVideoSide === 'top');
  const dsVideoPanelAfter = dsVideoOpen && (dsVideoSide === 'right' || dsVideoSide === 'bottom');

  // --- Desktop layout ---
  return (
    <>
      <Box
        className={styles.editorContainer}
        width="full"
        height="full"
        display="flex"
        flexDirection="column"
      >
        <Header />
        <EditorToolbar />
        <Box className={`${styles.mainContent} ${styles.rowsMain}`} width="full">
          {!isGridViewOpen && (
            <Box className={`${styles.objectPanel} ${getLeftRailClass()}`}>
              <ObjectPanelTabs
                contentOverride={
                  isEditPanelOpen ? (
                    <EditPanel
                      open={isEditPanelOpen}
                      onRequestClose={() => setIsEditPanelOpen(false)}
                    />
                  ) : undefined
                }
              />
            </Box>
          )}

          {isGridViewOpen ? (
            <Box
              className={styles.canvasArea}
              width="full"
              height="full"
              display="flex"
              flexDirection="column"
            >
              <Box className={styles.canvasScroll} ref={canvasScrollRef}>
                <PagesGrid
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onAddPage={handleAddPage}
                  onDuplicatePage={handleDuplicatePage}
                  onDeletePage={handleDeletePage}
                />
              </Box>
              <EditorFooter
                currentPage={currentPage}
                totalPages={totalPages}
                zoomPercent={zoomPercent}
                onZoomChange={handleZoomChange}
                onFit={handleFit}
                onFill={handleFill}
                viewMode={viewMode}
                onToggleViewMode={() => {
                  /* grid view doesn't use this */
                }}
                isGridMode={isGridViewOpen}
                onToggleGrid={handleToggleGrid}
                showFitFill={false}
              />
            </Box>
          ) : (
            <Box className={dsVideoWrapperClass}>
              {dsVideoPanelBefore && <DesignSchoolVideoPanel />}
              {doctype === 'document' ? (
                <DocumentDoctype
                  viewMode={viewMode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  zoomPercent={zoomPercent}
                  onZoomChange={handleZoomChange}
                  onFit={handleFit}
                  onFill={handleFill}
                  onPageChange={handlePageChange}
                  onAddPage={handleAddPage}
                  onToggleViewMode={() =>
                    setViewMode(prev => (prev === 'thumbnails' ? 'continuous' : 'thumbnails'))
                  }
                  onDuplicatePage={handleDuplicatePage}
                  onDeletePage={handleDeletePage}
                  canvasScrollRef={canvasScrollRef}
                />
              ) : doctype === 'spreadsheet' ? (
                <SpreadsheetDoctype
                  viewMode={viewMode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  zoomPercent={zoomPercent}
                  onZoomChange={handleZoomChange}
                  onFit={handleFit}
                  onFill={handleFill}
                  onPageChange={handlePageChange}
                  onAddPage={handleAddPage}
                  onDuplicatePage={handleDuplicatePage}
                  onDeletePage={handleDeletePage}
                  canvasScrollRef={canvasScrollRef}
                />
              ) : doctype === 'whiteboard' ? (
                <WhiteboardDoctype
                  viewMode={viewMode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  zoomPercent={zoomPercent}
                  onZoomChange={handleZoomChange}
                  onFit={handleFit}
                  onFill={handleFill}
                  onPageChange={handlePageChange}
                  onAddPage={handleAddPage}
                  onDuplicatePage={handleDuplicatePage}
                  onDeletePage={handleDeletePage}
                  canvasScrollRef={canvasScrollRef}
                  onToggleViewMode={() => {
                    /* handled by parent */
                  }}
                />
              ) : doctype !== 'presentation' ? (
                <Navigate to="/editor/presentation" replace />
              ) : (
                <PresentationDoctype
                  viewMode={viewMode}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  zoomPercent={zoomPercent}
                  onZoomChange={handleZoomChange}
                  onFit={handleFit}
                  onFill={handleFill}
                  onPageChange={handlePageChange}
                  onAddPage={handleAddPage}
                  onDuplicatePage={handleDuplicatePage}
                  onDeletePage={handleDeletePage}
                  canvasScrollRef={canvasScrollRef}
                  onToggleViewMode={() =>
                    setViewMode(prev => (prev === 'thumbnails' ? 'continuous' : 'thumbnails'))
                  }
                  isGridMode={isGridViewOpen}
                  onToggleGrid={handleToggleGrid}
                />
              )}
              {dsVideoPanelAfter && <DesignSchoolVideoPanel />}
            </Box>
          )}
        </Box>
      </Box>
      <XrayTrigger />
      <XrayOverlay />
    </>
  );
}

export default Editor;
