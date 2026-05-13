interface IconProps {
  size?: number;
  className?: string;
}

export default function NavDockLeftFilledIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M7 21C4.79086 21 3 19.2091 3 17L3 7C3 4.79086 4.79086 3 7 3L17 3C19.2091 3 21 4.79086 21 7L21 17C21 19.2091 19.2091 21 17 21L7 21ZM10 4.5L10 19.5L17 19.5C18.3807 19.5 19.5 18.3807 19.5 17L19.5 7C19.5 5.61929 18.3807 4.5 17 4.5L10 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
