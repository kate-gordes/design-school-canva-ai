import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import { ClockIcon, ArrowUpIcon, ArrowDownIcon, MagicIcon } from '@canva/easel/icons';

const sortOptions = [
  { value: 'most-relevant', label: 'Most relevant', icon: <MagicIcon size="small" /> },
  { value: 'newest', label: 'Newest edited', icon: <ClockIcon size="small" /> },
  { value: 'oldest', label: 'Oldest edited', icon: <ClockIcon size="small" /> },
  { value: 'a-z', label: 'Alphabetical (A-Z)', icon: <ArrowUpIcon size="small" /> },
  { value: 'z-a', label: 'Alphabetical (Z-A)', icon: <ArrowDownIcon size="small" /> },
];

interface ExampleNewDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Example dropdown using the new BaseInput + BaseSelect pattern.
 *
 * This demonstrates how to separate:
 * - BaseInput: The button trigger
 * - BaseSelect: The dropdown menu
 * - SelectCombo: The combination that handles state
 */
export default function ExampleNewDropdown({
  value = 'newest',
  onChange,
  className,
}: ExampleNewDropdownProps): React.ReactNode {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <SelectCombo
      options={sortOptions}
      value={selectedValue}
      onChange={handleChange}
      title="Sort by"
      placeholder="Select sort option"
      className={className}
      ariaLabel="Sort selection menu"
      stretch={true}
      searchable={{
        inputPlaceholder: 'Search sort options...',
        allowClear: 'when-not-empty',
      }}
    />
  );
}
