import { Swatch } from '@canva/easel';
import { Box, Text } from '@canva/easel';
import styles from './ColorSwatch.module.css';

export interface ColorSwatchProps {
  /** Hex color code (e.g., '#7d2ae7') */
  color: string;
  /** Optional color name */
  name?: string;
  /** Whether to show the label below the swatch */
  showLabel?: boolean;
  /** Click handler - typically for copying to clipboard */
  onClick?: () => void;
  /** Delete handler - shows X button on hover */
  onDelete?: () => void;
}

export default function ColorSwatch({
  color,
  name,
  showLabel = false,
  onClick,
  onDelete,
}: ColorSwatchProps) {
  const label = name || color;

  return (
    <Box className={styles.swatchContainer}>
      <Swatch
        variant="solid"
        size="xxsmall"
        stretch={true}
        aspectRatio={1}
        fill={[color]}
        onClick={onClick}
        onDelete={onDelete}
      />
      {showLabel && (
        <Box className={styles.labelContainer}>
          <Text
            className={styles.labelText}
            size="small"
            alignment="center"
            tone="tertiary"
            weight="regular"
          >
            {label}
          </Text>
        </Box>
      )}
    </Box>
  );
}
