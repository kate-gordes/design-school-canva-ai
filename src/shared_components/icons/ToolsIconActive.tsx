interface IconProps {
  size?: number;
  className?: string;
}

export default function ToolsIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M15.63 3.933a3.135 3.135 0 0 1 4.434 4.434l-1.056 1.057-4.434-4.434 1.056-1.057Zm-2.223 2.224 4.434 4.434-3.172 3.172c-.43.43-.967.735-1.556.886l-3.278.837a1.087 1.087 0 0 1-1.321-1.323l.844-3.292a3.38 3.38 0 0 1 .884-1.55l3.165-3.164Zm-8.91 9.984c0-.354.286-.641.64-.641H7V14H5.137a2.141 2.141 0 1 0 0 4.282H18.89a.609.609 0 1 1 0 1.218H9.188a.75.75 0 0 0 0 1.5h9.7a2.109 2.109 0 1 0 0-4.218H5.139a.641.641 0 0 1-.642-.64Z"
        fill="currentColor"
      />
    </svg>
  );
}
