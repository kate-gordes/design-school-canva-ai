import React, { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Box, Text } from '@canva/easel';
import { FxIcon, CornerCircleIcon } from '@/shared_components/icons';
import PageNavigator from '@/pages/Editor/components/PageNavigator';
import EditorFooter from '@/pages/Editor/components/EditorFooter';
import styles from './spreadsheet.module.css';

export interface SpreadsheetDoctypeProps {
  viewMode: 'thumbnails' | 'continuous' | 'grid';
  currentPage: number; // sheet index (1-based)
  totalPages: number; // number of sheets
  zoomPercent: number;
  onZoomChange: (p: number) => void;
  onFit: () => void;
  onFill: () => void;
  onPageChange: (p: number) => void; // change sheet
  onAddPage: () => void; // add sheet
  canvasScrollRef?: RefObject<HTMLDivElement>;
  onDuplicatePage?: (page: number) => void;
  onDeletePage?: (page: number) => void;
  isMobile?: boolean;
}

export default function SpreadsheetDoctype(props: SpreadsheetDoctypeProps): React.ReactNode {
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
    isMobile = false,
  } = props;

  const sheetViewportRef = useRef<HTMLDivElement | null>(null);
  const gridBodyRef = useRef<HTMLDivElement | null>(null);

  // Selection state
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Simple cell editing state
  const [cellValues, setCellValues] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>('');
  const editorInputRef = useRef<HTMLInputElement | null>(null);

  // Constants that must mirror CSS sizes for alignment
  const CELL_WIDTH_PX = 118; // must match .gridBody background-size column width
  const CELL_HEIGHT_PX = 40; // must match .gridBody background-size row height

  useEffect(() => {
    // Ensure sheet always starts at the very top under the header
    const el = sheetViewportRef.current;
    if (el) {
      el.scrollTop = 0;
      el.scrollLeft = 0;
    }
  }, [currentPage]);

  useEffect(() => {
    if (isEditing && editorInputRef.current) {
      editorInputRef.current.focus();
      const len = editorInputRef.current.value.length;
      editorInputRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  const keyFor = (row: number, col: number) => `${row},${col}`;
  const startEditing = (row: number, col: number) => {
    const key = keyFor(row, col);
    setEditValue(cellValues[key] ?? '');
    setIsEditing(true);
  };
  const commitEdit = () => {
    if (!selectedCell) return setIsEditing(false);
    const key = keyFor(selectedCell.row, selectedCell.col);
    setCellValues(prev => ({ ...prev, [key]: editValue }));
    setIsEditing(false);
  };

  const renderGrid = () => (
    // Plain div: Easel Box resets background/margin, which would break
    // canvasScroll's white background and 1px border.
    <div className={styles.canvasScroll} ref={canvasScrollRef as RefObject<HTMLDivElement>}>
      {!isMobile && (
        <Box className={styles.formulaBar} display="flex" alignItems="center">
          <FxIcon />
          <div
            className={styles.formulaArea}
            onClick={() => {
              if (!selectedCell) return;
              if (isEditing) {
                editorInputRef.current?.focus();
              } else {
                startEditing(selectedCell.row, selectedCell.col);
              }
            }}
          >
            {selectedCell && isEditing && editValue === '' ? (
              <Text size="small" tone="secondary" className={styles.formulaText}>
                Type = to insert a formula
              </Text>
            ) : selectedCell ? (
              <Text size="small" className={styles.formulaText}>
                {isEditing
                  ? editValue
                  : (cellValues[keyFor(selectedCell.row, selectedCell.col)] ?? '')}
              </Text>
            ) : null}
          </div>
        </Box>
      )}
      <div className={styles.sheetViewport} ref={sheetViewportRef}>
        <div className={styles.sheet}>
          <div className={styles.topHeader}>
            <div
              className={styles.corner}
              onClick={() => {
                setSelectAll(true);
                setSelectedCell(null);
                setSelectedColumnIndex(null);
                setSelectedRowIndex(null);
                setIsEditing(false);
              }}
            >
              <CornerCircleIcon />
            </div>
            <div className={styles.colHeaders}>
              {Array.from({ length: 26 }, (_, i) => (
                <div
                  key={i}
                  className={`${styles.colHeader} ${
                    selectAll
                      ? styles.headerSelected
                      : selectedColumnIndex === i
                        ? styles.headerSelected
                        : selectedCell && selectedCell.col === i
                          ? styles.headerActive
                          : ''
                  }`}
                  onClick={() => {
                    setSelectAll(false);
                    setSelectedColumnIndex(i);
                    setSelectedRowIndex(null);
                    setSelectedCell(null);
                    setIsEditing(false);
                  }}
                >
                  {String.fromCharCode('A'.charCodeAt(0) + i)}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.bodyScroll}>
            <div className={styles.bodyGrid}>
              <div className={styles.rowHeaders}>
                {Array.from({ length: 200 }, (_, i) => (
                  <div
                    key={i}
                    className={`${styles.rowHeader} ${
                      selectAll
                        ? styles.headerSelected
                        : selectedRowIndex === i
                          ? styles.headerSelected
                          : selectedCell && selectedCell.row === i
                            ? styles.headerActive
                            : ''
                    }`}
                    onClick={() => {
                      setSelectAll(false);
                      setSelectedRowIndex(i);
                      setSelectedColumnIndex(null);
                      setSelectedCell(null);
                      setIsEditing(false);
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div
                ref={gridBodyRef}
                className={styles.gridBody}
                onDoubleClick={() => {
                  if (selectedCell) startEditing(selectedCell.row, selectedCell.col);
                }}
                onClick={e => {
                  const target = e.currentTarget;
                  const rect = target.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const col = Math.max(0, Math.min(25, Math.floor(x / CELL_WIDTH_PX)));
                  const row = Math.max(0, Math.min(199, Math.floor(y / CELL_HEIGHT_PX)));
                  if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
                    startEditing(row, col);
                    return;
                  }
                  setSelectAll(false);
                  setIsEditing(false);
                  setSelectedCell({ row, col });
                  setSelectedColumnIndex(null);
                  setSelectedRowIndex(null);
                }}
              >
                {Object.entries(cellValues).map(([key, value]) => {
                  const [rS, cS] = key.split(',');
                  const r = parseInt(rS, 10);
                  const c = parseInt(cS, 10);
                  return (
                    <div
                      key={key}
                      className={styles.cellValue}
                      style={{
                        left: c * CELL_WIDTH_PX + 8,
                        top: r * CELL_HEIGHT_PX + 10 + (r === 0 ? 1 : 0),
                        width: CELL_WIDTH_PX - 16,
                      }}
                    >
                      {value}
                    </div>
                  );
                })}
                {!selectAll && selectedCell && (
                  <div
                    className={styles.cellSelection}
                    style={{
                      left: selectedCell.col * CELL_WIDTH_PX,
                      top: selectedCell.row * CELL_HEIGHT_PX + (selectedCell.row === 0 ? 1 : 0),
                      width: CELL_WIDTH_PX,
                      height: CELL_HEIGHT_PX - (selectedCell.row === 0 ? 1 : 0),
                    }}
                  />
                )}
                {!selectAll && selectedCell && !isEditing && (
                  <div
                    className={styles.cellSelection}
                    style={{
                      left: selectedCell.col * CELL_WIDTH_PX,
                      top: selectedCell.row * CELL_HEIGHT_PX + (selectedCell.row === 0 ? 1 : 0),
                      width: CELL_WIDTH_PX,
                      height: CELL_HEIGHT_PX - (selectedCell.row === 0 ? 1 : 0),
                    }}
                  >
                    <div className={styles.cellHandle} />
                  </div>
                )}
                {selectedCell && isEditing && (
                  <input
                    ref={editorInputRef}
                    className={styles.cellEditor}
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEdit();
                      if (e.key === 'Escape') setIsEditing(false);
                    }}
                    style={{
                      left: selectedCell.col * CELL_WIDTH_PX + 2,
                      top: selectedCell.row * CELL_HEIGHT_PX + 2 + (selectedCell.row === 0 ? 1 : 0),
                      width: CELL_WIDTH_PX - 4,
                      height: CELL_HEIGHT_PX - 4 - (selectedCell.row === 0 ? 1 : 0),
                    }}
                  />
                )}
                {!selectAll && selectedColumnIndex !== null && (
                  <div
                    className={styles.cellSelection}
                    style={{
                      left: selectedColumnIndex * CELL_WIDTH_PX,
                      top: 1,
                      width: CELL_WIDTH_PX,
                      height: 200 * CELL_HEIGHT_PX - 1,
                    }}
                  >
                    <div className={`${styles.cellHandle} ${styles.cellHandleRightCenter}`} />
                  </div>
                )}
                {!selectAll && selectedRowIndex !== null && (
                  <div
                    className={styles.cellSelection}
                    style={{
                      left: 0,
                      top: selectedRowIndex * CELL_HEIGHT_PX + (selectedRowIndex === 0 ? 1 : 0),
                      width: 26 * CELL_WIDTH_PX,
                      height: CELL_HEIGHT_PX - (selectedRowIndex === 0 ? 1 : 0),
                    }}
                  >
                    <div className={`${styles.cellHandle} ${styles.cellHandleCenter}`} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Box className={styles.canvasArea}>
      {renderGrid()}
      {viewMode === 'thumbnails' && (
        <PageNavigator
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onAddPage={onAddPage}
          onDuplicatePage={onDuplicatePage}
          onDeletePage={onDeletePage}
          thumbWidthPx={113.77}
          label="Sheet"
          fixed={false}
          isMobile={isMobile}
        />
      )}
      {!isMobile && (
        <EditorFooter
          currentPage={currentPage}
          totalPages={totalPages}
          zoomPercent={zoomPercent}
          onZoomChange={onZoomChange}
          onFit={onFit}
          onFill={onFill}
          viewMode={viewMode === 'grid' ? 'thumbnails' : viewMode}
          onToggleViewMode={() => {
            /* handled by parent */
          }}
          isGridMode={viewMode === 'grid'}
          onToggleGrid={() => {
            /* handled by parent */
          }}
          showFitFill={false}
        />
      )}
    </Box>
  );
}
