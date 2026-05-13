interface IconProps {
  size?: number;
  className?: string;
}

export default function NavAppsIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        clipRule="evenodd"
        d="M8.527 12.753c1.46 0 2.644 1.195 2.644 2.668v2.911C11.17 19.805 9.987 21 8.527 21H5.644C4.184 21 3 19.805 3 18.332v-2.911c0-1.473 1.184-2.668 2.644-2.668zm8.415.139c.364 0 .659.295.659.659v2.73h2.734a.665.665 0 0 1 0 1.33h-2.734v2.73a.659.659 0 1 1-1.318 0v-2.73H13.55a.665.665 0 0 1 0-1.33h2.733v-2.73a.66.66 0 0 1 .66-.66M8.527 3c1.46 0 2.644 1.194 2.644 2.667v2.911c0 1.473-1.184 2.668-2.644 2.668H5.644C4.184 11.246 3 10.052 3 8.578V5.667C3 4.194 4.184 3 5.644 3zm9.83 0c1.459 0 2.642 1.194 2.642 2.667v2.911c0 1.473-1.183 2.668-2.643 2.668h-2.883c-1.46 0-2.644-1.194-2.644-2.668V5.667C12.83 4.194 14.013 3 15.473 3z"
      />
    </svg>
  );
}
