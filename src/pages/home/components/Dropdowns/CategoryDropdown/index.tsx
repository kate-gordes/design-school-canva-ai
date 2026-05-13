import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import {
  GridIcon,
  CopyIcon,
  DocsIcon,
  SheetIcon,
  WhiteboardIcon,
  EnvelopeIcon,
  ChartIcon,
} from '@canva/easel/icons';

export interface CategoryOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const categoryOptions: CategoryOption[] = [
  { value: 'all', label: 'Category', Icon: GridIcon },
  { value: 'email', label: 'Email', Icon: EnvelopeIcon },
  { value: 'doc', label: 'Doc', Icon: DocsIcon },
  { value: 'whiteboard', label: 'Whiteboard', Icon: WhiteboardIcon },
  { value: 'presentation', label: 'Presentation', Icon: CopyIcon },
  { value: 'graph', label: 'Graph', Icon: ChartIcon },
];

export interface CategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value = 'all',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const selectOptions = categoryOptions.map(option => ({
    value: option.value,
    label: option.label,
    ...(option.Icon && { icon: <option.Icon size="small" /> }),
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Category"
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
      searchable={{
        inputPlaceholder: 'Search categories...',
      }}
    />
  );
};

export default CategoryDropdown;
