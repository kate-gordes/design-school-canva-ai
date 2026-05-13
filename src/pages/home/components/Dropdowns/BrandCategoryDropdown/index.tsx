import React, { useState } from 'react';
import {
  GridIcon,
  ToolkitDocumentFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSocialFilledIcon,
  ToolkitPrintFilledIcon,
  ToolkitWebsiteFilledIcon,
  PhotosProIcon,
  ToolkitVideoFilledIcon,
} from '@canva/easel/icons';
import { SelectCombo } from '@/shared_components/Select';

export interface BrandCategoryOption {
  value: string;
  label: string;
  Icon?: React.ComponentType<{ size: 'small' | 'medium' | 'large' }>;
}

const brandCategoryOptions: BrandCategoryOption[] = [
  { value: 'all', label: 'Category', Icon: GridIcon },
  { value: 'brand-guidelines', label: 'Brand Guidelines', Icon: ToolkitDocumentFilledIcon },
  { value: 'logos', label: 'Logos & Identity', Icon: PhotosProIcon },
  { value: 'presentations', label: 'Presentations', Icon: ToolkitPresentationFilledIcon },
  { value: 'social-media', label: 'Social Media', Icon: ToolkitSocialFilledIcon },
  { value: 'marketing', label: 'Marketing Materials', Icon: ToolkitPrintFilledIcon },
  { value: 'websites', label: 'Websites', Icon: ToolkitWebsiteFilledIcon },
  { value: 'videos', label: 'Video Assets', Icon: ToolkitVideoFilledIcon },
];

export interface BrandCategoryDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const BrandCategoryDropdown: React.FC<BrandCategoryDropdownProps> = ({
  value = 'all',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const selectOptions = brandCategoryOptions.map(option => ({
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

export default BrandCategoryDropdown;
