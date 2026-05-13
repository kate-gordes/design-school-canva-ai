import React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
}

export const TextColorCustomIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={typeof size === 'number' ? size : undefined}
    height={typeof size === 'number' ? size : undefined}
    viewBox="0 0 24 24"
    className={className}
  >
    <path
      d="M11 2 5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z"
      fill="currentColor"
    />
  </svg>
);

export default TextColorCustomIcon;
