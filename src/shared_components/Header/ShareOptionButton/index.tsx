import React from 'react';
import { Text, Box } from '@canva/easel';
import styles from './ShareOptionButton.module.css';

interface ShareOptionButtonProps {
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

export const ShareOptionButton: React.FC<ShareOptionButtonProps> = ({
  icon,
  label,
  onClick,
  selected = false,
}) => {
  return (
    // Plain button: .actionItem is a column-stack action tile (icon over
    // label) with transparent bg and rounded hover chrome; Easel Button
    // would override the layout and chrome.
    <button
      className={`${styles.actionItem} ${selected ? styles.selectedItem : ''}`}
      onClick={onClick}
    >
      <Box className={`${styles.actionIcon} ${selected ? styles.selectedIcon : ''}`}>
        {React.createElement(icon, { size: 'medium', tone: 'secondary' })}
      </Box>
      <Text size="small" className={styles.actionLabel}>
        {label}
      </Text>
    </button>
  );
};
