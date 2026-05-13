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

interface ExamplePillDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * Example dropdown using Easel Pill as the trigger.
 *
 * This demonstrates the new pattern:
 * - PillTrigger: Uses Easel Pill component with role="combobox"
 * - BaseSelect: The dropdown menu
 * - SelectCombo: Manages the state and combines both
 */
export default function ExamplePillDropdown({
  value = 'newest',
  onChange,
  className,
}: ExamplePillDropdownProps): React.ReactNode {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <SelectCombo
      triggerType="pill" // 🔑 KEY: Use pill trigger
      options={sortOptions}
      value={selectedValue}
      onChange={handleChange}
      placeholder="Sort by"
      className={className}
      ariaLabel="Sort selection with pill trigger"
      searchable={{
        inputPlaceholder: 'Search sort options...',
        allowClear: 'when-not-empty',
      }}
    />
  );
}
