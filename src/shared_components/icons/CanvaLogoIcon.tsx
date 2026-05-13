import React from 'react';

interface CanvaLogoIconProps {
  size?: number;
  className?: string;
}

/**
 * Custom Canva logo icon matching the Easel CanvaLetterLogoFilledColorIcon design
 * Default size is 40px to match the brand banner
 * Matches the exact gradient and white "C" from the Easel icon
 */
export default function CanvaLogoIcon({
  size = 40,
  className,
}: CanvaLogoIconProps): React.ReactNode {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Canva logo"
      style={{
        display: 'block',
        flexShrink: 0,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Base purple circle */}
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        fill="#7D2AE7"
      />

      {/* Gradient overlays */}
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        fill="url(#canva-gradient-a)"
      />
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        fill="url(#canva-gradient-b)"
      />
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        fill="url(#canva-gradient-c)"
      />
      <path
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
        fill="url(#canva-gradient-d)"
      />

      {/* White "C" letter */}
      <path
        d="M16.317 14.05c-.082 0-.155.07-.23.222-.854 1.73-2.328 2.955-4.034 2.955-1.972 0-3.194-1.78-3.194-4.24 0-4.167 2.322-6.576 4.361-6.576.953 0 1.535.599 1.535 1.552 0 1.13-.643 1.73-.643 2.128 0 .18.112.288.332.288.888 0 1.93-1.02 1.93-2.46 0-1.396-1.216-2.423-3.255-2.423-3.37 0-6.365 3.124-6.365 7.447 0 3.346 1.91 5.557 4.859 5.557 3.129 0 4.938-3.113 4.938-4.123 0-.224-.114-.327-.234-.327Z"
        fill="#fff"
      />

      <defs>
        <radialGradient
          id="canva-gradient-a"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(-49.416 24.368 3.492) scale(15.4682)"
        >
          <stop stopColor="#6420FF" />
          <stop offset="1" stopColor="#6420FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="canva-gradient-b"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(54.703 -.484 9.188) scale(17.4434)"
        >
          <stop stopColor="#00C4CC" />
          <stop offset="1" stopColor="#00C4CC" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="canva-gradient-c"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(10.76839 -10.84209 4.98644 4.95254 5.863 19.726)"
        >
          <stop stopColor="#6420FF" />
          <stop offset="1" stopColor="#6420FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="canva-gradient-d"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(66.52 1.51 10.107) scale(15.7459 26.3778)"
        >
          <stop stopColor="#00C4CC" stopOpacity=".726" />
          <stop offset="0" stopColor="#00C4CC" />
          <stop offset="1" stopColor="#00C4CC" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
