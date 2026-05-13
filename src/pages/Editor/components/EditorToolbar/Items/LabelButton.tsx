import React, { forwardRef } from 'react';
import { Box, Button, Text } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

export type LabelButtonProps = {
  ariaLabel: string;
  active?: boolean;
  onClick: () => void;
  label: string;
  startIcon?: React.ReactNode;
  dataToolbarKey?: string;
};

const LabelButton = forwardRef<HTMLButtonElement, LabelButtonProps>(
  ({ ariaLabel, active, onClick, label, startIcon, dataToolbarKey }, ref) => (
    <Button
      ref={ref}
      variant="secondary"
      size="small"
      className={`${styles.labeledAction}${active ? ` ${styles.activeAction}` : ''}`}
      ariaLabel={ariaLabel}
      onClick={onClick}
      data-toolbar-key={dataToolbarKey}
    >
      <Box className={styles.labeledActionInner} display="inline-flex" alignItems="center">
        {startIcon}
        <Text weight="bold">{label}</Text>
      </Box>
    </Button>
  ),
);

export default LabelButton;
