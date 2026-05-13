import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Box, Button, Text } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

export type FontButtonProps = {
  onClick: () => void;
  ariaLabel?: string;
};

const FontButton = forwardRef<HTMLButtonElement, FontButtonProps>(({ onClick, ariaLabel }, ref) => {
  const fontOptions: Array<{ value: string; label: string }> = useMemo(
    () => [
      { value: 'canva-sans-display', label: 'Canva Sans Display' },
      { value: 'canva-sans', label: 'Canva Sans' },
      { value: 'canva-serif', label: 'Canva Serif' },
      { value: 'open-sans', label: 'Open Sans' },
      { value: 'roboto', label: 'Roboto' },
      { value: 'lato', label: 'Lato' },
      { value: 'montserrat', label: 'Montserrat' },
    ],
    [],
  );
  const [currentFont] = useState<string>(fontOptions[0]?.label ?? 'Font');
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const type = (e as CustomEvent).type;
      setActive(type === 'open-edit-panel-text');
    };
    const handleClose = () => setActive(false);
    const events = [
      'open-edit-panel-text',
      'open-edit-panel-text-color',
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

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="medium"
      className={styles.fontButton}
      onClick={() => {
        if (active) {
          window.dispatchEvent(new CustomEvent('close-edit-panel'));
          setActive(false);
        } else {
          onClick();
          setActive(true);
        }
      }}
      pressed={active}
      aria-label={ariaLabel ?? 'Choose font'}
      data-toolbar-key="font"
    >
      <Box className={styles.fontLabelContainer} display="flex" alignItems="center">
        <Text className={styles.fontLabel} weight="bold">
          {currentFont}
        </Text>
      </Box>
    </Button>
  );
});

export default FontButton;
