interface IconProps {
  size?: number;
  className?: string;
}

export default function TabBrandIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="m9.096 5.927 1.546-1.297a2.501 2.501 0 0 1 2.797-.284l.142-.051a5.494 5.494 0 0 1 1.723-.331 4 4 0 0 0-5.627-.483L4.975 7.427l4.12-1.5ZM13.051 15.455a1.447 1.447 0 1 1 2.895 0 1.447 1.447 0 0 1-2.895 0Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 9.455a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-4a4 4 0 0 0-4-4H7Zm7.499 3.302a2.697 2.697 0 1 0 0 5.395 2.697 2.697 0 0 0 0-5.395Zm-5.066 1.25a1.447 1.447 0 1 0 .855 2.616.625.625 0 1 1 .74 1.008 2.697 2.697 0 1 1 .016-4.34.625.625 0 1 1-.747 1.002 1.438 1.438 0 0 0-.864-.285Z"
        fill="currentColor"
      />
      <path
        d="m12.297 7.955 2.31-.841a2.501 2.501 0 0 1 2.865.86c.672.058 1.31.236 1.892.513l-.143-.392a4 4 0 0 0-5.127-2.39l-6.183 2.25h4.386Z"
        fill="currentColor"
      />
    </svg>
  );
}
