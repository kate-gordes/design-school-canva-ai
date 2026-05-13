import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PlusIcon, MicrophoneIcon, XIcon } from '@canva/easel/icons';
import styles from './ElementsSearchInput.module.css';

interface ElementsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** 'neutral' uses grey border for search results layout */
  variant?: 'neutral';
  /** When set, submit button is disabled until value differs from this (prevents re-submitting same search) */
  lastSearchedQuery?: string;
  /** When true, input auto-focuses on mount (causes the input to start in the expanded state) */
  autoFocus?: boolean;
}

export default function ElementsSearchInput({
  value,
  onChange,
  onSearch = () => {},
  onKeyDown,
  placeholder = 'Search elements',
  variant,
  lastSearchedQuery,
  autoFocus = false,
}: ElementsSearchInputProps): React.ReactNode {
  const [hasEditedSinceLastSearch, setHasEditedSinceLastSearch] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [collapsedHeight, setCollapsedHeight] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCollapsedRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (lastSearchedQuery != null) {
      setHasEditedSinceLastSearch(false);
    }
  }, [lastSearchedQuery]);

  const hasValue = value.trim().length > 0;
  const hasActiveSearch = lastSearchedQuery != null && lastSearchedQuery.trim().length > 0;
  const isCollapsed = !hasBeenFocused && !hasValue && !hasActiveSearch;

  // Measure the natural collapsed height once so we can use it as the starting
  // max-height for the expand animation (auto → fixed doesn't interpolate).
  useLayoutEffect(() => {
    if (isCollapsed && containerRef.current && collapsedHeight == null) {
      setCollapsedHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, [isCollapsed, collapsedHeight]);

  useEffect(() => {
    const prev = prevCollapsedRef.current;
    prevCollapsedRef.current = isCollapsed;
    // When transitioning from collapsed -> expanded, the old input element is
    // unmounted. Re-focus the freshly-mounted expanded input so typing is not
    // interrupted.
    if (prev === true && !isCollapsed) {
      inputRef.current?.focus();
    }
  }, [isCollapsed]);
  const queryUnchanged = lastSearchedQuery != null && value.trim() === lastSearchedQuery.trim();
  const canSubmit = hasValue && (!queryUnchanged || hasEditedSinceLastSearch);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(() => {
    if (canSubmit) {
      onSearch();
    }
  }, [canSubmit, onSearch]);

  const sharedInputProps = {
    ref: inputRef,
    type: 'text' as const,
    value,
    placeholder,
    autoFocus,
    onFocus: () => setHasBeenFocused(true),
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasEditedSinceLastSearch(true);
      onChange(e.target.value);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        if (onKeyDown) {
          onKeyDown(e);
        } else if (canSubmit) {
          handleSubmit();
        }
        return;
      }
      onKeyDown?.(e);
    },
  };

  const containerStateClass = isCollapsed
    ? styles.containerCollapsed
    : variant === 'neutral'
      ? styles.containerNeutral
      : styles.containerExpanded;

  const containerInlineStyle: React.CSSProperties | undefined =
    isCollapsed && collapsedHeight != null ? { maxHeight: `${collapsedHeight}px` } : undefined;

  return (
    // Plain div: container ref + dynamic maxHeight for collapse/expand animation;
    // Easel Box would wipe the measured inline maxHeight.
    <div
      ref={containerRef}
      className={`${styles.container} ${containerStateClass}`}
      onClick={isCollapsed ? focusInput : undefined}
      style={containerInlineStyle}
    >
      {isCollapsed ? (
        <div className={styles.collapsedRow}>
          <button
            type="button"
            className={styles.actionIcon}
            onClick={e => e.stopPropagation()}
            aria-label="Insert image for reference"
          >
            <PlusIcon size="medium" />
          </button>
          <input {...sharedInputProps} className={styles.input} />
          <button
            type="button"
            className={styles.actionIcon}
            onClick={e => e.stopPropagation()}
            aria-label="Voice input"
          >
            <MicrophoneIcon size="medium" />
          </button>
        </div>
      ) : (
        <div className={styles.inputSection}>
          <div className={styles.inputRow}>
            <input {...sharedInputProps} className={styles.input} />
            {hasValue && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={handleClear}
                aria-label="Clear search"
              >
                <XIcon size="small" />
              </button>
            )}
          </div>
          <div className={styles.actionRow}>
            <button
              type="button"
              className={styles.actionIcon}
              onClick={() => {}}
              aria-label="Insert image for reference"
            >
              <PlusIcon size="medium" />
            </button>
            <button
              type="button"
              className={`${styles.actionIcon} ${styles.actionIconEnd}`}
              onClick={() => {}}
              aria-label="Voice input"
            >
              <MicrophoneIcon size="medium" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
