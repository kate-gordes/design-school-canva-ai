import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { StrikethroughIcon } from '@canva/easel/icons';

const TextStrikethroughButton = forwardRef<HTMLButtonElement>(
  function TextStrikethroughButton(_props, ref) {
    return (
      <IconButton
        ref={ref}
        ariaLabel="Strikethrough"
        onClick={() => console.log('Strikethrough')}
        dataToolbarKey="strikethrough"
      >
        <StrikethroughIcon size="medium" />
      </IconButton>
    );
  },
);

export default TextStrikethroughButton;
