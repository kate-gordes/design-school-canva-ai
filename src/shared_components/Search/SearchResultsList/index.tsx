import React from 'react';
import { Box, Rows, Columns, Column, Text } from '@canva/easel';
import { ClockIcon, FolderIcon } from '@canva/easel/icons';
import type { SuggestionItem } from '@/shared_components/Search/RegularSearch';
import styles from './SearchResultsList.module.css';

export interface SearchResultsListProps {
  suggestions: SuggestionItem[];
  onSuggestionClick: (suggestion: SuggestionItem) => void;
  className?: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  suggestions,
  onSuggestionClick,
  className,
}) => {
  const renderIcon = (suggestion: SuggestionItem) => {
    if (suggestion.thumbnail) {
      return (
        // Raw <div>: the thumbnail container uses overflow:hidden + border-radius
        // to clip an <img>. Easel has no equivalent primitive wrapper for img
        // thumbnails at this size.
        <div className={styles.thumbnailContainer}>
          <img
            src={suggestion.thumbnail}
            alt=""
            className={styles.thumbnail}
            onError={e => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.appendChild(
                Object.assign(document.createElement('div'), {
                  className: styles.placeholderThumbnail,
                }),
              );
            }}
          />
        </div>
      );
    }

    switch (suggestion.type) {
      case 'recent':
        return <ClockIcon size="medium" className={styles.suggestionIcon} />;
      case 'folder':
        return <FolderIcon size="medium" className={styles.suggestionIcon} />;
      case 'design':
      case 'template':
      default:
        // Raw <div>: the placeholder paints a solid gray (rgba 53,71,90,0.1)
        // that Easel Box's reset_f88b8e would wipe. Keep it as a raw div.
        return <div className={styles.placeholderThumbnail} />;
    }
  };

  return (
    <Box className={`${styles.resultsContainer} ${className || ''}`}>
      <Rows spacing="0">
        {suggestions.map(suggestion => (
          // Raw <div>: the suggestion row paints a background-color on hover
          // (rgba 53,71,90,0.05). Easel Box resets background, so the hover
          // state wouldn't paint through a Box.
          <div
            key={suggestion.id}
            className={styles.suggestionItem}
            onClick={() => onSuggestionClick(suggestion)}
          >
            <Box padding="2u">
              <Columns spacing="2u" alignY="center">
                <Column width="content">
                  <Box className={styles.iconContainer}>{renderIcon(suggestion)}</Box>
                </Column>
                <Column>
                  <Rows spacing="0.5u">
                    <Text>{suggestion.text}</Text>
                    {suggestion.label && (
                      <Text tone="secondary" size="small">
                        {suggestion.label}
                      </Text>
                    )}
                  </Rows>
                </Column>
              </Columns>
            </Box>
          </div>
        ))}
      </Rows>
    </Box>
  );
};

export default SearchResultsList;
