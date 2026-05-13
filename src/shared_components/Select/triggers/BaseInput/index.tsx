import React from 'react';
import { Box, Text } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { ChevronDownIcon } from '@canva/easel/icons';
import styles from './BaseInput.module.css';

interface BaseInputProps {
  value?: string;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
  ariaControls?: string;
  id?: string;
  icon?: React.ReactNode;
  stretch?: boolean;
}

export default function BaseInput({
  value,
  placeholder = 'Select an option',
  title,
  disabled = false,
  onClick,
  onKeyDown,
  className,
  ariaLabel,
  ariaExpanded = false,
  ariaHasPopup = true,
  ariaControls,
  id,
  icon,
  stretch = false,
}: BaseInputProps): React.ReactNode {
  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  const handleClick = () => {
    if (!disabled) {
      onClick?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled) {
      onKeyDown?.(e);
    }
  };

  return (
    <BasicButton
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`${styles.baseInput} ${stretch ? styles.stretch : ''} ${className || ''}`}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      aria-controls={ariaControls}
      id={id}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        width="full"
        padding="2u"
      >
        <Box display="flex" alignItems="center" gap="1u">
          {icon && <Box>{icon}</Box>}
          <Box display="flex" flexDirection="column" alignItems="flexStart">
            {title && (
              <Text size="small" tone="secondary" weight="bold">
                {title}
              </Text>
            )}
            <Text
              size="medium"
              tone={isPlaceholder ? 'secondary' : 'primary'}
              weight={isPlaceholder ? 'normal' : 'bold'}
            >
              {displayValue}
            </Text>
          </Box>
        </Box>
        <ChevronDownIcon
          size="small"
          className={`${styles.chevron} ${ariaExpanded ? styles.expanded : ''}`}
        />
      </Box>
    </BasicButton>
  );
}
