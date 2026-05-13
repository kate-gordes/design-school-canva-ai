interface IconProps {
  size?: number;
  className?: string;
}

export default function DesignIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M12.675 3h.825v18h-2.175c-3.59 0-5.385 0-6.61-.966a4.497 4.497 0 0 1-.749-.748C3 18.06 3 16.266 3 12.675v-1.35c0-3.59 0-5.385.966-6.61a4.5 4.5 0 0 1 .748-.749C5.94 3 7.734 3 11.325 3h1.35Zm6.61 17.034c-.926.73-2.178.909-4.285.952v-9.968h6v1.657c0 3.59 0 5.386-.966 6.61-.22.279-.47.53-.748.749Zm1.709-10.516H15V3.014c2.107.044 3.36.222 4.286.952.278.22.529.47.748.748.788 1 .933 2.38.96 4.804Z"
        fill="currentColor"
      />
    </svg>
  );
}
