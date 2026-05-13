import React from 'react';
import { TextInput, MagicSearchIcon, SlidersIcon } from '@canva/easel';
import styles from './MagicSearch.module.css';

interface MagicSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MagicSearch({
  value,
  onChange,
  placeholder = 'Use 4+ words to describe...',
  className,
}: MagicSearchProps): React.ReactNode {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type="search"
      className={className}
      start={<MagicSearchIcon size="large" tone="primary" className={styles.startIcon} />}
      end={<SlidersIcon size="large" className={styles.endIcon} />}
    />
  );
}
