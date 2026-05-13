import React, { forwardRef } from 'react';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import { ChartCornerRoundingIcon } from '@canva/easel/icons';

const CornerRadiusButton = forwardRef<HTMLButtonElement>(function CornerRadiusButton(_props, ref) {
  return (
    <IconButton
      ref={ref}
      ariaLabel="Corner rounding"
      onClick={() => console.log('Open corner rounding')}
      dataToolbarKey="radius"
    >
      <ChartCornerRoundingIcon size="medium" />
    </IconButton>
  );
});

export default CornerRadiusButton;
