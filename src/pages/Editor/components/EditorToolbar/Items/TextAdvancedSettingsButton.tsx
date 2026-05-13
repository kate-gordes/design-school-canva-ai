import React, { forwardRef } from 'react';
import LabelIconButton from '@/pages/Editor/components/EditorToolbar/Items/LabelIconButton';
import { TextAdvancedSettingsIcon } from '@/shared_components/icons';

const TextAdvancedSettingsButton = forwardRef<HTMLButtonElement>(
  function TextAdvancedSettingsButton(_props, ref) {
    return (
      <LabelIconButton
        ariaLabel="Text advanced settings"
        onClick={() => console.log('Text advanced settings')}
        icon={<TextAdvancedSettingsIcon />}
        dataToolbarKey="advanced"
      />
    );
  },
);

export default TextAdvancedSettingsButton;
