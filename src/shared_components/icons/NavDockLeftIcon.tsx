interface IconProps {
  size?: number;
  className?: string;
}

export default function NavDockLeftIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m7 3c-2.20914 0-4 1.79086-4 4v10c0 2.2091 1.79086 4 4 4h10c2.2091 0 4-1.7909 4-4v-10c0-2.20914-1.7909-4-4-4zm1.5 16.5h-1.5c-1.38071 0-2.5-1.1193-2.5-2.5v-10c0-1.38071 1.11929-2.5 2.5-2.5h1.5zm1.5 0v-15h7c1.3807 0 2.5 1.11929 2.5 2.5v10c0 1.3807-1.1193 2.5-2.5 2.5z"
        fill="currentColor"
      />
    </svg>
  );
}
