import React from 'react';
import { Button } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

export type LabelIconButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  icon: React.ReactNode;
  dataToolbarKey?: string;
  pressed?: boolean;
};

export default function LabelIconButton({
  ariaLabel,
  onClick,
  icon,
  dataToolbarKey,
  pressed,
}: LabelIconButtonProps) {
  return (
    <Button
      variant="secondary"
      size="medium"
      className={styles.iconButton}
      ariaLabel={ariaLabel}
      onClick={onClick}
      data-toolbar-key={dataToolbarKey}
      pressed={pressed}
    >
      {icon}
    </Button>
  );
}
