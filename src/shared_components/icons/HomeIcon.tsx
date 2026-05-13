interface IconProps {
  size?: number;
  className?: string;
}

export default function HomeIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M2.515 10.674a1 1 0 0 1 .34-1.367L11.293 3.6a1 1 0 0 1 1.12 0l8.438 5.708a1 1 0 0 1 .34 1.367l-.514.76a1 1 0 0 1-1.367.34L18 10.972V19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8.028l-1.31.803a1 1 0 0 1-1.367-.34l-.514-.76ZM12 5.467 8 8.236V19h8v-10.764L12 5.467Z"
        fill="currentColor"
      />
    </svg>
  );
}
