interface IconProps {
  size?: number;
  className?: string;
}

export default function NavProjectsIcon({ size = 24, className }: IconProps): JSX.Element {
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
        fillRule="evenodd"
        d="M10.606 3.063c1.279 0 2.447.722 3.019 1.865l.335.67c.063.126.182.21.318.23l.06.004H18a3 3 0 0 1 3 3v7.73a4.5 4.5 0 0 1-4.5 4.5H7.508l-.233-.005a4.5 4.5 0 0 1-4.262-4.27l-.005-.232.016-9.75a3.75 3.75 0 0 1 3.558-3.738l.192-.005zm-6.09 8.062-.008 5.433a3 3 0 0 0 3 3.005H16.5a3 3 0 0 0 3-3v-5.438zm2.258-6.562a2.25 2.25 0 0 0-2.25 2.246L4.52 9.625H19.5v-.793a1.5 1.5 0 0 0-1.5-1.5h-3.662a1.92 1.92 0 0 1-1.719-1.062l-.336-.671a1.88 1.88 0 0 0-1.677-1.037z"
        clipRule="evenodd"
      />
    </svg>
  );
}
