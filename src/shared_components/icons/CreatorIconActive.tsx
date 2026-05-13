interface IconProps {
  size?: number;
  className?: string;
}

export default function CreatorIconActive({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.5 3A.75.75 0 0 0 3.75 3.75v16.5c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V3.75a.75.75 0 0 0-.75-.75h-15Zm7.5 3a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 12 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
