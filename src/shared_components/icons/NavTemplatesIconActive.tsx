interface IconProps {
  size?: number;
  className?: string;
}

export default function NavTemplatesIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M13.5 3.001v17.997l-.825.002h-1.35c-3.59 0-5.386 0-6.611-.966a4.5 4.5 0 0 1-.748-.748C3 18.061 3 16.266 3 12.675v-1.35c0-3.59 0-5.386.966-6.611q.33-.419.748-.748C5.939 3 7.734 3 11.325 3h1.35zm7.5 9.674c0 3.59 0 5.386-.966 6.611-.219.278-.47.53-.748.748-.926.73-2.179.908-4.286.951V11.02h6zm-6-9.661c2.107.043 3.36.221 4.286.952.278.219.53.47.748.748.789 1 .931 2.38.958 4.805H15z"
      />
    </svg>
  );
}
