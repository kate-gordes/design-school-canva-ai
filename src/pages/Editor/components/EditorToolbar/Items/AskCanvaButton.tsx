import React from 'react';
import { Button, Box, Text } from '@canva/easel';
import NavCanvaAIIconActive from '@/shared_components/icons/NavCanvaAIIconActive';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';

const AskCanvaButton = React.forwardRef<HTMLButtonElement>(function AskCanvaButton(_props, ref) {
  const onClick = () => {
    window.dispatchEvent(new CustomEvent('open-canva-ai-panel'));
  };

  return (
    <Button
      ref={ref}
      variant="secondary"
      size="small"
      className={styles.labeledAction}
      ariaLabel="Ask Canva"
      onClick={onClick}
    >
      <Box className={styles.labeledActionInner} display="inline-flex" alignItems="center">
        <NavCanvaAIIconActive size={24} />
        <Text weight="bold">Ask Canva</Text>
      </Box>
    </Button>
  );
});

export default AskCanvaButton;
