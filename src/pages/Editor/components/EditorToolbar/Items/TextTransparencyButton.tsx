import React, { forwardRef } from 'react';
import LabelIconButton from '@/pages/Editor/components/EditorToolbar/Items/LabelIconButton';
import { TransparencyIcon } from '@canva/easel/icons';

const TextTransparencyButton = forwardRef<HTMLButtonElement>(
  function TextTransparencyButton(_props, ref) {
    return (
      <LabelIconButton
        ariaLabel="Text transparency"
        onClick={() => console.log('Text transparency')}
        icon={<TransparencyIcon size="medium" />}
        dataToolbarKey="transparency"
      />
    );
  },
);

export default TextTransparencyButton;
