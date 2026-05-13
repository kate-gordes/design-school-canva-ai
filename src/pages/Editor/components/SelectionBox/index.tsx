import React from 'react';
import styles from './SelectionBox.module.css';

interface SelectionBoxProps {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({
  startX,
  startY,
  currentX,
  currentY,
}) => {
  // Calculate box dimensions
  const left = Math.min(startX, currentX);
  const top = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  return (
    // Plain div: dynamic left/top/width/height computed from pointer drag coords;
    // Easel Box would wipe the dashed border + translucent background via reset_f88b8e.
    <div
      className={styles.selectionBox}
      style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
    />
  );
};

export default SelectionBox;
