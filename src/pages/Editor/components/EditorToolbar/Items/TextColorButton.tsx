import React, { forwardRef, useEffect, useState } from 'react';
import { Button } from '@canva/easel';
import { TextColorCustomIcon } from '@/shared_components/icons';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const TextColorButton = forwardRef<HTMLButtonElement>(function TextColorButton(_props, ref) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const type = (e as CustomEvent).type;
      setActive(type === 'open-edit-panel-text-color');
    };
    const handleClose = () => setActive(false);
    const events = [
      'open-edit-panel-text-color',
      'open-edit-panel-text',
      'open-edit-panel-color',
      'open-edit-panel-animate',
      'open-edit-panel-effects',
      'open-edit-panel-position',
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
      window.dispatchEvent(new CustomEvent('open-edit-panel-text-color'));
      setActive(true);
    }
  };

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="medium"
      pressed={active}
      className={styles.iconButton}
      ariaLabel="Text color"
      onClick={onClick}
      data-toolbar-key="color"
    >
      <TextColorCustomIcon />
    </Button>
  );
});

export default TextColorButton;
