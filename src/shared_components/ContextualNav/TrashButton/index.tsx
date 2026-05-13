import React from 'react';
import { Text } from '@canva/easel';
import { TrashIcon } from '@canva/easel/icons';
import styles from './TrashButton.module.css';

interface TrashButtonProps {
  onClick?: () => void;
}

const TrashButton: React.FC<TrashButtonProps> = ({ onClick }) => {
  // Plain button: Easel Button adds its own chrome (padding, min-height,
  // focus ring) that conflicts with the bottom-rail Trash row styling in
  // .trashButton. Raw button preserves the custom hover + spacing.
  return (
    <button className={styles.trashButton} onClick={onClick}>
      <TrashIcon size="medium" />
      <Text size="medium" className={styles.trashText}>
        Trash
      </Text>
    </button>
  );
};

export default TrashButton;
