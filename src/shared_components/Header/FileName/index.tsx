import React, { useState } from 'react';
import styles from './FileName.module.css';

interface FileNameProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export const FileName: React.FC<FileNameProps> = ({
  defaultValue = 'Untitled design - Presentation',
  onChange,
}) => {
  const [titleText, setTitleText] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setTitleText(newValue);
    onChange?.(newValue);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      e.currentTarget.blur();
    }
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  return (
    // Plain input: this is an inline editable file title that renders as
    // transparent text (no border, no background) until focused. Easel
    // TextInput imposes its own chrome (border, padding, height) that
    // conflicts with the header-title visual.
    <input
      type="text"
      value={titleText}
      onChange={handleTitleChange}
      onKeyDown={handleTitleKeyDown}
      onBlur={handleTitleBlur}
      onClick={handleTitleClick}
      className={`${styles.titleInput} ${isEditing ? styles.titleInputFocused : ''}`}
    />
  );
};
