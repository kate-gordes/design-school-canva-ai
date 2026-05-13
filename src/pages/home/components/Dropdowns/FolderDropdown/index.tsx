import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import { FolderIcon, GridIcon } from '@canva/easel/icons';

export interface FolderOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const folderOptions: FolderOption[] = [
  { value: 'all', label: 'Folder', Icon: GridIcon },
  { value: 'brand-guidelines', label: 'Brand Guidelines', Icon: FolderIcon },
  { value: 'logo-assets', label: 'Logo Assets', Icon: FolderIcon },
  { value: 'marketing-materials', label: 'Marketing Materials', Icon: FolderIcon },
  { value: 'social-media', label: 'Social Media', Icon: FolderIcon },
  { value: 'templates', label: 'Templates', Icon: FolderIcon },
  { value: 'archived', label: 'Archived', Icon: FolderIcon },
];

export interface FolderDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const FolderDropdown: React.FC<FolderDropdownProps> = ({
  value = 'all',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const selectOptions = folderOptions.map(option => ({
    value: option.value,
    label: option.label,
    ...(option.Icon && { icon: <option.Icon size="small" /> }),
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Folder"
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
      searchable={{
        inputPlaceholder: 'Search folders...',
      }}
    />
  );
};

export default FolderDropdown;
