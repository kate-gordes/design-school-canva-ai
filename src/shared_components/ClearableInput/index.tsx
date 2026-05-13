import React, { useState, useCallback } from 'react';
import { TextInput, SearchIcon, Popover, Box, Text, Rows, Columns, Column } from '@canva/easel';
import { ClockIcon } from '@canva/easel/icons';
import styles from './ClearableInput.module.css';

export interface SuggestionItem {
  id: string;
  text: string;
  type?: 'recent' | 'suggestion';
}

export interface ClearableInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showPopover?: boolean;
  suggestions?: SuggestionItem[];
  onSuggestionClick?: (suggestion: SuggestionItem) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export type ClearableInputRef = {
  blur: () => void;
  select: () => void;
  focus: () => void;
};

/**
 * A simple search input with search icon
 */
export const ClearableInput = React.forwardRef<ClearableInputRef, ClearableInputProps>(
  (
    {
      value = '',
      onChange,
      placeholder = 'Search designs, folders, and uploads',
      className,
      disabled = false,
      showPopover = false,
      suggestions = [],
      onSuggestionClick,
      onFocus,
      onBlur,
    },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    React.useImperativeHandle(
      ref,
      () => ({
        blur() {
          inputRef.current?.blur();
        },
        focus() {
          inputRef.current?.focus();
        },
        select() {
          inputRef.current?.select();
        },
      }),
      [],
    );

    const handleFocus = useCallback(() => {
      if (showPopover && suggestions.length > 0) {
        setIsPopoverOpen(true);
      }
      onFocus?.();
    }, [showPopover, suggestions.length, onFocus]);

    const handleBlur = useCallback(() => {
      // Delay closing to allow suggestion clicks
      setTimeout(() => {
        setIsPopoverOpen(false);
      }, 150);
      onBlur?.();
    }, [onBlur]);

    const handleSuggestionClick = useCallback(
      (suggestion: SuggestionItem) => {
        onChange?.(suggestion.text);
        onSuggestionClick?.(suggestion);
        setIsPopoverOpen(false);
        inputRef.current?.blur();
      },
      [onChange, onSuggestionClick],
    );

    const handlePopoverClose = useCallback(() => {
      setIsPopoverOpen(false);
    }, []);

    const renderSuggestions = () => {
      if (!showPopover || suggestions.length === 0) {
        return null;
      }

      return (
        <Box padding="2u" className={styles.popoverContent}>
          <Rows spacing="1u">
            {suggestions.map(suggestion => (
              // Raw <div>: paints a hover background-color that Easel Box's
              // reset_f88b8e would wipe; keep as a raw div to preserve hover.
              <div
                key={suggestion.id}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <Box padding="2u">
                  <Columns spacing="2u" alignY="center">
                    <Column width="content">
                      {suggestion.type === 'recent' && (
                        <ClockIcon size="small" className={styles.suggestionIcon} />
                      )}
                    </Column>
                    <Column>
                      <Text>{suggestion.text}</Text>
                    </Column>
                  </Columns>
                </Box>
              </div>
            ))}
          </Rows>
        </Box>
      );
    };

    // Raw <div>: paints a visible colorSurface background + 1px border that
    // Easel Box would reset away via reset_f88b8e. Keep raw to preserve the
    // input-wrapper chrome.
    const inputElement = (
      <div className={`${styles.container} ${className || ''}`}>
        <TextInput
          ref={inputRef}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          start={<SearchIcon size="medium" className={styles.searchIcon} />}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    );

    if (!showPopover) {
      return inputElement;
    }

    return (
      <Popover
        open={isPopoverOpen && suggestions.length > 0}
        onRequestClose={handlePopoverClose}
        reference={inputElement}
        placement="bottom-start"
        width="reference"
        offset="1u"
      >
        {renderSuggestions()}
      </Popover>
    );
  },
);
