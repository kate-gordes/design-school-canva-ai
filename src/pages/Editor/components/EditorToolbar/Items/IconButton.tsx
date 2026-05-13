import React, { forwardRef } from 'react';
import { Button } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

export type IconButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
  dataToolbarKey?: string;
  pressed?: boolean;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ ariaLabel, onClick, children, dataToolbarKey, pressed }, ref) => (
    // Plain span: attaches data-toolbar-key hook used by the EditorToolbar measure pass.
    <span data-toolbar-key={dataToolbarKey} className={styles.itemWrap}>
      <Button
        ref={ref}
        variant="secondary"
        size="medium"
        className={styles.iconButton}
        ariaLabel={ariaLabel}
        onClick={onClick}
        pressed={pressed}
      >
        {children}
      </Button>
    </span>
  ),
);

export default IconButton;
