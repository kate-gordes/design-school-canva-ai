interface IconProps {
  size?: number;
  className?: string;
}

export default function ShapeIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M19.367 8.609A2.08 2.08 0 0 0 17.9 8H7.006v.5h-.002V18.9c0 1.143.935 2.078 2.078 2.078H17.9a2.084 2.084 0 0 0 2.078-2.078v-8.825a2.08 2.08 0 0 0-.61-1.466Z"
        fill="#11171D"
      />
      <path
        d="M8.478 16H8.5A6.5 6.5 0 0 0 15 9.5L15 9.479a6.504 6.504 0 0 0-.186-1.5A6.496 6.496 0 0 0 2.21 7.856a6.497 6.497 0 0 0 4.767 7.958c.482.116.983.184 1.5.186Z"
        fill="#6B6F73"
      />
    </svg>
  );
}
