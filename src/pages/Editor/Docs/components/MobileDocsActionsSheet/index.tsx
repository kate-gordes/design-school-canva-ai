import React, { useState, useMemo, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useSignals } from '@preact/signals-react/runtime';
import { MagicWandIcon } from '@canva/easel/icons';
import {
  mobileDocsActionsSheetOpen,
  closeMobileDocsActionsSheet,
  mobileDocsEditingBlockId,
  insertMarkdownPrefix,
  setAIPanelOpen,
  activeBlockId,
} from '@/store';
import { useDragToDismiss } from '@/hooks/useDragToDismiss';
import { getPortalTarget } from '@/utils/portalTarget';
import styles from './MobileDocsActionsSheet.module.css';

interface ActionOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

const H1Icon = () => <span>H1</span>;
const H2Icon = () => <span>H2</span>;
const BodyIcon = () => <span>T</span>;
const DividerIcon = () => <span>—</span>;

export default function MobileDocsActionsSheet(): React.ReactNode {
  useSignals();
  const [search, setSearch] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    closeMobileDocsActionsSheet();
    setSearch('');
  }, []);

  const { dragHandleProps, panelStyle } = useDragToDismiss({
    onDismiss: handleClose,
    panelHeight: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400,
  });

  const blockId = mobileDocsEditingBlockId.value ?? activeBlockId.value;

  const options: ActionOption[] = useMemo(
    () => [
      {
        id: 'magic-write',
        label: 'Magic Write',
        icon: <MagicWandIcon size="small" />,
        action: () => {
          handleClose();
          setAIPanelOpen(true);
        },
      },
      {
        id: 'heading',
        label: 'Heading',
        icon: <H1Icon />,
        action: () => {
          if (blockId) insertMarkdownPrefix(blockId, '# ');
          handleClose();
        },
      },
      {
        id: 'subheading',
        label: 'Subheading',
        icon: <H2Icon />,
        action: () => {
          if (blockId) insertMarkdownPrefix(blockId, '## ');
          handleClose();
        },
      },
      {
        id: 'body',
        label: 'Body',
        icon: <BodyIcon />,
        action: () => {
          if (blockId) insertMarkdownPrefix(blockId, '');
          handleClose();
        },
      },
      {
        id: 'quote',
        label: 'Quote',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
          </svg>
        ),
        action: () => {
          if (blockId) insertMarkdownPrefix(blockId, '> ');
          handleClose();
        },
      },
      {
        id: 'divider',
        label: 'Divider',
        icon: <DividerIcon />,
        action: () => {
          // Placeholder — divider not yet supported as a block type
          handleClose();
        },
      },
    ],
    [blockId, handleClose],
  );

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [search, options]);

  if (!mobileDocsActionsSheetOpen.value) return null;

  const handleSearchMouseDown = (e: React.MouseEvent) => {
    // Allow search input to receive focus without stealing from contentEditable
    e.stopPropagation();
  };

  return ReactDOM.createPortal(
    <>
      <div className={styles.backdrop} onClick={handleClose} />
      <div className={styles.sheet} style={panelStyle}>
        <div className={styles.dragHandle} {...dragHandleProps}>
          <div className={styles.dragIndicator} />
        </div>

        <div className={styles.searchWrapper}>
          <input
            ref={searchRef}
            className={styles.searchInput}
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onMouseDown={handleSearchMouseDown}
          />
        </div>

        <ul className={styles.optionsList}>
          {filtered.map(option => (
            <li key={option.id}>
              <button type="button" className={styles.option} onClick={option.action}>
                <span className={styles.optionIcon}>{option.icon}</span>
                <span className={styles.optionLabel}>{option.label}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li>
              <div className={styles.option} style={{ color: '#999' }}>
                No matching actions
              </div>
            </li>
          )}
        </ul>
      </div>
    </>,
    getPortalTarget(),
  );
}
