interface IconProps {
  size?: number;
  className?: string;
}

export default function NavHomeIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M13.76 10.533a3.75 3.75 0 0 0-3.52 0l-.098.052a2.63 2.63 0 0 0-1.394 2.319v3.971c0 .621.504 1.125 1.125 1.125h4.254c.621 0 1.125-.504 1.125-1.125v-3.971c0-.971-.536-1.863-1.394-2.319zm-2.816 1.325a2.25 2.25 0 0 1 2.112 0l.099.052c.367.195.597.578.597.994V16.5h-3.504v-3.596c0-.416.23-.799.598-.994z"
        clipRule="evenodd"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M2.923 10.942a3.75 3.75 0 0 1 1.42-2.939l5.794-4.59a3 3 0 0 1 3.726 0l5.793 4.59a3.75 3.75 0 0 1 1.421 2.94V17a4 4 0 0 1-4 4H6.923a4 4 0 0 1-4-4zm16.654 0V17a2.5 2.5 0 0 1-2.5 2.5H6.923a2.5 2.5 0 0 1-2.5-2.5v-6.058c0-.687.314-1.336.852-1.763l5.794-4.59a1.5 1.5 0 0 1 1.862 0l5.794 4.59a2.25 2.25 0 0 1 .852 1.763"
        clipRule="evenodd"
      />
    </svg>
  );
}
