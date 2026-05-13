import React from 'react';
import { Box } from '@canva/easel';
import styles from './SearchPills.module.css';

interface SearchPillsProps {
  categories: string[];
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
}

export default function SearchPills({
  categories,
  selectedCategory,
  onCategorySelect,
}: SearchPillsProps): React.ReactNode {
  return (
    <Box className={styles.wrapper}>
      <Box className={styles.scrollContainer}>
        {categories.map(category => {
          const isSelected = category === selectedCategory;
          // Raw <button>: Easel Pill enforces its own padding, border, radius,
          // and typography. These search pills use custom sizing/colors
          // (20px radius, purple selected state) that conflict with Pill's
          // token-driven contract. Native button preserves the bespoke visual.
          return (
            <button
              key={category}
              className={`${styles.pill} ${isSelected ? styles.pillSelected : ''}`}
              onClick={() => onCategorySelect?.(category)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </Box>
    </Box>
  );
}
