interface IconProps {
  size?: number;
  className?: string;
}

export default function NavBrandIconActive({ size = 24, className }: IconProps): JSX.Element {
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
        d="M9.684 4.009a4.313 4.313 0 0 1 6.076.532l.222.264a4.31 4.31 0 0 1 3.367 2.784l.365 1.003a4.31 4.31 0 0 1 2.065 3.681v4.415A4.313 4.313 0 0 1 17.466 21H6.532a4.313 4.313 0 0 1-4.312-4.312v-4.415c0-1.418.686-2.677 1.743-3.463zm-.343 7.616a2.881 2.881 0 1 0 1.702 5.204.61.61 0 1 0-.722-.985 1.658 1.658 0 1 1 .01-2.669.611.611 0 0 0 .73-.98 2.87 2.87 0 0 0-1.72-.57m5.044 0a2.88 2.88 0 1 0 0 5.761 2.88 2.88 0 0 0 0-5.761m0 1.222a1.659 1.659 0 1 1 0 3.317 1.659 1.659 0 0 1 0-3.317m3.815-4.84a3.09 3.09 0 0 0-3.961-1.848L9.29 7.961h8.176q.379 0 .74.062zm-3.865-3.149a3.09 3.09 0 0 0-3.865.087L7.765 7.214 13.82 5.01a4 4 0 0 1 .514-.153"
        clipRule="evenodd"
      />
    </svg>
  );
}
