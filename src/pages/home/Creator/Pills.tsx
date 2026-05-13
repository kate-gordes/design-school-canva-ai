import React, { useState } from 'react';
import { BaseSelect } from '@canva/easel/form/select';
import type { BaseSelectTriggerProps } from '@canva/easel/form/select';
import { Pill } from '@canva/easel/pill';
import { ChevronDownIcon } from '@canva/easel/icons';

export interface PillOption {
  value: string;
  label: string;
  Icon: React.ComponentType<{ size: string }>;
}

interface PillsProps {
  pills: PillOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

// Custom trigger component that renders as a Pill
function PillTrigger<T>(props: BaseSelectTriggerProps<T>) {
  return (
    <Pill
      role="combobox"
      size="medium"
      active={props.active}
      selected={props.value != null}
      text={props.selectedOptions[0]?.label ?? 'Category'}
      onClick={props.onRequestToggle}
      end={<ChevronDownIcon size="medium" />}
      ariaLabel="Category"
      ariaHasPopup="listbox"
      ariaControls={props.ariaControls}
      ariaActiveDescendant={props.ariaActiveDescendant}
    />
  );
}

const Pills: React.FC<PillsProps> = ({ pills, defaultValue = pills[0]?.value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  // Convert pills to BaseSelect options format
  const options = pills.map(pill => ({
    value: pill.value,
    label: pill.label,
    icon: pill.Icon,
  }));

  return (
    <BaseSelect
      Trigger={PillTrigger}
      searchable={true}
      options={options}
      value={selectedValue}
      onChange={handleChange}
    />
  );
};

export default Pills;
