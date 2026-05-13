import React from 'react';
import { Pill } from '@canva/easel';
import { ChevronDownIcon } from '@canva/easel/icons';

interface PillTriggerProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
  ariaControls?: string;
  id?: string;
  icon?: React.ReactNode;
  selected?: boolean;
  showChevron?: boolean;
}

/**
 * PillTrigger component using Easel's Pill as a dropdown trigger.
 *
 * This component uses:
 * - role="combobox" for proper accessibility
 * - ChevronDownIcon in the end slot
 * - Selected state for visual feedback
 */
export default function PillTrigger({
  value,
  placeholder = 'Select option',
  disabled = false,
  onClick,
  className,
  ariaLabel,
  ariaExpanded = false,
  ariaHasPopup = true,
  ariaControls,
  id,
  icon,
  selected = false,
  showChevron = true,
}: PillTriggerProps): React.ReactNode {
  const displayText = value || placeholder;

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  return (
    <Pill
      size="medium"
      text={displayText}
      role="combobox"
      onClick={handleClick}
      //  onKeyDown={handleKeyDown}
      disabled={disabled}
      selected={selected}
      className={className}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-controls={ariaControls}
      id={id}
      start={icon}
      end={showChevron ? <ChevronDownIcon size="small" /> : undefined}
    />
  );
}
