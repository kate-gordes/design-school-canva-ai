import React, { useState } from 'react';
import { Button } from '@canva/easel';

export type GenericCycleIconButtonProps = {
  ariaLabel: string;
  icons: Array<React.ElementType>;
  initialIndex?: number;
  onCycle?: (nextIndex: number) => void;
  className?: string;
};

export default function GenericCycleIconButton({
  ariaLabel,
  icons,
  initialIndex = 0,
  onCycle,
  className,
}: GenericCycleIconButtonProps) {
  const [index, setIndex] = useState<number>(
    Math.max(0, Math.min(initialIndex, Math.max(0, icons.length - 1))),
  );
  const Icon = icons[index] ?? null;
  return (
    <Button
      variant="secondary"
      size="medium"
      className={className}
      ariaLabel={ariaLabel}
      onClick={() => {
        const next = icons.length === 0 ? 0 : (index + 1) % icons.length;
        setIndex(next);
        if (onCycle) onCycle(next);
      }}
    >
      {Icon ? <Icon size="medium" /> : null}
    </Button>
  );
}
