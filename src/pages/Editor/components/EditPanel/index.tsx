import React from 'react';
import { Button, Box } from '@canva/easel';
import { XIcon } from '@canva/easel/icons';
import EffectsContent from '@/pages/Editor/components/EditPanel/content/EffectsContent';
import styles from './EditPanel.module.css';

interface EditPanelProps {
  open: boolean;
  onRequestClose: () => void;
  content?: React.ReactNode;
}

export default function EditPanel({
  open,
  onRequestClose,
  content,
}: EditPanelProps): React.ReactNode {
  if (!open) {
    return null;
  }

  return (
    // Plain div: [data-edit-panel-root] hook is used by measure probes.
    <div data-edit-panel-root="true">
      <Button
        variant="tertiary"
        size="small"
        onClick={onRequestClose}
        icon={() => <XIcon size="medium" />}
        className={styles.panelCloseButtonRight}
      />
      <Box height="full" display="flex" flexDirection="column">
        {content ? content : <EffectsContent onClose={onRequestClose} />}
      </Box>
    </div>
  );
}
