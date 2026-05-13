import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import { UserIcon, UsersIcon } from '@canva/easel/icons';

export interface OwnerOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const ownerOptions: OwnerOption[] = [
  { value: 'all', label: 'Owner', Icon: UsersIcon },
  { value: 'me', label: 'Only me', Icon: UserIcon },
  { value: 'shared', label: 'Shared with me', Icon: UsersIcon },
];

export interface OwnerDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const OwnerDropdown: React.FC<OwnerDropdownProps> = ({
  value = 'all',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const selectOptions = ownerOptions.map(option => ({
    value: option.value,
    label: option.label,
    ...(option.Icon && { icon: <option.Icon size="small" /> }),
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Owner"
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
    />
  );
};

export default OwnerDropdown;
