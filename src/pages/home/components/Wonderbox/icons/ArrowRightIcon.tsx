interface IconProps {
  size?: number;
  className?: string;
}

export default function ArrowRightIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.1 13.004H5.504a.75.75 0 0 1 0-1.5H17.1l-4.377-4.377a.75.75 0 0 1 1.061-1.06l4.95 4.95a1.75 1.75 0 0 1 0 2.474l-4.95 4.95a.75.75 0 1 1-1.06-1.06l4.376-4.377z"
        fill="currentColor"
      />
    </svg>
  );
}
