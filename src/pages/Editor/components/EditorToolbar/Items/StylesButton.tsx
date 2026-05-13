import React, { forwardRef } from 'react';
import LabelIconButton from '@/pages/Editor/components/EditorToolbar/Items/LabelIconButton';
import { PaintRollerIcon } from '@canva/easel/icons';

const StylesButton = forwardRef<HTMLButtonElement>(function StylesButton(_props, ref) {
  return (
    <LabelIconButton
      ariaLabel="Styles"
      onClick={() => console.log('Styles')}
      icon={<PaintRollerIcon size="medium" />}
      dataToolbarKey="styles"
    />
  );
});

export default StylesButton;
