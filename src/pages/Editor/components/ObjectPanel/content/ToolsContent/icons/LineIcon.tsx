interface IconProps {
  size?: number;
  className?: string;
}

export default function LineIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M4.76 20.363a.661.661 0 0 1-.466-1.13L18.808 4.72a.661.661 0 0 1 .936.935L5.228 20.169a.661.661 0 0 1-.467.194Z"
        fill="#138EFF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.56 3.94a1.5 1.5 0 0 1 0 2.12l-15 15a1.5 1.5 0 0 1-2.12-2.12l15-15a1.5 1.5 0 0 1 2.12 0Z"
        fill="#138EFF"
      />
    </svg>
  );
}
