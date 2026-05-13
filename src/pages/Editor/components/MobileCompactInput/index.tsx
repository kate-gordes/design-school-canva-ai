import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, MicrophoneIcon } from '@canva/easel/icons';
import { addUserMessage, addAssistantMessage } from '@/store';
import styles from './MobileCompactInput.module.css';

interface MobileCompactInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function MobileCompactInput({
  placeholder = 'Ask anything...',
  onSubmit,
  onFocus,
  onBlur,
}: MobileCompactInputProps): React.ReactNode {
  const [inputValue, setInputValue] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Track keyboard visibility via visualViewport
  useEffect(() => {
    const updateKeyboardState = () => {
      if (!window.visualViewport) return;
      const kbHeight = window.innerHeight - window.visualViewport.height;
      setKeyboardOpen(kbHeight > 100); // threshold to detect keyboard
    };

    window.visualViewport?.addEventListener('resize', updateKeyboardState);
    updateKeyboardState();

    return () => {
      window.visualViewport?.removeEventListener('resize', updateKeyboardState);
    };
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue.trim());
      setInputValue('');
      onSubmit?.(inputValue.trim());

      // Simulate assistant response
      setTimeout(() => {
        addAssistantMessage("I'm here to help you with your design!");
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerClasses = [styles.container, keyboardOpen ? styles.containerKeyboardOpen : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses}>
      <div className={styles.inputRow}>
        <button className={styles.iconButton} aria-label="Add attachment">
          <PlusIcon size="medium" />
        </button>

        <input
          ref={inputRef}
          type="text"
          className={styles.textInput}
          placeholder={placeholder}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            onFocus?.();
            // iOS: scroll input into view after keyboard animates
            setTimeout(() => {
              inputRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
              });
            }, 300);
          }}
          onBlur={onBlur}
        />

        <button className={styles.iconButton} aria-label="Voice input">
          <MicrophoneIcon size="medium" />
        </button>
      </div>
    </div>
  );
}
