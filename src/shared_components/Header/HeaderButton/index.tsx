import { Button } from '@canva/easel/button';
import type { ReactNode } from 'react';
import styles from './HeaderButton.module.css';

interface HeaderButtonProps {
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  pressed?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  ariaControls?: string;
  ariaHasPopup?: 'menu' | 'dialog' | 'listbox' | 'tree' | 'grid';
}

export default function HeaderButton({
  icon,
  text,
  onClick,
  pressed,
  disabled,
  ariaLabel,
  ariaControls,
  ariaHasPopup,
}: HeaderButtonProps): JSX.Element {
  return (
    <Button
      variant="tertiary"
      size="small"
      onClick={onClick}
      pressed={pressed}
      disabled={disabled}
      ariaLabel={ariaLabel}
      ariaControls={ariaControls}
      ariaHasPopup={ariaHasPopup}
      className={styles.headerButton}
    >
      {icon || text}
    </Button>
  );
}
