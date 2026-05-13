import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import {
  GridIcon,
  CopyIcon,
  DocsIcon,
  SheetIcon,
  WhiteboardIcon,
  WebsiteIcon,
  FolderIcon,
  ImageIcon,
  VideoLandscapeIcon,
} from '@canva/easel/icons';

export interface TypeOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const typeOptions: TypeOption[] = [
  { value: 'all', label: 'Type', Icon: GridIcon },
  { value: 'presentation', label: 'Presentation', Icon: CopyIcon },
  { value: 'doc', label: 'Doc', Icon: DocsIcon },
  { value: 'sheet', label: 'Sheet', Icon: SheetIcon },
  { value: 'whiteboard', label: 'Whiteboard', Icon: WhiteboardIcon },
  { value: 'website', label: 'Website', Icon: WebsiteIcon },
  { value: 'folder', label: 'Folder', Icon: FolderIcon },
  { value: 'image', label: 'Image', Icon: ImageIcon },
  { value: 'video', label: 'Video', Icon: VideoLandscapeIcon },
];

export interface TypeDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const TypeDropdown: React.FC<TypeDropdownProps> = ({
  value = 'all',
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
      placeholder="Type"
      options={selectOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
      searchable={{
        inputPlaceholder: 'Search types...',
      }}
    />
  );
};

export default TypeDropdown;
