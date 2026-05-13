import React, { forwardRef, useEffect, useState } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const FillColorButton = forwardRef<HTMLButtonElement>(function FillColorButton(_props, ref) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const type = (e as CustomEvent).type;
      setActive(type === 'open-edit-panel-color');
    };
    const handleClose = () => setActive(false);
    const events = [
      'open-edit-panel-color',
      'open-edit-panel-text',
      'open-edit-panel-text-color',
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

  return (
    <IconButton
      ref={ref}
      ariaLabel="Fill color"
      onClick={() => {
        if (active) {
          window.dispatchEvent(new CustomEvent('close-edit-panel'));
          setActive(false);
        } else {
          const ev = new CustomEvent('open-edit-panel-color');
          window.dispatchEvent(ev);
          setActive(true);
        }
      }}
      dataToolbarKey="fill"
      pressed={active}
    >
      {/* Plain span: Easel Box would wipe the swatch background. */}
      <span className={styles.fillColorSwatch} />
    </IconButton>
  );
});

export default FillColorButton;
