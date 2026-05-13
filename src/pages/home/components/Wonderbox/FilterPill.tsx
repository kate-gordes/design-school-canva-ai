import type { ReactNode } from 'react';
import React, { useState } from 'react';
import { Pill } from '@canva/easel';
import { FlyoutMenu, FlyoutMenuItem } from '@canva/easel';
import { useWonderbox } from './WonderboxContext';
import styles from './Wonderbox.module.css';

interface FilterPillProps {
  id: string;
  label: string;
  start?: ReactNode;
  end?: ReactNode;
}

export default function FilterPill({ id, label, start, end }: FilterPillProps): React.ReactNode {
  const { state, setFilterOption } = useWonderbox();
  const [isOpen, setIsOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  // Get filter options for this specific filter
  const filterOptions = state.tabConfigs[state.selectedTab].filterOptions?.[id] || [];
  const selectedValue = state.selectedFilterOptions[state.selectedTab]?.[id];

  // Determine display label based on selected value
  const getDisplayLabel = () => {
    if (!selectedValue) {
      return label; // No selection, show original label
    }

    const selectedOption = filterOptions.find(option => option.value === selectedValue);
    if (!selectedOption) {
      return label; // Option not found, show original label
    }

    // Check if it's a default "any/all" option - if so, show original label
    if (selectedOption.value === 'any' || selectedOption.value === 'all') {
      return label;
    }

    // Show the selected option's label
    return selectedOption.label;
  };

  const displayLabel = getDisplayLabel();
  const hasNonDefaultSelection = Boolean(
    selectedValue && selectedValue !== 'any' && selectedValue !== 'all',
  );

  // If no filter options, render as regular pill with toggle selection
  if (filterOptions.length === 0) {
    return (
      <div className={styles.filterPillWhite}>
        <Pill
          size="small"
          text={displayLabel}
          start={start}
          end={end}
          selected={isSelected}
          onClick={() => setIsSelected(!isSelected)}
          onRemoveClick={isSelected ? () => setIsSelected(false) : undefined}
        />
      </div>
    );
  }

  return (
    <div className={styles.filterPillWhite}>
      <FlyoutMenu
        trigger={({ onClick, ...triggerProps }) => (
          <Pill
            size="small"
            text={displayLabel}
            start={start}
            end={end}
            selected={hasNonDefaultSelection}
            onClick={onClick}
            {...triggerProps}
          />
        )}
        flyoutPlacement="bottom-start"
        open={isOpen}
        onRequestToggle={() => setIsOpen(!isOpen)}
      >
        {filterOptions.map(option => (
          <FlyoutMenuItem
            key={option.value}
            onClick={() => {
              setFilterOption(id, option.value);
              setIsOpen(false);
            }}
            start={option.icon}
            selected={selectedValue === option.value || (!selectedValue && option.selected)}
          >
            {option.label}
          </FlyoutMenuItem>
        ))}
      </FlyoutMenu>
    </div>
  );
}
