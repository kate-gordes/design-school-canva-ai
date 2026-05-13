import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { BoldIcon } from '@canva/easel/icons';

const TextBoldButton = forwardRef<HTMLButtonElement>(function TextBoldButton(_props, ref) {
  return (
    <IconButton
      ref={ref}
      ariaLabel="Bold"
      onClick={() => console.log('Bold')}
      dataToolbarKey="bold"
    >
      <BoldIcon size="medium" />
    </IconButton>
  );
});

export default TextBoldButton;
