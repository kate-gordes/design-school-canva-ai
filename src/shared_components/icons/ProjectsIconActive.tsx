interface IconProps {
  size?: number;
  className?: string;
}

export default function ProjectsIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M3.014 11.016c-.389 0-.756.152-.998.413a.974.974 0 0 0-.243.926l1.48 5.436h.015c.645 2.009 2.485 3.459 4.656 3.459h8.16c2.398 0 4.393-1.769 4.818-4.106l1.324-4.785a.974.974 0 0 0-.24-.929 1.363 1.363 0 0 0-1-.414H3.014Zm.015 1.091h-.015l.015.056v-.056Z"
        fill="currentColor"
      />
      <path
        d="M10.607 3.25h-3.83a3.75 3.75 0 0 0-3.75 3.731l-.013 2.535h2.63v-.433c0-.451.365-.817.817-.817H17.54c.451 0 .817.366.817.817v.433h2.63v-.5a3 3 0 0 0-3-3.001h-3.651a.422.422 0 0 1-.378-.233l-.333-.666a3.375 3.375 0 0 0-3.018-1.866Z"
        fill="currentColor"
      />
    </svg>
  );
}
