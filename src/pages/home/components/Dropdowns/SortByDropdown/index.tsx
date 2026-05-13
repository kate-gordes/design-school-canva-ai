import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import { ClockIcon, ArrowUpIcon, ArrowDownIcon, MagicIcon } from '@canva/easel/icons';

export interface SortOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const typeOptions: SortOption[] = [
  { value: 'Most relevant', label: 'Most relevant', Icon: MagicIcon },
  { value: 'Newest edited', label: 'Newest edited', Icon: ClockIcon },
  { value: 'Oldest edited', label: 'Oldest edited', Icon: ClockIcon },
  { value: 'Alphabetical (A-Z)', label: 'Alphabetical (A-Z)', Icon: ArrowUpIcon },
  { value: 'Alphabetical (Z-A)', label: 'Alphabetical (Z-A)', Icon: ArrowDownIcon },
];

export interface SortByDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const SortByDropdown: React.FC<SortByDropdownProps> = ({
  value = 'Newest edited',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const selectOptions = typeOptions.map(option => ({
    value: option.value,
    label: option.label,
    ...(option.Icon && { icon: <option.Icon size="small" /> }),
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Sort by"
      value={selectedValue}
      options={selectOptions}
      onChange={handleChange}
      className={className}
    />
  );
};

export default SortByDropdown;
