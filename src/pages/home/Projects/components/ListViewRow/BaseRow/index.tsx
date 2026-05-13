import React from 'react';
import { Box } from '@canva/easel';
import styles from './BaseRow.module.css';

interface BaseRowProps {
  ariaLabel?: string;
  isLast: boolean;
  size: 'small' | 'large';
  dragging: boolean;
  selected: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  isDetailsMenuOpen: boolean;
  href?: string;
}

export default function BaseRow({
  ariaLabel,
  isLast,
  size,
  dragging,
  selected,
  children,
  onClick,
  onContextMenu,
  isDetailsMenuOpen,
  href,
}: BaseRowProps): React.ReactNode {
  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    onClick?.(e);
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

  const baseProps = {
    'aria-label': ariaLabel,
    className: `${styles.baseRow} ${selected ? styles.selected : ''} ${dragging ? styles.dragging : ''} ${isDetailsMenuOpen ? styles.detailsOpen : ''} ${size === 'small' ? styles.small : styles.large}`,
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    onKeyDown: handleKeyDown,
    tabIndex: 0,
    role: href ? undefined : 'button',
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
}
