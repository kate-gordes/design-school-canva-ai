interface IconProps {
  size?: number;
  className?: string;
}

export default function DrawIcon({ size = 24, className }: IconProps): JSX.Element {
  const uniqueId = `draw-icon-${Math.random().toString(36).substr(2, 9)}`;

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
        d="M5.11 19.452c.333-.333.027-.026.027-.026l-1.283-1.283-.026.026c-.604.604-.841 1.415-.487 1.77.355.354 1.166.116 1.77-.487Z"
        fill="currentColor"
      />
      <path
        d="M5.11 19.452c.333-.333.027-.026.027-.026l-1.283-1.283-.026.026c-.604.604-.841 1.415-.487 1.77.355.354 1.166.116 1.77-.487Z"
        fill={`url(#${uniqueId}__a)`}
        fillOpacity=".2"
      />
      <g filter={`url(#${uniqueId}__b)`}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.542 6.586a.454.454 0 0 0 0-.641l-3.197-3.197a.454.454 0 0 0-.64 0L5.478 13.952l-1.23 3.267-.636.637c-.066.066-.058.183.02.26l1.511 1.512c.077.078.195.086.261.02l.637-.636.01.01 3.276-1.221L20.542 6.586Z"
          fill="#FF3B4B"
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.619 16.554 6.77 12.655l.84-.828 3.848 3.899-.84.828Z"
        fill="#fff"
        fillOpacity=".6"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.184 19.815a.35.35 0 0 0-.558-.363l-.39.317a6.65 6.65 0 0 1-4.192 1.487H8.65a.65.65 0 1 1 0-1.3h1.394a5.35 5.35 0 0 0 3.372-1.196l.39-.317c1.243-1.009 3.05.164 2.634 1.71l-.393 1.457c-.08.3.29.51.506.287a6.35 6.35 0 0 1 4.57-1.941h.227a.65.65 0 1 1 0 1.3h-.227a5.05 5.05 0 0 0-3.634 1.543c-1.148 1.19-3.127.07-2.697-1.527l.392-1.457Z"
        fill="#FF3B4B"
      />
      <defs>
        <radialGradient
          id={`${uniqueId}__a`}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(-1.24472 -1.26236 1.2624 -1.24477 4.794 19.717)"
        >
          <stop offset=".118" stopOpacity="0" />
          <stop offset=".876" />
        </radialGradient>
        <filter
          id={`${uniqueId}__b`}
          x="3.568"
          y="2.615"
          width="17.106"
          height="17.077"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-1.814" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
          <feBlend in2="shape" result="effect1_innerShadow_20167_20591" />
        </filter>
      </defs>
    </svg>
  );
}
