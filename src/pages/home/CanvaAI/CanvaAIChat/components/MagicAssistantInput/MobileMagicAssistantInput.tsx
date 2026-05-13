import React, { useRef, useState } from 'react';
import { Button } from '@canva/easel/button';
import { PlusIcon, MicrophoneIcon } from '@canva/easel/icons';
import styles from './MobileMagicAssistantInput.module.css';

interface MobileMagicAssistantInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: (message: string) => void;
}

export default function MobileMagicAssistantInput({
  placeholder = 'Ask me anything',
  disabled = false,
  onSubmit,
}: MobileMagicAssistantInputProps): React.ReactNode {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && onSubmit) {
      onSubmit(query.trim());
      setQuery('');
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const expanded = isFocused || query.trim().length > 0;

  return (
    <form
      className={`${styles.chatBox} ${expanded ? styles.chatBoxExpanded : styles.chatBoxCollapsed}`}
      onSubmit={handleSubmit}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={styles.plusButton}>
        <Button
          variant="tertiary"
          icon={PlusIcon}
          onClick={e => e.stopPropagation()}
          tooltipLabel="Insert file for reference"
          disabled={disabled}
        />
      </div>
      <textarea
        ref={inputRef}
        className={styles.chatInput}
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        rows={expanded ? 2 : 1}
        autoComplete="off"
        aria-label="Enter your message"
      />
      <div className={styles.micButton}>
        <Button
          variant="tertiary"
          icon={MicrophoneIcon}
          onClick={e => e.stopPropagation()}
          tooltipLabel="Chat using voice"
          disabled={disabled}
        />
      </div>
    </form>
  );
}
