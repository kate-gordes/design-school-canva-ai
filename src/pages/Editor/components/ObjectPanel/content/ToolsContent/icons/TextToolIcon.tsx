interface IconProps {
  size?: number;
  className?: string;
}

export default function TextToolIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.022 6.518a.502.502 0 0 0-.502.501v.789a1.254 1.254 0 0 1-2.508 0V6.016c0-1.108.898-2.006 2.007-2.006h12.037c1.108 0 2.006.898 2.006 2.006v1.765a1.254 1.254 0 1 1-2.507 0v-.762a.502.502 0 0 0-.502-.501h-3.762V16.8c0 .415.337.752.753.752h.752a1.254 1.254 0 0 1 0 2.508H9.279a1.254 1.254 0 0 1 0-2.508h.752a.752.752 0 0 0 .752-.752V6.518H7.022Z"
        fill="#992BFF"
      />
    </svg>
  );
}
