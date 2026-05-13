import React from 'react';
import { Pill } from '@canva/easel';
import { FolderIcon } from '@canva/easel/icons';

export interface SearchPillProps {
  text: string;
  onRemoveClick?: () => void;
  icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

export const SearchPill: React.FC<SearchPillProps> = ({
  text,
  onRemoveClick,
  icon: IconComponent = FolderIcon,
}) => {
  return <Pill text={text} start={<IconComponent size="small" />} onRemoveClick={onRemoveClick} />;
};

export default SearchPill;
