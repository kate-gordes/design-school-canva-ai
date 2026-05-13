interface IconProps {
  size?: number;
  className?: string;
}

export default function MenuToggleIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fill="currentColor"
        d="M4 6a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 4 6Zm0 6a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 4 12Zm0 6a.75.75 0 0 1 .75-.75h8.5a.75.75 0 0 1 0 1.5h-8.5A.75.75 0 0 1 4 18Zm16.78-1.47a.75.75 0 0 1-1.061 0l-3.293-3.293a1.75 1.75 0 0 1 0-2.474L19.72 7.47a.75.75 0 0 1 1.06 1.06l-3.292 3.293a.25.25 0 0 0 0 .354l3.293 3.293a.75.75 0 0 1 0 1.06Z"
      />
    </svg>
  );
}
