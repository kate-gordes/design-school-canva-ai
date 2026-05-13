interface IconProps {
  size?: number;
  className?: string;
}

export default function ArrowUpIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M13.004 6.9V18.496a.75.75 0 0 1-1.5 0V6.9l-4.377 4.377a.75.75 0 0 1-1.06-1.061l4.95-4.95a1.75 1.75 0 0 1 2.474 0l4.95 4.95a.75.75 0 1 1-1.06 1.06L13.004 6.9z"
        fill="currentColor"
      />
    </svg>
  );
}
