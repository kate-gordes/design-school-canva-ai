import React, { forwardRef } from 'react';
import LabelIconButton from '@/pages/Editor/components/EditorToolbar/Items/LabelIconButton';
import { AnimationMoveIcon } from '@canva/easel/icons';

const AnimateButton = forwardRef<HTMLButtonElement>(function AnimateButton(_props, ref) {
  return (
    <LabelIconButton
      ariaLabel="Animate"
      onClick={() => {
        const ev = new CustomEvent('open-edit-panel-animate');
        window.dispatchEvent(ev);
      }}
      icon={<AnimationMoveIcon size="medium" />}
    />
  );
});

export default AnimateButton;
