interface IconProps {
  size?: number;
  className?: string;
}

export default function BrandIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M8.995 15.5h-2.97c.015.393.036.727.07 1.023.041.377.093.596.135.722.036.11.062.145.07.156.085.113.186.214.3.299.01.008.045.034.154.07.127.042.346.094.723.136.413.045.901.07 1.518.081V15.5ZM13.485 15.5h-2.99V18h2.99v-2.5ZM14.985 17.988a17.25 17.25 0 0 0 1.537-.082c.378-.042.597-.094.723-.136a.508.508 0 0 0 .155-.07c.113-.085.214-.186.3-.3.008-.01.034-.045.07-.155.041-.126.093-.345.135-.722.033-.296.055-.63.069-1.023h-2.99v2.488Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.533 10.188a3.294 3.294 0 1 1 6.588 0 3.294 3.294 0 0 1-6.588 0Zm3.294-1.794a1.794 1.794 0 1 0 0 3.587 1.794 1.794 0 0 0 0-3.587Z"
        fill="currentColor"
      />
      <path
        d="M7.379 10.188a1.794 1.794 0 0 1 2.864-1.44.75.75 0 1 0 .897-1.203 3.294 3.294 0 1 0-.02 5.3.75.75 0 0 0-.888-1.21 1.794 1.794 0 0 1-2.853-1.448Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7Zm4-2.5h10A2.5 2.5 0 0 1 19.5 7v10a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 17V7A2.5 2.5 0 0 1 7 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
