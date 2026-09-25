import React from 'react';

export interface CraftslandLogoProps {
  variant?: 'primary' | 'monogram' | 'light' | 'dark' | 'compact' | 'burgundy' | 'burgundy-invert' | 'navy' | 'teal' | 'green' | 'fresh' | 'green-invert';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CraftslandLogo: React.FC<CraftslandLogoProps> = ({
  variant = 'primary',
  className = '',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { crest: 'w-7 h-7', title: 'text-lg', tag: 'text-[7px]' },
    md: { crest: 'w-10 h-10', title: 'text-2xl', tag: 'text-[9px]' },
    lg: { crest: 'w-14 h-14', title: 'text-3xl', tag: 'text-[10px]' },
    xl: { crest: 'w-20 h-20', title: 'text-5xl', tag: 'text-xs' },
  };

  // Color mappings based on the organic wine (#602E31) & warm ivory (#FFF5EC) theme
  let stoneBg = '#602E31';
  let profileCutout = '#FFF5EC';
  let titleColor = 'text-[#241416]';
  let tagColor = 'text-[#B86268]';

  if (variant === 'green-invert' || variant === 'burgundy-invert' || variant === 'dark') {
    stoneBg = '#FFF5EC';
    profileCutout = '#602E31';
    titleColor = 'text-[#FFF5EC]';
    tagColor = 'text-[#E8D9CC]';
  } else if (variant === 'burgundy' || variant === 'green' || variant === 'fresh' || variant === 'primary' || variant === 'navy' || variant === 'teal') {
    stoneBg = '#602E31';
    profileCutout = '#FFF5EC';
    titleColor = 'text-[#241416]';
    tagColor = 'text-[#602E31]';
  } else if (variant === 'light') {
    stoneBg = '#241416';
    profileCutout = '#FFF5EC';
    titleColor = 'text-[#241416]';
    tagColor = 'text-[#602E31]';
  }

  // Sculpted Moai Monolith Silhouette Emblem directly inspired by the brand reference image
  const Emblem = (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size].crest}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Organic rounded stone block */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="15"
          fill={stoneBg}
        />
        {/* Subtle stone texture perimeter stroke */}
        <rect
          x="5"
          y="5"
          width="54"
          height="54"
          rx="14"
          stroke={profileCutout}
          strokeWidth="1"
          strokeOpacity="0.18"
        />
        {/* Sculpted Profile Negative Space Silhouette */}
        {/* Eye/Brow, straight sculpted Moai nose, lips, defined jaw and chin */}
        <path
          d="M34 16
             C29 16 26 19 26 23
             C26 25 27 26.5 27 28
             L20 36
             H27
             V40
             C27 41.5 28 42 29 42
             L27 44.5
             C27 46 28.5 47 30 47
             H33
             C35.5 47 37 45 37 42
             V22
             C37 18 36 16 34 16Z"
          fill={profileCutout}
        />
        {/* Monolith Eye Aperture */}
        <circle
          cx="31"
          cy="23"
          r="1.75"
          fill={stoneBg}
          opacity="0.9"
        />
      </svg>
    </div>
  );

  if (variant === 'monogram' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {Emblem}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {Emblem}
      <div className="flex flex-col justify-center">
        <span
          className={`font-serif font-bold tracking-[0.22em] leading-none uppercase ${titleColor} ${sizeMap[size].title}`}
        >
          TRONX
        </span>
        <span
          className={`font-sans tracking-[0.26em] font-semibold uppercase mt-1 ${tagColor} ${sizeMap[size].tag}`}
        >
          Good Food Brighter Moods
        </span>
      </div>
    </div>
  );
};

export const TronxLogo = CraftslandLogo;
