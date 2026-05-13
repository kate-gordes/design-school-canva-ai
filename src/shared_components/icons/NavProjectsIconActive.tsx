interface IconProps {
  size?: number;
  className?: string;
}

export default function NavProjectsIconActive({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
    >
      <path d="M6.77 3h3.535c1.493 0 2.858.788 3.525 2.035l.257.48a.5.5 0 0 0 .44.254h3.604c1.934 0 3.503 1.465 3.503 3.273v.503h-2.82v-.409c0-.451-.391-.818-.875-.818H6.061c-.484 0-.876.367-.876.818v.41H2.387l.005-2.462C2.396 4.827 4.355 3 6.77 3" />
      <path
        fillRule="evenodd"
        d="M2.385 10.773v.013h-.019c-.417 0-.81.153-1.07.417-.26.263-.355.608-.26.936l1.587 5.49h.015C3.33 19.587 5.303 21 7.63 21h8.749c2.596 0 4.752-1.758 5.178-4.07l1.406-4.788c.096-.328.002-.673-.258-.938-.259-.264-.653-.418-1.071-.418v-.013zm-.002 1.115h-.017l.017.057z"
        clipRule="evenodd"
      />
    </svg>
  );
}
