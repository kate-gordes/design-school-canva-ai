import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { UnderlineIcon } from '@canva/easel/icons';

const TextUnderlineButton = forwardRef<HTMLButtonElement>(
  function TextUnderlineButton(_props, ref) {
    return (
      <IconButton
        ref={ref}
        ariaLabel="Underline"
        onClick={() => console.log('Underline')}
        dataToolbarKey="underline"
      >
        <UnderlineIcon size="medium" />
      </IconButton>
    );
  },
);

export default TextUnderlineButton;
