import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import {
  FolderIcon,
  ToolkitDocumentFilledIcon,
  CloudUploadIcon,
  GridIcon,
} from '@canva/easel/icons';

export interface AddNewOption {
  value: string;
  label: string;
  icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const addNewOptions: AddNewOption[] = [
  { value: 'folder', label: 'Folder', icon: FolderIcon },
  { value: 'course', label: 'Course', icon: ToolkitDocumentFilledIcon },
  { value: 'design', label: 'Design', icon: GridIcon },
  { value: 'uploadFiles', label: 'Upload files', icon: CloudUploadIcon },
  { value: 'uploadFolder', label: 'Upload folder', icon: FolderIcon },
  { value: 'importApp', label: 'Import from app', icon: GridIcon },
];

export interface AddNewDropdownProps {
  onSelect?: (value: string) => void;
  className?: string;
}

export const AddNewDropdown: React.FC<AddNewDropdownProps> = ({ onSelect, className }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onSelect?.(newValue);
    // Reset selection after action
    setTimeout(() => setSelectedValue(''), 100);
  };

  const selectOptions = addNewOptions.map(option => ({
    value: option.value,
    label: option.label,
    icon: option.icon ? <option.icon size="small" /> : undefined,
  }));

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Add new"
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
    />
  );
};

export default AddNewDropdown;
