import React from 'react';
import { Text, Box } from '@canva/easel';
import styles from './PresentOptionButton.module.css';

interface PresentOptionButtonProps {
  icon: React.ComponentType<{
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    tone?:
      | 'primary'
      | 'secondary'
      | 'tertiary'
      | 'contrast'
      | 'info'
      | 'positive'
      | 'caution'
      | 'critical';
  }>;
  label: string;
  onClick: () => void;
  selected?: boolean;
}

export const PresentOptionButton: React.FC<PresentOptionButtonProps> = ({
  icon,
  label,
  onClick,
  selected = false,
}) => {
  return (
    <button className={styles.actionItem} onClick={onClick}>
      <Box className={`${styles.actionIcon} ${selected ? styles.selectedIcon : ''}`}>
        {React.createElement(icon, { size: 'medium', tone: 'secondary' })}
      </Box>
      <Text size="small" className={styles.actionLabel}>
        {label}
      </Text>
    </button>
  );
};
