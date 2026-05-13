import { Button } from '@canva/easel/button';
import type { MouseEvent } from 'react';
import styles from '@/shared_components/Header/HeaderButton/HeaderButton.module.css';

interface ViewButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  pressed?: boolean;
  ariaControls?: string;
  ariaHasPopup?: 'menu' | 'dialog' | 'listbox' | 'tree' | 'grid';
}

export default function ViewButton({
  onClick,
  pressed,
  ariaControls,
  ariaHasPopup,
}: ViewButtonProps): JSX.Element {
  return (
    <Button
      variant="tertiary"
      size="small"
      onClick={onClick}
      pressed={pressed}
      ariaControls={ariaControls}
      ariaHasPopup={ariaHasPopup}
      className={styles.headerButton}
    >
      View
    </Button>
  );
}
