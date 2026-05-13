import React, { useState } from 'react';
import { SelectCombo } from '@/shared_components/Select';
import { UserIcon, UsersIcon } from '@canva/easel/icons';
import styles from './CreatorDropdown.module.css';

export interface CreatorOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

// Simple colored circular avatar placeholder (initials)
function AvatarCircle({ initials, color }: { initials: string; color: string }): React.ReactNode {
  return (
    /* Plain <div>: Easel Box resets background via reset_f88b8e, wiping the per-user
       color injected via the --avatar-bg CSS variable. */
    <div className={styles.avatarCircle} style={{ '--avatar-bg': color } as React.CSSProperties}>
      {initials}
    </div>
  );
}

const creatorOptions: CreatorOption[] = [
  { value: 'all', label: 'Everyone', icon: <UserIcon size="small" /> },
  { value: 'others', label: 'Created by others', icon: <UsersIcon size="small" /> },
  {
    value: 'jude',
    label: 'Jude Osborn (You)',
    icon: <AvatarCircle initials="JO" color="#7D2AE8" />,
  },
  {
    value: 'raghu',
    label: 'Raghu Kasturi',
    icon: <AvatarCircle initials="RK" color="#00C4CC" />,
  },
];

export interface CreatorDropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export const CreatorDropdown: React.FC<CreatorDropdownProps> = ({
  value = 'all',
  onChange,
  className,
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  return (
    <SelectCombo
      triggerType="pill"
      placeholder="Creator"
      options={creatorOptions}
      value={selectedValue}
      onChange={handleChange}
      className={className}
      searchable={{ inputPlaceholder: 'Search people' }}
    />
  );
};

export default CreatorDropdown;
