interface IconProps {
  size?: number;
  className?: string;
}

export default function UploadsIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M11.23 3.01c-2.688 0-4.955 2.036-5.232 4.7a.381.381 0 0 1-.24.313 5.65 5.65 0 0 0 1.98 10.94h.3a4.39 4.39 0 0 0 3.994-4.373v-1.696l-1.74 1.74a.75.75 0 1 1-1.06-1.06l3.02-3.02a.75.75 0 0 1 1.06 0l3.02 3.02a.75.75 0 0 1-1.06 1.06l-1.74-1.74v1.696c0 1.735-.75 3.295-1.944 4.373h4.686a5.649 5.649 0 0 0 5.649-5.649c0-2.931-2.265-5.383-5.14-5.63a.435.435 0 0 1-.375-.347A5.265 5.265 0 0 0 11.23 3.01Z"
        fill="currentColor"
      />
    </svg>
  );
}
