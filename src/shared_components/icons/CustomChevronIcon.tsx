import React from 'react';

interface CustomChevronIconProps {
  className?: string;
}

export const CustomChevronIcon: React.FC<CustomChevronIconProps> = ({ className }) => {
  return (
    <svg
      width="8"
      height="8"
      viewBox="0 0 8 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        opacity="0.8"
        d="M4.62386 2.79588L3.3268 1.66095C2.90539 1.29222 2.69469 1.10785 2.51597 1.10214C2.36068 1.09718 2.21191 1.16468 2.11339 1.28482C2 1.42308 2 1.70306 2 2.26301V5.73699C2 6.29694 2 6.57692 2.11339 6.71518C2.21191 6.83532 2.36068 6.90282 2.51597 6.89786C2.69469 6.89215 2.90539 6.70778 3.3268 6.33905L4.62386 5.20412C5.099 4.78838 5.33656 4.58051 5.4239 4.33423C5.50058 4.11801 5.50058 3.88199 5.4239 3.66577C5.33656 3.41949 5.099 3.21162 4.62386 2.79588Z"
        fill="rgba(13, 18, 22, 0.86)"
      />
    </svg>
  );
};
