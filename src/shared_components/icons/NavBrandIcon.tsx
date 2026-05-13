interface IconProps {
  size?: number;
  className?: string;
}

export default function NavBrandIcon({ size = 24, className }: IconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      className={className}
    >
      <g fill="currentColor" clipPath="url(#_nav_brand_clip)">
        <path d="M9.287 12.008a2.9 2.9 0 0 1 1.742.577.626.626 0 0 1-.747 1.002 1.67 1.67 0 1 0-.995 3.008c.37 0 .71-.12.986-.323a.626.626 0 0 1 .739 1.009 2.919 2.919 0 1 1-1.725-5.273" />
        <path
          fillRule="evenodd"
          d="M14.744 12.008a2.919 2.919 0 1 1-.001 5.837 2.919 2.919 0 0 1 .001-5.837m0 1.25a1.67 1.67 0 0 0 0 3.336 1.668 1.668 0 0 0 0-3.337"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M9.706 4.098a4.5 4.5 0 0 1 6.158.7l.531.633a4.5 4.5 0 0 1 3.405 3.06l.205.652a4.5 4.5 0 0 1 1.893 3.668v4.178l-.005.231a4.5 4.5 0 0 1-4.263 4.263l-.232.006H6.632l-.232-.006a4.5 4.5 0 0 1-4.262-4.263l-.006-.231V12.81c0-.907.269-1.75.73-2.457a4.5 4.5 0 0 1 1.163-1.497l5.5-4.614zM6.632 9.811a3 3 0 0 0-3 3v4.178a3 3 0 0 0 3 3h10.766a3 3 0 0 0 3-3V12.81a3 3 0 0 0-3-3zM18.12 8.37a3 3 0 0 0-3.515-1.386l-4.211 1.328h7.004l.232.006q.288.016.564.065l-.074-.013m-3.683-2.896a3 3 0 0 0-3.949-.08L7.975 7.5l-2.002.631 8.181-2.58q.142-.044.284-.079"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="_nav_brand_clip">
          <rect width="24" height="24" fill="#fff" />
        </clipPath>
      </defs>
    </svg>
  );
}
