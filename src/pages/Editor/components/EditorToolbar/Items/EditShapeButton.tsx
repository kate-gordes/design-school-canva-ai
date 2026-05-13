import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Box, Text } from '@canva/easel';
import { CircleSquareIcon } from '@canva/easel/icons';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const EditShapeButton = forwardRef<HTMLButtonElement>(function EditShapeButton(_props, ref) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const type = (e as CustomEvent).type;
      if (type === 'open-edit-panel-shape') setActive(true);
      else setActive(false);
    };
    const handleClose = () => setActive(false);

    const openEvents = [
      'open-edit-panel-shape',
      'open-edit-panel-color',
      'open-edit-panel-text',
      'open-edit-panel-text-color',
      'open-edit-panel-animate',
      'open-edit-panel-effects',
      'open-edit-panel-position',
    ];

    openEvents.forEach(evt => window.addEventListener(evt, handleOpen as EventListener));
    window.addEventListener('close-edit-panel', handleClose as EventListener);
    return () => {
      openEvents.forEach(evt => window.removeEventListener(evt, handleOpen as EventListener));
      window.removeEventListener('close-edit-panel', handleClose as EventListener);
    };
  }, []);

  const onClick = () => {
    if (active) {
      const ev = new CustomEvent('close-edit-panel');
      window.dispatchEvent(ev);
      setActive(false);
    } else {
      const ev = new CustomEvent('open-edit-panel-shape');
      window.dispatchEvent(ev);
      setActive(true);
    }
  };

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="small"
      pressed={active}
      className={styles.labeledAction}
      ariaLabel="Edit"
      onClick={onClick}
    >
      <Box display="inline-flex" alignItems="center" className={styles.labeledActionInner}>
        <CircleSquareIcon size="medium" />
        <Text weight="bold">Edit</Text>
      </Box>
    </Button>
  );
});

export default EditShapeButton;
