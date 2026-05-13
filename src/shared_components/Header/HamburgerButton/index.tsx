import { Button } from '@canva/easel/button';
import type { ReactNode } from 'react';
import styles from './HamburgerButton.module.css';

interface HamburgerButtonProps {
  icon?: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}

export default function HamburgerButton({
  icon,
  onClick,
  ariaLabel,
}: HamburgerButtonProps): JSX.Element {
  return (
    <Button
      variant="tertiary"
      size="small"
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={styles.hamburgerButton}
    >
      {icon}
    </Button>
  );
}
