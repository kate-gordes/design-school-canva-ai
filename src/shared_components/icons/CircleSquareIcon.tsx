import React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
}

export default function CircleSquareIcon({ size = 24, className }: IconProps): React.ReactElement {
  const px = typeof size === 'number' ? size : 24;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={px}
      height={px}
      viewBox="0 0 24 24"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="10"
        height="10"
        rx="2"
        ry="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16.5" cy="16.5" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
