import React, { useEffect, useRef, useState } from 'react';
import { Box, Carousel } from '@canva/easel';
import AddButtons from './AddButtons';
import AddPagePopup from './AddPagePopup';
import PageThumbnail from './PageThumbnail';
import { useAppContext } from '@/hooks/useAppContext';
import styles from './PageNavigator.module.css';

interface PageNavigatorProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (pageNumber: number) => void;
  onAddPage?: () => void;
  onDuplicatePage?: (pageNumber: number) => void;
  onDeletePage?: (pageNumber: number) => void;
  thumbWidthPx?: number;
  label?: string; // e.g., "Page" | "Sheet"
  fixed?: boolean; // when true (default), render as fixed overlay; otherwise stacked in flow
  isMobile?: boolean;
  isCanvasSelected?: boolean; // true when an element on the canvas is actively selected
}

export default function PageNavigator({
  currentPage = 1,
  totalPages = 3,
  onPageChange = () => {},
  onAddPage = () => {},
  onDuplicatePage = () => {},
  onDeletePage = () => {},
  thumbWidthPx,
  label = 'Page',
  fixed = true,
  isMobile = false,
}: PageNavigatorProps): React.ReactNode {
  // Ref for controlling carousel scrolling
  const scrollControlsRef = useRef(null);
  const navRef = useRef<HTMLElement>(null);

  // Tracks which thumb was most recently clicked. Cleared when the user
  // clicks anywhere outside the navigator, so the gray "current page"
  // outline resumes as the persistent indicator.
  const [clickedPage, setClickedPage] = useState<number | null>(null);
  const [addPopupOpen, setAddPopupOpen] = useState(false);
  const addButtonsWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (clickedPage === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setClickedPage(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [clickedPage]);

  useEffect(() => {
    if (!addPopupOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (addButtonsWrapRef.current?.contains(target)) return;
      if (target.closest('[data-add-page-popup]')) return;
      setAddPopupOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [addPopupOpen]);

  const handlePageClick = (pageNumber: number) => {
    setClickedPage(pageNumber);
    onPageChange(pageNumber);
  };

  const handleAddPage = () => {
    onAddPage();
    // Scroll to the start (left) after adding a page to keep add button visible
    setTimeout(() => {
      if (scrollControlsRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const controls = scrollControlsRef.current as any;

        console.log('Testing scroll direction...');

        // Try both directions to see which works
        if (controls.moveNext) {
          console.log('Trying moveNext multiple times (might be the correct direction)');
          // Try moveNext instead - maybe the carousel coordinates are reversed
          for (let i = 0; i < 20; i++) {
            controls.moveNext();
          }
        } else if (controls.movePrev) {
          console.log('Fallback to movePrev multiple times');
          // Move to the very beginning by calling movePrev many times
          for (let i = 0; i < 20; i++) {
            controls.movePrev();
          }
        } else if (controls.moveToItem) {
          console.log('Fallback to moveToItem');
          // Try moving to the first item
          controls.moveToItem(0, 'start');
        }
      }
    }, 100); // Small delay to ensure the new page is rendered
  };

  const handleDuplicatePage = (pageNumber: number) => {
    onDuplicatePage(pageNumber);
  };

  const handleDeletePage = (pageNumber: number) => {
    onDeletePage(pageNumber);
  };

  const handleDropdownClick = () => {
    setAddPopupOpen(open => !open);
  };

  const { state } = useAppContext();

  const getLeftRailWidth = () => {
    if (!fixed || !state.objectPanelDocked) return 72;
    switch (state.dockedPanelName) {
      case 'Brand':
        return 636;
      case 'BrandSidebar':
        return 294;
      default:
        return 432;
    }
  };

  const containerClassName = fixed ? styles.container : styles.containerStatic;

  const navStyle: React.CSSProperties = {
    ...(thumbWidthPx ? { ['--thumbWidth' as string]: `${thumbWidthPx}px` } : {}),
    ...(fixed ? { left: `${getLeftRailWidth()}px` } : {}),
  };

  return (
    <nav
      ref={navRef}
      aria-label="Page thumbnails"
      className={containerClassName as string}
      style={navStyle}
    >
      <Box className={styles.carouselContainer} display="flex" justifyContent="center">
        <Carousel
          name="page-navigator"
          gap="0"
          gutter="medium"
          buttonVariant="none"
          scrollControlsRef={scrollControlsRef}
          smoothScroll={true}
        >
          {/* Page thumbnails */}
          {Array.from({ length: totalPages }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <PageThumbnail
                key={pageNumber}
                pageNumber={pageNumber}
                isActive={pageNumber === currentPage}
                isSelected={pageNumber === clickedPage}
                onClick={() => handlePageClick(pageNumber)}
                onDuplicate={() => handleDuplicatePage(pageNumber)}
                onDelete={() => handleDeletePage(pageNumber)}
                label={label}
                isMobile={isMobile}
              />
            );
          })}

          {/* Add page buttons */}
          <div ref={addButtonsWrapRef} className={styles.addButtonsWrap}>
            <AddButtons
              onAdd={handleAddPage}
              onDropdown={handleDropdownClick}
              dropdownOpen={addPopupOpen}
            />
            {addPopupOpen && (
              <AddPagePopup
                anchorRef={addButtonsWrapRef}
                onSelect={() => {
                  setAddPopupOpen(false);
                  onAddPage();
                }}
              />
            )}
          </div>
        </Carousel>
      </Box>
    </nav>
  );
}
