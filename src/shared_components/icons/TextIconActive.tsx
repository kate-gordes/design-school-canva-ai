interface IconProps {
  size?: number;
  className?: string;
}

export default function TextIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        fill="currentColor"
        d="M4.266 5.792a1.5 1.5 0 0 1 1.5-1.5h12.468a1.5 1.5 0 0 1 1.5 1.5v1.85a.75.75 0 0 1-1.5 0v-1.35a.5.5 0 0 0-.5-.5H12.75v11.939a.5.5 0 0 0 .5.5h1.875a.75.75 0 0 1 0 1.5h-6.25a.75.75 0 1 1 0-1.5h1.875a.5.5 0 0 0 .5-.5V5.792H6.266a.5.5 0 0 0-.5.5V7.67a.75.75 0 1 1-1.5 0V5.792Z"
      />
    </svg>
  );
}
