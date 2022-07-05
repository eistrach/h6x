export const LogoIcon = (props: React.ComponentProps<"svg">) => {
  return (
    <svg
      {...props}
      stroke="currentColor"
      width="184"
      height="200"
      viewBox="0 0 184 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M72.1132 11.6987L94.2265 50L72.1132 88.3013L27.8867 88.3013L5.7735 50L27.8867 11.6987L72.1132 11.6987Z"
        stroke="black"
        strokeWidth="10"
      />
      <path
        d="M156.113 61.6987L178.227 100L156.113 138.301L111.887 138.301L89.7735 100L111.887 61.6987L156.113 61.6987Z"
        stroke="black"
        strokeWidth="10"
      />
      <path
        d="M72.1133 111.699L94.2265 150L72.1133 188.301L27.8868 188.301L5.7735 150L27.8868 111.699L72.1133 111.699Z"
        stroke="black"
        strokeWidth="10"
      />
      <g filter="url(#filter0_d_4_2)">
        <path
          d="M134 100L111.44 59.6961L87.8161 99.3852L134 100ZM47.9541 53.4372L101.02 85.0238L105.111 78.1494L52.0459 46.5628L47.9541 53.4372Z"
          fill="black"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4_2"
          x="43.9541"
          y="46.5628"
          width="94.0459"
          height="61.4372"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4_2"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4_2"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};
