import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { LineWeightsIcon } from '@canva/easel/icons';

const BorderWeightButton = forwardRef<HTMLButtonElement>(function BorderWeightButton(_props, ref) {
  return (
    <IconButton
      ref={ref}
      ariaLabel="Border/line weight"
      onClick={() => console.log('Open border weight')}
      dataToolbarKey="border"
    >
      <LineWeightsIcon size="medium" />
    </IconButton>
  );
});

export default BorderWeightButton;
