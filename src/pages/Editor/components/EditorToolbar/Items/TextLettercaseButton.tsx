import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { LettercaseIcon } from '@canva/easel/icons';

const TextLettercaseButton = forwardRef<HTMLButtonElement>(
  function TextLettercaseButton(_props, ref) {
    return (
      <IconButton
        ref={ref}
        ariaLabel="Lettercase"
        onClick={() => console.log('Lettercase')}
        dataToolbarKey="lettercase"
      >
        <LettercaseIcon size="medium" />
      </IconButton>
    );
  },
);

export default TextLettercaseButton;
