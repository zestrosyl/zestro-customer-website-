import React, { useEffect, useState } from 'react';
import { OFFICIAL_LOGO_PATH } from '../data/initialMenu';

interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  logoUrl?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'light',
  size = 'md',
  logoUrl,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const src = logoUrl || OFFICIAL_LOGO_PATH;

  useEffect(() => {
    setImgFailed(false);
  }, [src]);

  const boxSizes = {
    sm: 'h-8 w-8 sm:h-9 sm:w-9 rounded-lg',
    md: 'h-10 w-10 sm:h-11 sm:w-11 rounded-xl',
    lg: 'h-14 w-14 rounded-xl',
  }[size];

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0">
      <span
        className={`${boxSizes} overflow-hidden shrink-0 border ${
          variant === 'dark'
            ? 'border-[#D7A65A]/40 bg-[#1D2922]'
            : 'border-[#101B17]/15 bg-white'
        } flex items-center justify-center`}
      >
        {!imgFailed ? (
          <img
            src={src}
            alt="Zestro official logo"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-contain p-0.5"
          />
        ) : (
          <span
            className={`font-display font-bold text-sm ${
              variant === 'dark' ? 'text-[#D7A65A]' : 'text-[#101B17]'
            }`}
          >
            Z
          </span>
        )}
      </span>
      <span
        className={`font-display font-semibold tracking-[0.14em] ${textSizes} ${
          variant === 'dark' ? 'text-[#F3EBDD]' : 'text-[#101B17]'
        }`}
      >
        ZESTRO
      </span>
    </span>
  );
};
