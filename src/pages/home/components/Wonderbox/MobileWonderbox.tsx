import { useState } from 'react';
import { Box } from '@canva/easel';
import { BasicButton, Button } from '@canva/easel/button';
import { MultilineInput } from '@canva/easel/form/multiline_input';
import { MicrophoneIcon, ArrowRightIcon, PlusIcon, CogIcon } from '@canva/easel/icons';
import styles from './MobileWonderbox.module.css';

interface MobileWonderboxProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
  showArrow?: boolean;
  showSettings?: boolean;
  minRows?: number;
  maxRows?: number;
  textSize?: 'small' | 'medium';
}

export default function MobileWonderbox({
  placeholder = 'Describe your idea',
  value: controlledValue,
  onChange,
  onSubmit = () => {},
  showArrow = true,
  showSettings = false,
  minRows = 3,
  maxRows = 3,
  textSize = 'small',
}: MobileWonderboxProps): React.ReactNode {
  const [internalValue, setInternalValue] = useState('');

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const hasValue = value.trim().length > 0;

  const handleChange = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };
  return (
    <Box className={styles.container}>
      {/* Gradient border wrapper */}
      <Box className={styles.gradientBorder}>
        {/* White background content */}
        <Box className={styles.content}>
          {/* Textarea */}
          <MultilineInput
            placeholder={placeholder}
            value={value}
            onChange={newValue => handleChange(newValue)}
            borderless={true}
            minRows={minRows}
            maxRows={maxRows}
            resize={false}
            className={styles.textareaWrapper}
            inputClassName={textSize === 'medium' ? styles.textareaMedium : styles.textarea}
          />

          {/* Action buttons row */}
          <Box className={styles.buttonRow}>
            <Box className={styles.leftButton}>
              <Button
                variant="tertiary"
                icon={PlusIcon}
                onClick={() => console.log('Add content')}
                tooltipLabel="Insert file for reference"
              />
            </Box>
            <Box className={styles.rightButtons}>
              {showSettings && (
                <Button
                  variant="tertiary"
                  icon={CogIcon}
                  onClick={() => console.log('Settings')}
                  tooltipLabel="Settings"
                />
              )}
              <Button
                variant="tertiary"
                icon={MicrophoneIcon}
                onClick={() => console.log('Voice input')}
                tooltipLabel="Chat using voice"
              />
              {showArrow && (
                <BasicButton
                  onClick={hasValue ? onSubmit : undefined}
                  className={hasValue ? styles.arrowButtonEnabled : styles.arrowButtonDisabled}
                >
                  <ArrowRightIcon size="medium" />
                </BasicButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Gradient background */}
      <Box className={styles.containerBackground} />
    </Box>
  );
}
