import { Box } from '@canva/easel';
import { SearchIcon } from '@canva/easel/icons';
import React, { useState } from 'react';
import styles from './MobileSearchBox.module.css';

interface MobileSearchBoxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function MobileSearchBox({
  placeholder = 'Search templates',
  value: controlledValue,
  onChange,
}: MobileSearchBoxProps): React.ReactNode {
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.searchBox}>
        <Box className={styles.iconWrapper}>
          <SearchIcon size="medium" />
        </Box>
        <input
          type="text"
          placeholder={placeholder}
          className={styles.input}
          value={value}
          onChange={handleChange}
        />
      </Box>
    </Box>
  );
}
