import React from 'react';
import { Button } from '@canva/easel';
import { ChevronDownIcon, MagicPhotoGradientIcon } from '@canva/easel/icons';
import styles from './SearchActionBar.module.css';

interface SearchActionBarProps {
  onSearch: () => void;
  onGenerate?: () => void;
  onGenerateMore?: () => void;
}

export default function SearchActionBar({
  onSearch,
  onGenerate = () => {},
  onGenerateMore = () => {},
}: SearchActionBarProps): React.ReactNode {
  return (
    <div className={styles.actionBar}>
      <div className={styles.generateSplit}>
        <Button
          variant="secondary"
          onClick={onGenerate}
          icon={MagicPhotoGradientIcon}
          iconPosition="start"
          className={styles.generateMain}
        >
          Generate
        </Button>
        <Button
          variant="secondary"
          onClick={onGenerateMore}
          icon={ChevronDownIcon}
          tooltipLabel="More generate options"
          className={styles.generateDropdown}
        />
      </div>
      <Button variant="primary" onClick={onSearch} stretch className={styles.searchButton}>
        Search
      </Button>
    </div>
  );
}
