import React from 'react';
import { Button } from '@canva/easel/button';
import { Box } from '@canva/easel';
import { MenuHorizontalIcon } from '@canva/easel/icons';
import styles from './MobileMenuToggle.module.css';
import useIsMobile from '@/hooks/useIsMobile';
import { useAppContext } from '@/hooks/useAppContext';

export default function MobileMenuToggle(): React.ReactNode {
  const isMobile = useIsMobile();
  const { toggleMobileMenu } = useAppContext();

  if (!isMobile) return null;

  return (
    <Box className={styles.container}>
      <Button
        variant="tertiary"
        size="small"
        ariaLabel="Main menu"
        onClick={toggleMobileMenu}
        className={styles.button}
      >
        <MenuHorizontalIcon size="medium" />
      </Button>
    </Box>
  );
}
