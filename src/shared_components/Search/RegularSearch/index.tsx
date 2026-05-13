import React, { useState, useCallback, useRef, useEffect } from 'react';
import { TextInput, SearchIcon, Box, Rows } from '@canva/easel';
import { SearchPill } from '@/shared_components/Search/SearchPill';
import { SearchResultsList } from '@/shared_components/Search/SearchResultsList';
import { SearchKeyboardHints } from '@/shared_components/Search/SearchKeyboardHints';
import styles from './RegularSearch.module.css';

export interface SuggestionItem {
  id: string;
  text: string;
  type?: 'recent' | 'suggestion' | 'design' | 'folder' | 'template';
  label?: string; // For templates: "Brand Template", folders: "Folder", etc.
  href?: string;
  thumbnail?: string;
}

interface RegularSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  end?: React.ReactNode;

  showPopover?: boolean;
  suggestions?: SuggestionItem[];
  onSuggestionClick?: (suggestion: SuggestionItem) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function RegularSearch({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  end,

  showPopover = false,
  suggestions = [],
  onSuggestionClick,
  onFocus,
  onBlur,
}: RegularSearchProps): React.ReactNode {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Handle clicks outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPopoverOpen]);

  const handleFocus = useCallback(() => {
    if (showPopover && suggestions.length > 0) {
      setIsPopoverOpen(true);
    }
    onFocus?.();
  }, [showPopover, suggestions.length, onFocus]);

  const handleBlur = useCallback(() => {
    // Delay closing to allow suggestion clicks
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      setIsPopoverOpen(false);
      blurTimeoutRef.current = null;
    }, 150);
    onBlur?.();
  }, [onBlur]);

  const handleSuggestionClick = useCallback(
    (suggestion: SuggestionItem) => {
      onChange(suggestion.text);
      onSuggestionClick?.(suggestion);
      setIsPopoverOpen(false);
      inputRef.current?.blur();
    },
    [onChange, onSuggestionClick],
  );

  const handlePillClose = useCallback(() => {
    // Handle removing the "All your content" filter
    console.log('Remove filter');
  }, []);

  if (!showPopover) {
    return (
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="search"
        className={className}
        start={<SearchIcon size="large" tone="primary" className={styles.startIcon} />}
        end={end}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    );
  }

  const hasContent = isPopoverOpen && suggestions.length > 0;

  return (
    // Raw <div>: needs a direct HTMLDivElement ref for click-outside detection.
    <div className={styles.searchInputMenu} ref={containerRef}>
      <TextInput
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="search"
        className={`${className} ${hasContent ? styles.inputContainerWithContent : ''}`}
        start={<SearchIcon size="large" tone="primary" className={styles.startIcon} />}
        onFocus={handleFocus}
        onBlur={handleBlur}
        borderless={false}
      />
      {hasContent && (
        // Raw <div>: the popover panel relies on a white background + box-shadow
        // + border-radius painted in CSS. Easel Box resets background via
        // reset_f88b8e, so a Box here would render transparent.
        <div className={`${styles.container} ${styles.attached}`}>
          <div className={styles.content}>
            <Box padding="2u">
              <Rows spacing="2u">
                {/* Pill section */}
                <Box>
                  <SearchPill text="All your content" onRemoveClick={handlePillClose} />
                </Box>

                {/* Results list */}
                <SearchResultsList
                  suggestions={suggestions}
                  onSuggestionClick={handleSuggestionClick}
                />

                {/* Keyboard shortcuts */}
                <SearchKeyboardHints className={styles.keyboardHints} />
              </Rows>
            </Box>
          </div>
        </div>
      )}
    </div>
  );
}
