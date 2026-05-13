import React, { useState } from 'react';
import { Flyout } from '@canva/easel/surface/flyout';
import BaseInput from '@/shared_components/Select/triggers/BaseInput';
import PillTrigger from '@/shared_components/Select/triggers/PillTrigger';
import BaseSelect, {
  type SelectOption,
  type SelectOptionGroup,
} from '@/shared_components/Select/menu/BaseSelect';

interface SelectComboProps<T = string> {
  options: SelectOption<T>[] | SelectOptionGroup<T>[];
  value?: T;
  onChange?: (value: T, option: SelectOption<T>) => void;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  stretch?: boolean;
  triggerType?: 'input' | 'pill';
  searchable?:
    | boolean
    | {
        inputPlaceholder?: string;
        allowClear?: 'always' | 'never' | 'when-not-empty';
      };
}

/**
 * Combined Select component that uses BaseInput as trigger and BaseSelect as menu.
 *
 * This separates the concerns:
 * - BaseInput: The button/trigger that shows current selection
 * - BaseSelect: The dropdown menu with options
 * - Flyout: Manages the open/close state and positioning
 */
export default function SelectCombo<T = string>({
  options,
  value,
  onChange,
  placeholder,
  title,
  disabled = false,
  className,
  ariaLabel,
  icon,
  stretch = false,
  triggerType = 'input',
  searchable = false,
}: SelectComboProps<T>): React.ReactNode {
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected option to display its label
  const flatOptions = React.useMemo(() => {
    return options.flatMap(option => ('options' in option ? option.options : [option]));
  }, [options]);

  const selectedOption = flatOptions.find(option => option.value === value);
  const displayValue = selectedOption?.label || '';

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (newValue: T, option: SelectOption<T>) => {
    onChange?.(newValue, option);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  const renderTrigger = ({ ref, ...triggerProps }: any) => (
    // Raw <div>: Easel Flyout injects a plain DOM ref into its trigger render
    // prop. A Box here would refuse the HTMLDivElement ref contract.
    <div ref={ref}>
      {triggerType === 'pill' ? (
        <PillTrigger
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          className={className}
          ariaLabel={ariaLabel}
          ariaExpanded={isOpen}
          ariaHasPopup={true}
          icon={icon}
          selected={isOpen}
          {...triggerProps}
        />
      ) : (
        <BaseInput
          value={displayValue}
          placeholder={placeholder}
          title={title}
          disabled={disabled}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          className={className}
          ariaLabel={ariaLabel}
          ariaExpanded={isOpen}
          ariaHasPopup={true}
          icon={icon}
          stretch={stretch}
          {...triggerProps}
        />
      )}
    </div>
  );

  return (
    <Flyout open={isOpen} onRequestClose={handleClose} trigger={renderTrigger} width="40u">
      <BaseSelect
        options={options}
        value={value}
        onChange={handleChange}
        onClose={handleClose}
        searchable={searchable}
      />
    </Flyout>
  );
}
