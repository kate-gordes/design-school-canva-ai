import * as React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
}

const CornerCircleIcon: React.FC<IconProps> = ({ size = 12, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle stroke="currentColor" cx="6" cy="6" r="5.5" />
  </svg>
);

export default CornerCircleIcon;
