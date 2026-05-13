import React, { useState, useEffect } from 'react';
import { SelectCombo } from '@/shared_components/Select';

export type DateSortType =
  | 'any'
  | 'today'
  | 'yesterday'
  | 'last30'
  | 'last90'
  | 'lastyear'
  | 'modified-ascending'
  | 'modified-descending';

export interface DateOption {
  value: DateSortType;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const dateOptions: DateOption[] = [
  { value: 'any', label: 'Date modified' },
  { value: 'modified-descending', label: 'Recently modified' },
  { value: 'modified-ascending', label: 'Oldest first' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last30', label: 'Last 30 days' },
  { value: 'last90', label: 'Last 90 days' },
  { value: 'lastyear', label: 'Last year' },
];

// Storage key for persisting date sort preference
const DATE_SORT_STORAGE_KEY = 'date-modified-sort-type';

// Get cached sort type from localStorage
const getCachedDateSort = (): DateSortType => {
  try {
    const cached = localStorage.getItem(DATE_SORT_STORAGE_KEY);
    const foundOption = dateOptions.find(option => option.value === cached);
    return foundOption ? foundOption.value : 'any';
  } catch {
    return 'any';
  }
};

// Set cached sort type to localStorage
const setCachedDateSort = (sortType: DateSortType): void => {
  try {
    localStorage.setItem(DATE_SORT_STORAGE_KEY, sortType);
  } catch {
    // Silently fail if localStorage is not available
  }
};

export interface DateModifiedDropdownProps {
  value?: DateSortType;
  onChange?: (value: DateSortType) => void;
  onSortChange?: (sortType: DateSortType) => void;
  className?: string;
}

export const DateModifiedDropdown: React.FC<DateModifiedDropdownProps> = ({
  value: controlledValue,
  onChange,
  onSortChange,
  className,
}) => {
  // Use controlled value or internal state with localStorage
  const [internalValue, setInternalValue] = useState<DateSortType>(() => getCachedDateSort());
  const currentValue = controlledValue ?? internalValue;

  // Load from localStorage on mount
  useEffect(() => {
    if (!controlledValue) {
      const cached = getCachedDateSort();
      setInternalValue(cached);
    }
  }, [controlledValue]);

  const handleChange = (newValue: DateSortType) => {
    // Update internal state if not controlled
    if (!controlledValue) {
      setInternalValue(newValue);
      setCachedDateSort(newValue);
    }

    // Call callbacks
    onChange?.(newValue);
    onSortChange?.(newValue);

    // Log for debugging
    console.log('Date sort changed to:', newValue);
  };

  // Transform options for BaseSelect component
  const selectOptions = dateOptions.map(option => ({
    value: option.value,
    label: option.label,
    ...(option.Icon && { Icon: option.Icon as any }),
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Date modified"
      options={selectOptions}
      value={currentValue}
      onChange={handleChange}
      className={className}
    />
  );
};

export default DateModifiedDropdown;
