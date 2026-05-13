interface NavCanvaAIIconProps {
  size?: number;
  className?: string;
}

export default function NavCanvaAIIcon({ size = 24, className }: NavCanvaAIIconProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <filter
        id="canva-ai-filter"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
        height="20"
        width="20"
        x="2"
        y="2"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feMorphology
          in="SourceAlpha"
          operator="erode"
          radius="1.55763"
          result="effect1_innerShadow"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="2.33645" />
        <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0.92549 0 0 0 0 0.976471 0 0 0 1 0"
        />
        <feBlend in2="shape" mode="normal" result="effect1_innerShadow" />
      </filter>
      <radialGradient
        id="canva-ai-grad"
        cx="0"
        cy="0"
        gradientTransform="matrix(-2.67913378 -15.38943661 20.8926658 -3.63718621 14.7103 20.0062)"
        gradientUnits="userSpaceOnUse"
        r="1"
      >
        <stop offset=".2" stopColor="#7d2ae8" />
        <stop offset=".5" stopColor="#5a32fa" />
        <stop offset=".970556" stopColor="#00c4cc" />
      </radialGradient>
      <g filter="url(#canva-ai-filter)">
        <circle cx="12" cy="12" fill="url(#canva-ai-grad)" r="10" />
      </g>
      <g fill="#fff">
        <path d="m6.28732 5.33064c.07813-.18125.33514-.18125.41328.00001l.26333.61087c.20046.46501.57119.83574 1.0362 1.0362l.61087.26333c.18126.07814.18126.33514 0 .41328l-.61088.26334c-.465.20046-.83573.57118-1.03619 1.03619l-.26333.61088c-.07814.18126-.33515.18126-.41328 0l-.26334-.61088c-.20046-.46501-.57118-.83574-1.03619-1.03619l-.61088-.26334c-.18126-.07814-.18126-.33514 0-.41328l.61088-.26333c.46501-.20046.83573-.57119 1.03619-1.0362z" />
        <path d="m13.1184 5.49612c2.0388.00012 3.2538 1.0265 3.2539 2.42286 0 1.44027-1.0414 2.45992-1.9287 2.45992-.2205-.0001-.3319-.1083-.332-.2871 0-.39883.6425-.99796.6426-2.12888-.0001-.95275-.5816-1.55157-1.5342-1.55176-2.0391.00001-4.36136 2.40951-4.36136 6.57614.00012 2.4596 1.22206 4.2403 3.19436 4.2403 1.7056-.0001 3.1797-1.2247 4.0332-2.9551.0755-.1521.148-.2225.2305-.2227.1193 0 .2343.1034.2343.3272-.0005 1.0109-1.81 4.1227-4.9385 4.123-2.94809 0-4.85925-2.2106-4.85933-5.5566 0-.7422.09057-1.4486.25391-2.1104.05665-.2062.16106-.5703.26172-.7871.19557-.42097.60867-1.16695 1.06152-1.36228l.61133-.26269c.64244-.27696.80043-1.03105.47559-1.54395 1.06136-.87912 2.35106-1.38085 3.70116-1.38086zm-4.39452 2.0459c-.01753.03813-.04519.07061-.08496.09473.02793-.03202.05653-.06334.08496-.09473z" />
        <path d="m4.10755 9.16856c.05043-.117.21633-.117.26677 0l.16998.39433c.1294.30016.3687.53951.66887.66891l.39432.1699c.117.0505.117.2164 0 .2668l-.39432.17c-.30017.1294-.53947.3687-.66887.6689l-.16998.3943c-.05044.117-.21634.117-.26677 0l-.16999-.3943c-.12939-.3002-.3687-.5395-.66886-.6689l-.39433-.17c-.117-.0504-.117-.2163 0-.2668l.39433-.1699c.30016-.1294.53947-.36875.66886-.66891z" />
      </g>
    </svg>
  );
}
