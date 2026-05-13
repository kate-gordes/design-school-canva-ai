import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Rows, BaseSelectMenu } from '@canva/easel';
import { TextInput } from '@canva/easel';
import { XIcon, CheckIcon } from '@canva/easel/icons';
import { BasicButton } from '@canva/easel/button';
import { Text } from '@canva/easel';
import styles from './BaseSelect.module.css';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectOptionGroup<T = string> {
  label?: string;
  options: SelectOption<T>[];
}

interface BaseSelectProps<T = string> {
  options: SelectOption<T>[] | SelectOptionGroup<T>[];
  value?: T;
  onChange?: (value: T, option: SelectOption<T>) => void;
  onClose?: () => void;
  searchable?:
    | boolean
    | {
        inputPlaceholder?: string;
        allowClear?: 'always' | 'never' | 'when-not-empty';
      };
  className?: string;
}

function flattenOptions<T>(options: SelectOption<T>[] | SelectOptionGroup<T>[]): SelectOption<T>[] {
  return options.flatMap(option => ('options' in option ? option.options : [option]));
}

function defaultFilterFn<T>(query: string, options: SelectOption<T>[]): SelectOption<T>[] {
  const lowercaseQuery = query.toLowerCase();
  return options.filter(option => option.label.toLowerCase().includes(lowercaseQuery));
}

export const BaseSelect = observer(function BaseSelect<T = string>({
  options,
  value,
  onChange,
  onClose,
  searchable = false,
  className,
}: BaseSelectProps<T>): React.ReactNode {
  const [query, setQuery] = useState('');

  const { inputPlaceholder = 'Search options...', allowClear = 'never' } =
    typeof searchable === 'object' ? searchable : {};

  const flatOptions = React.useMemo(() => flattenOptions(options), [options]);

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !query) {
      return flatOptions;
    }
    return defaultFilterFn(query, flatOptions);
  }, [searchable, query, flatOptions]);

  const handleOptionClick = useCallback(
    (option: SelectOption<T>) => {
      if (option.disabled) return;

      onChange?.(option.value, option);
      onClose?.();
    },
    [onChange, onClose],
  );

  const handleSearchChange = useCallback((newQuery: string) => {
    setQuery(newQuery.trimStart());
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <BaseSelectMenu
      id="base-select-menu"
      className={`${styles.baseSelectMenu} ${className || ''}`}
      options={filteredOptions}
      areEqual={() => false}
      isSelected={() => false}
      getLabel={() => ''}
      flatOptions={flatOptions}
      optionGroups={[]}
      selectedOptions={[]}
    >
      {/* Search Input Header */}
      {searchable && (
        <Box padding="1u" borderBottom="standard">
          <TextInput
            value={query}
            onChange={handleSearchChange}
            placeholder={inputPlaceholder}
            icon={{ type: 'search', align: 'start' }}
            end={
              allowClear !== 'never'
              && query && (
                <BasicButton onClick={clearSearch}>
                  <XIcon size="small" />
                </BasicButton>
              )
            }
          />
        </Box>
      )}

      {/* Options List */}
      <Box padding="0" className={styles.optionsList}>
        <Rows spacing="0">
          {filteredOptions.length === 0 && query ? (
            <Box padding="2u" display="flex" justifyContent="center">
              <Text tone="secondary">No options found</Text>
            </Box>
          ) : (
            filteredOptions.map((option, index) => {
              const isSelected = value === option.value;

              return (
                <BasicButton
                  key={`${option.value}-${index}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={option.disabled}
                  className={`${styles.option} ${isSelected ? styles.selected : ''} ${option.disabled ? styles.disabled : ''}`}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    width="full"
                    padding="2u"
                    className={styles.optionContent}
                  >
                    {option.icon && <Box>{option.icon}</Box>}
                    <Text
                      weight={isSelected ? 'bold' : 'regular'}
                      tone={option.disabled ? 'secondary' : 'primary'}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <span className={styles.checkmark}>
                        <CheckIcon size="small" />
                      </span>
                    )}
                  </Box>
                </BasicButton>
              );
            })
          )}
        </Rows>
      </Box>
    </BaseSelectMenu>
  );
});

export default BaseSelect;
