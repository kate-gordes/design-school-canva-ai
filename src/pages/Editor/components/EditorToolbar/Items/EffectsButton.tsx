import React, { forwardRef } from 'react';
import LabelIconButton from '@/pages/Editor/components/EditorToolbar/Items/LabelIconButton';
import { AnimationMoveIcon } from '@canva/easel/icons';

const EffectsButton = forwardRef<HTMLButtonElement>(function EffectsButton(_props, ref) {
  return (
    <LabelIconButton
      ariaLabel="Effects"
      onClick={() => {
        const ev = new CustomEvent('open-edit-panel-effects');
        window.dispatchEvent(ev);
      }}
      icon={<AnimationMoveIcon size="medium" />}
    />
  );
});

export default EffectsButton;
