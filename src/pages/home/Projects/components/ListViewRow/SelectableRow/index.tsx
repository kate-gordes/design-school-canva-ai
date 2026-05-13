import React from 'react';
import { Box } from '@canva/easel';
import type { IComputedValue } from 'mobx';
import { observer } from 'mobx-react-lite';
import styles from './SelectableRow.module.css';

// Simplified types for our prototype - in real Canva these would be complex domain types
interface SimplifiedFolder {
  id: string;
  name: string;
}

interface SimplifiedItem {
  id: string;
  title: string;
  resultDataType: string;
}

interface SimplifiedAnalyticsService {
  track?: (event: string, props: any) => void;
}

interface SimplifiedMetadataPanelController {
  isOpen?: boolean;
}

interface SimplifiedSessionInfo {
  userId?: string;
}

interface SelectableRowProps {
  folder?: SimplifiedFolder;
  isLast: boolean;
  isRenaming: IComputedValue<boolean>;
  size: 'small' | 'large';
  children: React.ReactNode;
  item: SimplifiedItem;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  href?: string;
  dragHover?: boolean;
  didDrop?: boolean;
  onHoverAnimationEnd?: () => void;
  onDropAnimationEnd?: () => void;
  analyticsService: SimplifiedAnalyticsService;
  isDetailsMenuOpen: boolean;
  metadataPanelController: SimplifiedMetadataPanelController;
  authSession: SimplifiedSessionInfo;
  enableRealUploadsFolder: boolean;
  enableEnhancedPermissions: boolean;
}

const SelectableRow = observer(function SelectableRow({
  folder,
  isLast,
  isRenaming,
  size,
  children,
  item,
  onClick,
  onContextMenu,
  href,
  dragHover,
  didDrop,
  onHoverAnimationEnd,
  onDropAnimationEnd,
  analyticsService,
  isDetailsMenuOpen,
  metadataPanelController,
  authSession,
  enableRealUploadsFolder,
  enableEnhancedPermissions,
}: SelectableRowProps): React.ReactNode {
  const [isSelected, setIsSelected] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    // Handle selection logic
    if (e.ctrlKey || e.metaKey) {
      setIsSelected(!isSelected);
      e.preventDefault();
    } else {
      onClick?.(e);
    }

    // Analytics tracking
    analyticsService.track?.('list_item_clicked', {
      itemId: item.id,
      itemType: item.resultDataType,
      folder: folder?.name,
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    onContextMenu?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const classes = [
    styles.selectableRow,
    isSelected ? styles.selected : '',
    isDragging ? styles.dragging : '',
    dragHover ? styles.dragHover : '',
    didDrop ? styles.didDrop : '',
    isDetailsMenuOpen ? styles.detailsOpen : '',
    size === 'small' ? styles.small : styles.large,
    isRenaming.get() ? styles.renaming : '',
  ]
    .filter(Boolean)
    .join(' ');

  const baseProps = {
    className: classes,
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    onKeyDown: handleKeyDown,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    onAnimationEnd: () => {
      if (dragHover) onHoverAnimationEnd?.();
      if (didDrop) onDropAnimationEnd?.();
    },
    tabIndex: 0,
    role: href ? undefined : 'button',
    draggable: true,
    'aria-selected': isSelected,
    'data-testid': `list-item-${item.id}`,
  };

  if (href) {
    return (
      <Box
        as="a"
        href={href}
        {...baseProps}
        role="row"
        padding="0"
        borderBottom={isLast ? 'none' : 'standard'}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box as="div" {...baseProps} role="row" padding="0" borderBottom={isLast ? 'none' : 'standard'}>
      {children}
    </Box>
  );
});

export default SelectableRow;
