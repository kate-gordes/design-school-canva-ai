import React from 'react';
import { Button } from '@canva/easel';

export type GenericIconButtonProps = {
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'critical'
    | 'contrast'
    | 'linkButton'
    | 'subtleLinkButton';
};

export default function GenericIconButton({
  ariaLabel,
  onClick,
  children,
  className,
  size = 'medium',
  variant = 'secondary',
}: GenericIconButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      ariaLabel={ariaLabel}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
