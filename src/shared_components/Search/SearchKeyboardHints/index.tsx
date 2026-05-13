import React from 'react';
import { Box, Rows, Columns, Column, Text } from '@canva/easel';

export interface KeyboardShortcut {
  keys: string;
  description: string;
}

export interface SearchKeyboardHintsProps {
  shortcuts?: KeyboardShortcut[];
  className?: string;
}

const defaultShortcuts: KeyboardShortcut[] = [
  {
    keys: '⌥⇧⌘Left',
    description: 'Switch to Canva Templates',
  },
  {
    keys: '⌥⇧⌘Right',
    description: 'Switch to Brand Templates',
  },
];

export const SearchKeyboardHints: React.FC<SearchKeyboardHintsProps> = ({
  shortcuts = defaultShortcuts,
  className,
}) => {
  return (
    <Box className={className} padding="2u" borderTop="standard">
      <Rows spacing="1u">
        {shortcuts.map((shortcut, index) => (
          <Columns key={index} spacing="2u" alignY="center">
            <Column width="content">
              <Text size="small" tone="secondary">
                {shortcut.keys}
              </Text>
            </Column>
            <Column>
              <Text size="small" tone="secondary">
                {shortcut.description}
              </Text>
            </Column>
          </Columns>
        ))}
      </Rows>
    </Box>
  );
};

export default SearchKeyboardHints;
