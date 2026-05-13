interface IconProps {
  size?: number;
  className?: string;
}

export default function CreatorIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M3.75 3.75A.75.75 0 0 1 4.5 3h15a.75.75 0 0 1 .75.75v16.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V3.75ZM5.25 4.5v15h13.5v-15H5.25Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 6a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 12 6Z"
        fill="currentColor"
      />
    </svg>
  );
}
