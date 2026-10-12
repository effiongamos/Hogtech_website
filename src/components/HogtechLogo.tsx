import React from 'react';
import hogtechLogoImg from '../assets/images/hogtech_logo.jpg';

interface HogtechLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'hero';
  variant?: 'emblem' | 'framed' | 'full' | 'horizontal';
  theme?: 'dark' | 'light';
  transparentBg?: boolean;
}

export const HogtechLogo: React.FC<HogtechLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  transparentBg = false,
}) => {
  const sizeMap = {
    sm: { px: 42, textTitle: 'text-sm', textSub: 'text-[9px]', rounded: 'rounded-xl' },
    md: { px: 52, textTitle: 'text-base', textSub: 'text-[10px]', rounded: 'rounded-xl' },
    lg: { px: 76, textTitle: 'text-xl', textSub: 'text-xs', rounded: 'rounded-2xl' },
    xl: { px: 110, textTitle: 'text-2xl', textSub: 'text-sm', rounded: 'rounded-2xl' },
    '2xl': { px: 180, textTitle: 'text-3xl', textSub: 'text-base', rounded: 'rounded-3xl' },
    hero: { px: 280, textTitle: 'text-4xl', textSub: 'text-lg', rounded: 'rounded-3xl' },
  };

  const { px, textTitle, textSub, rounded } = sizeMap[size];

  // Official logo image loaded directly from src/assets/images/hogtech_logo.jpg
  const LogoImage = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden shadow-md transition-all duration-300 ${rounded} ${
        transparentBg
          ? 'bg-transparent'
          : 'bg-[#0A182F] ring-1 ring-white/15 ring-inset shadow-teal-950/40'
      }`}
      style={{ width: `${px}px`, height: `${px}px` }}
    >
      <img
        src={hogtechLogoImg}
        alt="Official Hogtech Int’l Ventures Logo"
        className="w-full h-full object-cover select-none pointer-events-none"
        loading="eager"
      />
    </div>
  );

  if (variant === 'emblem' || variant === 'framed') {
    return <div className={`inline-flex items-center ${className}`}>{LogoImage}</div>;
  }

  if (variant === 'full') {
    const titleColor = theme === 'light' ? 'text-slate-900' : 'text-white';
    const subtitleColor = theme === 'light' ? 'text-slate-500' : 'text-teal-400';
    return (
      <div className={`inline-flex flex-col items-center gap-3 text-center ${className}`}>
        {LogoImage}
        <div className="flex flex-col items-center justify-center select-none">
          <span className={`font-display font-extrabold tracking-tight uppercase leading-none ${textTitle} ${titleColor}`}>
            Hogtech Int’l
            <span className="block text-teal-400 text-[85%] font-bold tracking-wider mt-0.5">Ventures</span>
          </span>
          {size !== 'sm' && (
            <span className={`font-mono text-[9px] tracking-widest uppercase font-semibold mt-1 ${subtitleColor}`}>
              Innovation · Print · Tech · Solutions
            </span>
          )}
        </div>
      </div>
    );
  }

  const titleColor = theme === 'light' ? 'text-slate-900' : 'text-white';
  const subtitleColor = theme === 'light' ? 'text-slate-500' : 'text-teal-400';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoImage}
      <div className="flex flex-col justify-center select-none">
        <span className={`font-display font-extrabold tracking-tight uppercase leading-none ${textTitle} ${titleColor}`}>
          Hogtech Int’l
          <span className="block text-teal-400 text-[85%] font-bold tracking-wider mt-0.5">Ventures</span>
        </span>
        {size !== 'sm' && (
          <span className={`font-mono text-[9px] tracking-widest uppercase font-semibold mt-1 ${subtitleColor}`}>
            Innovation · Print · Tech · Solutions
          </span>
        )}
      </div>
    </div>
  );
};
