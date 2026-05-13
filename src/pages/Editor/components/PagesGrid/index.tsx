import React from 'react';
import { Box } from '@canva/easel';
import PageThumbnail from '@/pages/Editor/components/PageNavigator/PageThumbnail';
import styles from './PagesGrid.module.css';
import AddButtons from '@/pages/Editor/components/PageNavigator/AddButtons';

export interface PagesGridProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onAddPage: () => void;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  isMobile?: boolean;
}

export default function PagesGrid({
  totalPages,
  currentPage,
  onPageChange,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  isMobile = false,
}: PagesGridProps): React.ReactNode {
  const tiles = Array.from({ length: totalPages }, (_, i) => i + 1);
  const gridClass = isMobile ? `${styles.grid} ${styles.mobileGrid}` : styles.grid;
  const tileClass = isMobile ? `${styles.tile} ${styles.mobileTile}` : (styles.tile as string);
  return (
    <Box width="full" padding="3u">
      <div className={gridClass}>
        {tiles.map(page => (
          <div key={page} className={tileClass}>
            <PageThumbnail
              pageNumber={page}
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              onDuplicate={() => onDuplicatePage?.(page)}
              onDelete={() => onDeletePage?.(page)}
              variant="mobileGrid"
            />
          </div>
        ))}
        <div className={tileClass}>
          <AddButtons onAdd={onAddPage} onDropdown={() => {}} variant="grid" />
        </div>
      </div>
    </Box>
  );
}
