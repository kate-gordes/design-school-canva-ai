import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { Popover, Menu, MenuItem, MenuDivider, TextInput, Box } from '@canva/easel';
import { SearchIcon } from '@canva/easel/icons';
import styles from './CommandMenu.module.css';
import { insertMarkdownPrefix, closeCommandMenu } from '@/store';

interface CommandMenuProps {
  blockId: string;
  open: boolean;
  referenceElement: HTMLElement | null;
  searchQuery: string;
}

interface CommandOption {
  id: string;
  label: string;
  prefix: string;
  shortcut?: string;
  icon: React.ReactNode;
}

// Custom heading icons
const H1Icon = () => (
  <span className={styles.headingIcon}>
    H<sub>1</sub>
  </span>
);
const H2Icon = () => (
  <span className={styles.headingIcon}>
    H<sub>2</sub>
  </span>
);
const H3Icon = () => (
  <span className={styles.headingIcon}>
    H<sub>3</sub>
  </span>
);

const QuoteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 17h3l2-4V7H5v6h3l-2 4zm8 0h3l2-4V7h-6v6h3l-2 4z" />
  </svg>
);

const COMMAND_OPTIONS: CommandOption[] = [
  { id: 'h1', label: 'Heading', prefix: '# ', shortcut: '⌥⌘1', icon: <H1Icon /> },
  { id: 'h2', label: 'Subheading', prefix: '## ', shortcut: '⌥⌘2', icon: <H2Icon /> },
  { id: 'h3', label: 'Small heading', prefix: '### ', shortcut: '⌥⌘3', icon: <H3Icon /> },
  { id: 'quote', label: 'Quote', prefix: '> ', icon: <QuoteIcon /> },
];

export default function CommandMenu({
  blockId,
  open,
  referenceElement,
  searchQuery: externalSearchQuery,
}: CommandMenuProps): React.ReactNode {
  const [internalSearch, setInternalSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use external search query (from slash typing) or internal search input
  const searchQuery = externalSearchQuery || internalSearch;

  // Focus input when menu opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInternalSearch('');
      setSelectedIndex(0);
    }
  }, [open]);

  const handleOptionClick = useCallback(
    (option: CommandOption) => {
      if (option.prefix) {
        insertMarkdownPrefix(blockId, option.prefix);
      } else {
        closeCommandMenu();
      }
    },
    [blockId],
  );

  const handleClose = useCallback(() => {
    closeCommandMenu();
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return COMMAND_OPTIONS;
    const query = searchQuery.toLowerCase();
    return COMMAND_OPTIONS.filter(
      option =>
        option.label.toLowerCase().includes(query) || option.id.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // Reset selected index when filtered options change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredOptions.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredOptions[selectedIndex]) {
          handleOptionClick(filteredOptions[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    },
    [filteredOptions, selectedIndex, handleOptionClick, handleClose],
  );

  if (!referenceElement) return null;

  return (
    <Popover
      open={open}
      onRequestClose={handleClose}
      reference={referenceElement}
      placement="bottom-start"
      offset="1u"
    >
      <div className={styles.popoverContainer} onKeyDown={handleKeyDown}>
        <div className={styles.popoverInner}>
          <Box padding="2u" paddingBottom="1u">
            <TextInput
              ref={inputRef}
              type="search"
              value={internalSearch}
              onChange={setInternalSearch}
              placeholder="Search actions"
              start={<SearchIcon size="small" />}
            />
          </Box>
          <Menu role="listbox" ariaLabel="Actions">
            <MenuDivider>Actions</MenuDivider>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <MenuItem
                  key={option.id}
                  start={option.icon}
                  end={
                    option.shortcut ? (
                      <span className={styles.shortcut}>{option.shortcut}</span>
                    ) : undefined
                  }
                  onClick={() => handleOptionClick(option)}
                  selected={index === selectedIndex}
                >
                  {option.label}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No matching commands</MenuItem>
            )}
          </Menu>
        </div>
      </div>
    </Popover>
  );
}
