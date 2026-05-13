import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { ItalicIcon } from '@canva/easel/icons';

const TextItalicButton = forwardRef<HTMLButtonElement>(function TextItalicButton(_props, ref) {
  return (
    <IconButton
      ref={ref}
      ariaLabel="Italic"
      onClick={() => console.log('Italic')}
      dataToolbarKey="italic"
    >
      <ItalicIcon size="medium" />
    </IconButton>
  );
});

export default TextItalicButton;
