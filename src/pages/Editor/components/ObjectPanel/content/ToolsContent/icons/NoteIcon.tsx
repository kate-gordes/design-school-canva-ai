interface IconProps {
  size?: number;
  className?: string;
}

export default function NoteIcon({ size = 24, className }: IconProps): JSX.Element {
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
        d="M3 6.95a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v6.087a4 4 0 0 1-1.161 2.819l-3.884 3.912a4 4 0 0 1-2.84 1.182H7a4 4 0 0 1-4-4v-10Z"
        fill="#FFC702"
      />
      <path
        d="M17.031 13.95h2a2 2 0 0 0 1.992-1.818l.008-2.651v2.469c0 .061-.002.122-.008.182l-.003.866a4 4 0 0 1-1.144 2.789L15.99 19.75a4 4 0 0 1-2.856 1.2H12.03a2 2 0 0 0 2-2v-2a3 3 0 0 1 3-3Z"
        fill="#FF6105"
      />
    </svg>
  );
}
