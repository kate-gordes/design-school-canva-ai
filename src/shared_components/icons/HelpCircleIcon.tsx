import * as React from 'react';

export interface IconProps {
  size?: number | string;
  className?: string;
}

const HelpCircleIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    <path
      d="M9.75 9.75a2.25 2.25 0 1 1 3.79 1.59c-.58.55-1.04.99-1.04 1.91"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

export default HelpCircleIcon;
