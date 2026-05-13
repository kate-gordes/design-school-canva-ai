interface IconProps {
  size?: number;
  className?: string;
}

export default function SelectIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="m5.759 3.812 13.626 4.835c.672.239.92.883.888 1.402-.032.513-.345 1.11-1.008 1.297-1.705.48-3.893 1.324-5.249 2.65-1.335 1.307-2.17 3.463-2.643 5.173-.185.668-.788.983-1.301 1.016-.518.034-1.172-.208-1.413-.887L3.843 5.728c-.422-1.19.725-2.338 1.916-1.916Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
