import React from 'react';
import { ProIcon as EaselProIcon } from '@canva/easel/icons';

interface IconProps {
  size?: number;
  className?: string;
}

export default function ProIcon({ size = 26, className }: IconProps): JSX.Element {
  const sizeStr = size >= 28 ? 'large' : size <= 20 ? 'small' : 'medium';
  return <EaselProIcon size={sizeStr as 'small' | 'medium' | 'large'} className={className} />;
}
