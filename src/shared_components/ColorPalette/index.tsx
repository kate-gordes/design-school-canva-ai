import React from 'react';
import { Text, Spacer } from '@canva/easel';
import styles from './ColorPalette.module.css';

interface ColorPaletteProps {
  /** Name of the color palette */
  name: string;
  /** Array of color hex values */
  colors: string[];
  /** Optional click handler */
  onClick?: () => void;
}

export default function ColorPalette({
  name,
  colors,
  onClick,
}: ColorPaletteProps): React.ReactNode {
  // Raw <div> wrapper: this palette acts as a button when onClick is provided,
  // using role="button" + tabIndex={0}. Easel Box only accepts a narrow Role
  // union (no "button") and tabIndex={-1} only, so swapping loses the a11y
  // contract. Inner swatches are raw <div> because each carries a data-driven
  // backgroundColor that Easel Box's reset_f88b8e would wipe.
  return (
    <div
      className={styles.colorPalette}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Text size="xsmall" tone="secondary">
        {name}
      </Text>
      <Spacer size="1u" />
      <div className={styles.colorRow}>
        {colors.map((color, index) => (
          <div key={index} className={styles.colorSwatch} style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}
