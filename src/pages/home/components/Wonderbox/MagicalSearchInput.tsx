// Prototype transplanted from: ui/search/wonder_box/wonder_box.tsx,
//   ui/search/wonder_box/private/wonder_box_input.css
// Deviations: see .porter-workspace/Home/results/WONDER_BOX.json

import { Box, Inline } from '@canva/easel';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useWonderbox } from './WonderboxContext';
import FilterPill from './FilterPill';
import SearchIcon from './icons/SearchIcon';
import styles from './Wonderbox.module.css';

interface MagicalSearchInputProps {
  placeholder?: string;
}

export default function MagicalSearchInput({
  placeholder,
}: MagicalSearchInputProps): React.ReactNode {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const { state, setSearchQuery, setFocused } = useWonderbox();
  const { isExpanded, isFocused, selectedTab, tabConfigs } = state;

  const currentTabConfig = tabConfigs[selectedTab];
  const dynamicPlaceholder = placeholder || currentTabConfig.placeholder;

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const query = inputValue.trim();
    setSearchQuery(query);

    /* STRIPPED [logic]: analytics tracking */

    // If AI tab is selected and there's a query, navigate to chat with initial message
    if (selectedTab === 'ai' && query) {
      navigate('/ai/chat', { state: { initialMessage: query } });
    }
    // Handle other search logic here for other tabs
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = () => {
    setFocused(true);
  };

  const isAI = selectedTab === 'ai';

  // containerHeight expands when open (isExpanded)
  const containerHeight = isExpanded ? '150px' : '64px';

  // Palette classes: solid for designs/templates, gradient for AI
  const paletteClass = isAI ? styles.containerGradient : styles.containerSolid;
  const stateClass = isAI
    ? isExpanded
      ? styles.isOpen
      : styles.isClosed
    : isFocused
      ? styles.focusWithin
      : '';

  return (
    // Source: wonder_box_input.css .container — position:relative, max-width:752px (closed) / 960px (open)
    // borderRadius: calc(8px * 2.5) = 20px (relaxed layout, non-compact)
    // palette='solid' (home page) → uses containerSolid + containerBackgroundSolid state
    <div
      className={`${styles.searchContainer} ${paletteClass} ${stateClass} ${isExpanded ? styles.searchContainerExpanded : ''} ${isAI ? styles.searchContainerAI : ''}`}
      onClick={() => inputRef.current?.focus()}
      style={
        {
          '--search-height': containerHeight,
        } as React.CSSProperties
      }
    >
      {/* searchFormWrapper: same max-width constraints, border-radius 20px */}
      <div className={styles.searchForm}>
        <form role="form" noValidate method="post" onSubmit={handleSubmit}>
          <div className={styles.searchInputWrapper}>
            {/* searchInputBox: inner flex row containing icon + input + button */}
            <div className={styles.searchInputBox}>
              <Box className={styles.searchIconContainer}>
                <span className={styles.searchIcon}>
                  <SearchIcon size={24} />
                </span>
              </Box>
              <input
                ref={inputRef}
                name="search"
                dir="auto"
                placeholder={dynamicPlaceholder}
                className={styles.searchInput}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                autoComplete="off"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Bottom filter pills - only show when expanded */}
      {isExpanded && (
        <Box
          className={`${styles.bottomFilters} ${selectedTab === 'ai' ? styles.bottomFiltersAI : ''}`}
        >
          <Inline spacing="1u">
            {/* Regular filter pills for designs and templates */}
            {currentTabConfig.bottomFilters.map(option => (
              <FilterPill
                key={option.id}
                id={option.id}
                start={option.start}
                end={option.end}
                label={option.label}
              />
            ))}

            {/* Action buttons for AI tab - render as filter pills in the same area */}
            {selectedTab === 'ai'
              && currentTabConfig.actionButtons
              && currentTabConfig.actionButtons.map(button => (
                <FilterPill
                  key={button.id}
                  id={button.id}
                  label={button.label}
                  start={button.start}
                  end={button.end}
                />
              ))}
          </Inline>
        </Box>
      )}
    </div>
  );
}
