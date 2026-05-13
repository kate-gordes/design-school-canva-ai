import React from 'react';
import { Box } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { PlusIcon, ChevronDownIcon } from '@canva/easel/icons';
import styles from './AddButtons.module.css';

interface AddButtonsProps {
  onAdd: () => void;
  onDropdown: () => void;
  variant?: 'nav' | 'grid';
  dropdownOpen?: boolean;
}

export default function AddButtons({
  onAdd,
  onDropdown,
  variant = 'nav',
  dropdownOpen = false,
}: AddButtonsProps): React.ReactNode {
  const containerClass =
    variant === 'grid' ? `${styles.container} ${styles.gridContainer}` : styles.container;
  const addClass =
    variant === 'grid' ? `${styles.addButton} ${styles.gridAddButton}` : styles.addButton;
  const dropdownClass =
    variant === 'grid'
      ? `${styles.dropdownButton} ${styles.gridDropdownButton}`
      : styles.dropdownButton;
  const chevronClass = `${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`;
  return (
    <Box className={containerClass}>
      <BasicButton onClick={onAdd} className={addClass} aria-label="Add page">
        <PlusIcon size="medium" />
      </BasicButton>
      <BasicButton onClick={onDropdown} className={dropdownClass} aria-label="Page options">
        <span className={chevronClass}>
          <ChevronDownIcon size="medium" />
        </span>
      </BasicButton>
    </Box>
  );
}
