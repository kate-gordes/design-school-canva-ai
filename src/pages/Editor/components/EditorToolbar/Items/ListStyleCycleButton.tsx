import React, { forwardRef } from 'react';
import GenericCycleIconButton from '@/pages/Editor/components/EditorToolbar/GenericItems/CycleIconButton';
import { ListBulletLtrIcon, ListNumberLtrIcon } from '@canva/easel/icons';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const ListStyleCycleButton = forwardRef<HTMLButtonElement>(
  function ListStyleCycleButton(_props, ref) {
    return (
      <GenericCycleIconButton
        ref={ref}
        ariaLabel="Cycle list style"
        icons={[ListBulletLtrIcon, ListNumberLtrIcon]}
        className={styles.iconButton}
        data-toolbar-key="list"
      />
    );
  },
);

export default ListStyleCycleButton;
