import React, { useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ToolkitPresentationFilledIcon,
  ToolkitSocialFilledIcon,
  ToolkitVideoFilledIcon,
  ToolkitPrintFilledIcon,
  ToolkitDocumentFilledIcon,
  ToolkitWhiteboardFilledIcon,
  ToolkitSheetFilledIcon,
  ToolkitMoreHorizontalIcon,
} from '@canva/easel/icons';
import CodeIcon from '@/shared_components/icons/CodeIcon';
import styles from './AddPagePopup.module.css';

type Tile = {
  option: string;
  title: string;
  color: string;
  Icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>;
  inverted?: boolean;
};

const tiles: Tile[] = [
  {
    option: 'presentation',
    title: 'Presentation',
    color: '#FF6105',
    Icon: ToolkitPresentationFilledIcon,
  },
  { option: 'social', title: 'Social Media', color: '#FF3B4B', Icon: ToolkitSocialFilledIcon },
  { option: 'video', title: 'Video', color: '#E950F7', Icon: ToolkitVideoFilledIcon },
  { option: 'print', title: 'Print', color: '#992BFF', Icon: ToolkitPrintFilledIcon },
  { option: 'doc', title: 'Doc', color: '#13A3B5', Icon: ToolkitDocumentFilledIcon },
  {
    option: 'whiteboard',
    title: 'Whiteboard',
    color: '#0BA84A',
    Icon: ToolkitWhiteboardFilledIcon,
  },
  { option: 'sheet', title: 'Sheet', color: '#138EFF', Icon: ToolkitSheetFilledIcon },
  { option: 'code', title: 'Code', color: '#A21CAF', Icon: CodeIcon },
  {
    option: 'more',
    title: 'More',
    color: '#6453D0',
    Icon: ToolkitMoreHorizontalIcon,
    inverted: true,
  },
];

interface AddPagePopupProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  onSelect?: (option: string) => void;
}

export default function AddPagePopup({
  anchorRef,
  onSelect = () => {},
}: AddPagePopupProps): React.ReactNode {
  const [position, setPosition] = useState<{ left: number; bottom: number } | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPosition({
        left: rect.left + rect.width / 2,
        bottom: window.innerHeight - rect.top - 4,
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef]);

  if (!position) return null;

  return createPortal(
    // Plain div: portal'd popup anchored to a measured DOM rect; left/bottom
    // derived at runtime from getBoundingClientRect. Easel Box reset would wipe
    // the measured positioning.
    <div
      className={styles.container}
      data-add-page-popup="true"
      role="menu"
      aria-label="Add new page"
      style={{ left: `${position.left}px`, bottom: `${position.bottom}px` }}
    >
      <div className={styles.grid}>
        {tiles.map(({ option, title, color, Icon, inverted }) => (
          // Raw button: per-tile dynamic --tileColor CSS var drives the circle
          // tint; Easel Button doesn't accept arbitrary CSS vars.
          <button
            key={option}
            type="button"
            className={styles.tile}
            style={{ ['--tileColor' as string]: color }}
            onClick={() => onSelect(option)}
            aria-label={title}
          >
            <div className={`${styles.circle} ${inverted ? styles.inverted : ''}`}>
              <Icon size="large" />
            </div>
            <span className={styles.label}>{title}</span>
          </button>
        ))}
      </div>
    </div>,
    document.body,
  );
}
