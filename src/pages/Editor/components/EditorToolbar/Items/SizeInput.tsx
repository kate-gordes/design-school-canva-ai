import React from 'react';
import { Button, NumberInput } from '@canva/easel';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';
import { MinusIcon, PlusIcon } from '@canva/easel/icons';

export type SizeInputProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function SizeInput({ value, onChange }: SizeInputProps): React.ReactElement {
  return (
    <NumberInput
      className={styles.sizeInput}
      value={value}
      data-toolbar-key="size"
      onChange={(v: number | undefined) => {
        if (typeof v === 'number' && !Number.isNaN(v)) onChange(v);
      }}
      onChangeComplete={(v: number | undefined) => {
        if (typeof v === 'number' && !Number.isNaN(v)) onChange(v);
      }}
      min={1}
      max={500}
      step={1}
      hasSpinButtons={false}
      start={
        <Button
          variant="secondary"
          size="small"
          className={`${styles.iconButton} ${styles.sizeStepperButton}`}
          ariaLabel="Decrease font size"
          onClick={() => onChange(Math.max(1, value - 1))}
        >
          <MinusIcon size="tiny" />
        </Button>
      }
      end={
        <Button
          variant="secondary"
          size="small"
          className={`${styles.iconButton} ${styles.sizeStepperButton}`}
          ariaLabel="Increase font size"
          onClick={() => onChange(Math.min(500, value + 1))}
        >
          <PlusIcon size="tiny" />
        </Button>
      }
    />
  );
}
