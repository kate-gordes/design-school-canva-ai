import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Box, Text } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const EffectsLabelButton = forwardRef<HTMLButtonElement>(function EffectsLabelButton(_props, ref) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const type = (e as CustomEvent).type;
      setActive(type === 'open-edit-panel-effects');
    };
    const handleClose = () => setActive(false);
    const events = [
      'open-edit-panel-animate',
      'open-edit-panel-effects',
      'open-edit-panel-position',
      'open-edit-panel-text',
      'open-edit-panel-text-color',
      'open-edit-panel-color',
      'open-edit-panel-shape',
    ];
    events.forEach(evt => window.addEventListener(evt, handleOpen as EventListener));
    window.addEventListener('close-edit-panel', handleClose as EventListener);
    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleOpen as EventListener));
      window.removeEventListener('close-edit-panel', handleClose as EventListener);
    };
  }, []);

  const onClick = () => {
    if (active) {
      window.dispatchEvent(new CustomEvent('close-edit-panel'));
      setActive(false);
    } else {
      window.dispatchEvent(new CustomEvent('open-edit-panel-effects'));
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
      ariaLabel="Effects"
      onClick={onClick}
      data-toolbar-key="effects"
    >
      <Box className={styles.labeledActionInner} display="inline-flex" alignItems="center">
        <Text weight="bold">Effects</Text>
      </Box>
    </Button>
  );
});

export default EffectsLabelButton;
