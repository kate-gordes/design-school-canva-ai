interface IconProps {
  size?: number;
  className?: string;
}

export default function NavHomeIconActive({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <g clipPath="url(#_nav_home_active_clip)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M9.483 3.604a4 4 0 0 1 5.03 0l4.999 4.04a4 4 0 0 1 1.485 3.11v6.1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-6.1a4 4 0 0 1 1.485-3.11zm3.972 7.26a3.05 3.05 0 0 0-2.913 0 1.91 1.91 0 0 0-.998 1.677v4.218a.5.5 0 0 0 .5.5h3.908a.5.5 0 0 0 .5-.5V12.54c0-.7-.382-1.343-.997-1.677"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="_nav_home_active_clip">
          <rect width="24" height="24" fill="#fff" rx="8" />
        </clipPath>
      </defs>
    </svg>
  );
}
