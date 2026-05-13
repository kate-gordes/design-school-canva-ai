import React, { useState, useRef } from 'react';
import { Form, MultilineInput, PlusIcon, MicrophoneIcon } from '@canva/easel';
import styles from './MagicAssistantInput.module.css';

interface MagicAssistantInputProps {
  placeholder?: string;
  disabled?: boolean;
  onSubmit?: (message: string) => void;
}

export default function MagicAssistantInput({
  placeholder = 'Ask me anything',
  disabled = false,
  onSubmit,
}: MagicAssistantInputProps): React.ReactNode {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (query.trim() && onSubmit) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={styles.container}>
      <Form onSubmit={handleFormSubmit}>
        <div className={styles.inputRow}>
          <MultilineInput
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoGrow={true}
            borderless={true}
            bufferRows={0}
            minRows={1}
            maxRows={7}
            disabled={disabled}
            ariaLabel="Enter your message"
          />
        </div>
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.plusButton}
            aria-label="Add attachment"
            disabled={disabled}
          >
            <PlusIcon size="small" />
          </button>
          <button
            type="button"
            className={styles.voiceButton}
            aria-label="Voice input"
            disabled={disabled}
          >
            <MicrophoneIcon size="small" />
          </button>
        </div>
      </Form>
    </div>
  );
}
