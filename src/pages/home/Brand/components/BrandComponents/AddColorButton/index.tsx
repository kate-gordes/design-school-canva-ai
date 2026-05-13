import { Box, Text } from '@canva/easel';
import { PlusIcon } from '@canva/easel/icons';
import styles from './AddColorButton.module.css';

export interface AddColorButtonProps {
  /** Click handler for adding a new color */
  onClick?: () => void;
  /** Whether to show the "Add new" label */
  showLabel?: boolean;
}

export default function AddColorButton({ onClick, showLabel = false }: AddColorButtonProps) {
  return (
    <Box className={styles.container}>
      <button className={styles.addButton} onClick={onClick} aria-label="Add color">
        <div className={styles.rainbowGradient}>
          <PlusIcon size="small" className={styles.plusIcon} />
        </div>
      </button>
      {showLabel && (
        <Box className={styles.labelContainer}>
          <Text size="xsmall" alignment="center">
            Add new
          </Text>
        </Box>
      )}
    </Box>
  );
}
