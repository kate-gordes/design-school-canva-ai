import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Suggestion, SuggestionContext } from './suggestions';
import { getSuggestions, predictIntent } from './suggestions';
import styles from './AISearchInput.module.css';

interface AISearchInputProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onGenerate?: (value: string) => void;
  onClear?: () => void;
  suggestionContext?: SuggestionContext;
}

const AISearchInput: React.FC<AISearchInputProps> = ({
  placeholder = 'Search or describe what you want...',
  value: externalValue,
  onSearch,
  onGenerate,
  onClear,
  suggestionContext = 'elements',
}) => {
  const [value, setValue] = useState(externalValue || '');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sync with external value
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Auto-resize textarea
      const textarea = e.target;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 80)}px`;

      if (newValue.trim().length >= 2) {
        const newSuggestions = getSuggestions(newValue, 5, suggestionContext);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [suggestionContext],
  );

  const handleSearch = useCallback(() => {
    if (value.trim() && onSearch) {
      onSearch(value.trim());
      setShowSuggestions(false);
    }
  }, [value, onSearch]);

  const handleGenerate = useCallback(() => {
    if (value.trim() && onGenerate) {
      onGenerate(value.trim());
      setShowSuggestions(false);
    }
  }, [value, onGenerate]);

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      setValue(suggestion.text);
      setShowSuggestions(false);

      if (suggestion.type === 'search' && onSearch) {
        onSearch(suggestion.text);
      } else if (suggestion.type === 'generate' && onGenerate) {
        onGenerate(suggestion.text);
      }
    },
    [onSearch, onGenerate],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (showSuggestions && selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (value.trim()) {
          // Enter key always triggers search; use the Generate button for generation
          if (onSearch) {
            onSearch(value.trim());
          }
          setShowSuggestions(false);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      } else if (e.key === 'ArrowDown' && showSuggestions) {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp' && showSuggestions) {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
      }
    },
    [
      showSuggestions,
      selectedIndex,
      suggestions,
      value,
      onSearch,
      onGenerate,
      handleSuggestionClick,
    ],
  );

  const handleClear = useCallback(() => {
    setValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onClear?.();
  }, [onClear]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const hasContent = value.trim().length > 0;

  // Raw HTML throughout this component by design:
  // - <textarea>: Easel TextInput does not expose a multiline textarea variant
  //   that allows auto-resizing via scrollHeight + direct ref manipulation.
  // - Custom <button>s (search/generate/voice/clear): these use bespoke gradient
  //   borders, unique sizes, and pill-specific layouts that Easel Button cannot
  //   model without overrides that defeat its token contract.
  // - Outer/inner <div>s: each wrapper paints a visible background (white input
  //   chrome, focus glow, suggestion panel, etc.) that Easel Box resets away.
  return (
    <div className={styles.container}>
      {/* Search Input Box */}
      <div className={`${styles.inputWrapper} ${isFocused ? styles.focused : ''}`}>
        <div className={styles.inputHeader}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              setIsFocused(true);
              if (value.trim().length >= 2 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            rows={1}
          />
          {hasContent && (
            <button className={styles.clearBtn} onClick={handleClear} type="button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  opacity="0.5"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.9961 19.9954C16.4144 19.9954 19.9961 16.4136 19.9961 11.9954C19.9961 7.57708 16.4144 3.99536 11.9961 3.99536C7.57782 3.99536 3.99609 7.57708 3.99609 11.9954C3.99609 16.4136 7.57782 19.9954 11.9961 19.9954ZM13.7628 9.16856C14.0556 8.87583 14.5302 8.87583 14.8229 9.16856C15.1156 9.46128 15.1156 9.93589 14.8229 10.2286L13.0561 11.9954L14.8229 13.7621C15.1156 14.0549 15.1156 14.5295 14.8229 14.8222C14.5302 15.1149 14.0556 15.1149 13.7628 14.8222L11.9961 13.0554L10.2293 14.8222C9.93657 15.1149 9.46197 15.1149 9.16924 14.8222C8.87652 14.5295 8.87652 14.0549 9.16924 13.7621L10.936 11.9954L9.16925 10.2286C8.87653 9.93589 8.87653 9.46129 9.16925 9.16856C9.46198 8.87584 9.93658 8.87584 10.2293 9.16856L11.9961 10.9353L13.7628 9.16856Z"
                  fill="#0E1318"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Action buttons row */}
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} aria-label="Attach media">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H12.75V19C12.75 19.4142 12.4142 19.75 12 19.75C11.5858 19.75 11.25 19.4142 11.25 19V12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H11.25V5C11.25 4.58579 11.5858 4.25 12 4.25Z"
                fill="#0E1318"
              />
            </svg>
          </button>
          <button type="button" className={styles.actionBtn} aria-label="Add emoji">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#0E1318" strokeWidth="1.5" />
              <circle cx="9" cy="10" r="1.25" fill="#0E1318" />
              <circle cx="15" cy="10" r="1.25" fill="#0E1318" />
              <path
                d="M8.5 14.5C9.5 16 10.5 16.5 12 16.5C13.5 16.5 14.5 16 15.5 14.5"
                stroke="#0E1318"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.voiceBtn}`}
            aria-label="Voice input"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="9" y="2" width="6" height="12" rx="3" stroke="#0E1318" strokeWidth="1.5" />
              <path
                d="M5 11C5 14.866 8.13401 18 12 18C15.866 18 19 14.866 19 11"
                stroke="#0E1318"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 18V22M12 22H8M12 22H16"
                stroke="#0E1318"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search/Generate Buttons */}
      <div className={styles.buttons}>
        <button type="button" className={styles.searchBtn} onClick={handleSearch}>
          Search
        </button>
        <div className={styles.generateBtnWrapper}>
          <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
            <span className={styles.sparkle}>✦</span>
            Generate
          </button>
          <button
            type="button"
            className={styles.generateDropdownBtn}
            aria-label="More generate options"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className={styles.suggestions} ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              className={`${styles.suggestionItem} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              type="button"
            >
              <span className={styles.suggestionIcon}>
                {suggestion.type === 'generate' ? '✦' : '🔍'}
              </span>
              <span className={styles.suggestionText}>{suggestion.text}</span>
              {suggestion.type === 'generate' && (
                <span className={styles.suggestionLabel}>Generate</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISearchInput;
