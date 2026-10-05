import React, { useState } from 'react';

interface Props {
  variant?: 'full' | 'crest' | 'header';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BinaBangsaLogo: React.FC<Props> = ({ variant = 'header', className = '', size = 'md' }) => {
  const [logoSrc, setLogoSrc] = useState<string | null>(() => {
    return localStorage.getItem('sciquest_bbs_logo') || 'Bina_Bangsa_New_Logo-removebg-preview.png';
  });
  const [imgError, setImgError] = useState<boolean>(false);

  // If uploaded PNG is available and loads without error
  if (logoSrc && !imgError) {
    if (variant === 'crest') {
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
          <img
            src={logoSrc}
            alt="Bina Bangsa School Crest"
            className={`${size === 'sm' ? 'h-8' : size === 'lg' ? 'h-16' : 'h-10'} w-auto object-contain`}
            onError={() => setImgError(true)}
          />
        </div>
      );
    }

    if (variant === 'header') {
      return (
        <div className={`flex items-center gap-2.5 ${className}`}>
          <img
            src={logoSrc}
            alt="Bina Bangsa School Logo"
            className={`${size === 'sm' ? 'h-8' : 'h-10'} w-auto object-contain shrink-0 drop-shadow-2xs`}
            onError={() => setImgError(true)}
          />
          <div className="flex flex-col text-left leading-tight hidden sm:flex">
            <span className="text-xs font-black tracking-tight text-[#002B49] font-serif">
              BINA BANGSA SCHOOL
            </span>
            <span className="text-[10px] font-bold text-teal-800 tracking-wider">
              培民学校 · Primary 6 Science
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={logoSrc}
          alt="Bina Bangsa School Logo"
          className={`${size === 'lg' ? 'h-24' : 'h-16'} w-auto object-contain drop-shadow-xs`}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Crisp, faithful SVG vector recreation of the Bina Bangsa School Shield
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 120 140"
        className={`${size === 'sm' ? 'w-8 h-9' : size === 'lg' ? 'w-16 h-18' : 'w-10 h-12'} shrink-0 drop-shadow-xs`}
      >
        {/* Shield Outer Path */}
        <path
          d="M 10 10 L 110 10 L 110 70 C 110 105, 60 135, 60 135 C 60 135, 10 105, 10 70 Z"
          fill="#009688"
        />

        {/* White Quarters in Shield */}
        <path d="M 12 12 L 50 12 L 50 50 L 12 50 Z" fill="#FFFFFF" />
        <path d="M 70 12 L 108 12 L 108 50 L 70 50 Z" fill="#FFFFFF" />
        <path d="M 12 50 L 50 50 L 50 85 C 35 78, 20 68, 12 55 Z" fill="#FFFFFF" />
        <path d="M 70 50 L 108 50 L 108 55 C 100 68, 85 78, 70 85 Z" fill="#FFFFFF" />

        {/* Navy Cross */}
        <rect x="50" y="10" width="20" height="120" fill="#002B49" />
        <rect x="10" y="45" width="100" height="20" fill="#002B49" />

        {/* Open Book Graphic at Top */}
        <g transform="translate(60, 48)">
          {/* Left Page */}
          <path
            d="M 0 -18 L -24 -24 L -24 5 L 0 12 Z"
            fill="#FFFFFF"
            stroke="#002B49"
            strokeWidth="2.5"
          />
          {/* Right Page */}
          <path
            d="M 0 -18 L 24 -24 L 24 5 L 0 12 Z"
            fill="#FFFFFF"
            stroke="#002B49"
            strokeWidth="2.5"
          />
          {/* Chinese Characters 培民 */}
          <text x="-12" y="-5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#002B49" fontFamily="serif">
            培
          </text>
          <text x="12" y="-5" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#002B49" fontFamily="serif">
            民
          </text>
        </g>

        {/* BBS Letters in Center */}
        <text
          x="60"
          y="98"
          textAnchor="middle"
          fontSize="24"
          fontWeight="900"
          fontFamily="serif"
          fill="#002B49"
          letterSpacing="1"
        >
          BBS
        </text>
      </svg>

      {variant !== 'crest' && (
        <div className="flex flex-col text-left leading-tight hidden sm:flex">
          <span className="text-xs font-black tracking-tight text-[#002B49] font-serif">
            BINA BANGSA SCHOOL
          </span>
          <span className="text-[10px] font-bold text-teal-800 tracking-wider">
            培民学校 · Primary 6 Science
          </span>
        </div>
      )}
    </div>
  );
};
