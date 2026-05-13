interface IconProps {
  size?: number;
  className?: string;
}

export default function TableIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm-.5 10.75V9.5h4v4.25h-4Zm5.5 0V9.5h4v4.25h-4Zm-5.5 1.5h4v4.25H5a.5.5 0 0 1-.5-.5v-3.75Zm5.5 0v4.25h4v-4.25h-4Zm5.5 4.25v-4.25h4V19a.5.5 0 0 1-.5.5h-3.5Zm0-5.75V9.5h4v4.25h-4Z"
        fill="rgb(29, 59, 124)"
      />
    </svg>
  );
}
