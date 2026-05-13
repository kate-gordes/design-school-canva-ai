import React, { forwardRef } from 'react';
import GenericCycleIconButton from '@/pages/Editor/components/EditorToolbar/GenericItems/CycleIconButton';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
} from '@canva/easel/icons';

const TextAlignCycleButton = forwardRef<HTMLButtonElement>(
  function TextAlignCycleButton(_props, ref) {
    return (
      <GenericCycleIconButton
        ref={ref}
        ariaLabel="Cycle alignment"
        icons={[TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, TextAlignJustifyIcon]}
        className={styles.iconButton}
        data-toolbar-key="align"
      />
    );
  },
);

export default TextAlignCycleButton;
