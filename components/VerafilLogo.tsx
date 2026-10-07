import React from 'react';

interface VerafilLogoProps {
  className?: string;
  glowing?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const VerafilLogo: React.FC<VerafilLogoProps> = ({ 
  className = '', 
  glowing = false,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-5 w-auto',
    md: 'h-7 w-auto',
    lg: 'h-10 w-auto',
    hero: 'w-full max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[740px] h-auto'
  };

  const glowStyle: React.CSSProperties = glowing ? {
    filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 35px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 65px rgba(255, 255, 255, 0.45))'
  } : {};

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={glowStyle}
      aria-label="VERAFIL"
      role="img"
    >
      <svg 
        viewBox="0 0 900 110" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} text-white transition-all duration-300`}
      >
        {/* V */}
        <path 
          d="M 50 18 L 95 92 L 140 18" 
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* E (Three iconic modern bars) */}
        <line x1="205" y1="24" x2="275" y2="24" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
        <line x1="205" y1="55" x2="275" y2="55" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />
        <line x1="205" y1="86" x2="275" y2="86" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />

        {/* R */}
        <path 
          d="M 345 92 V 18 H 392 C 418 18 434 30 434 47 C 434 63 418 73 392 73 H 345 M 392 73 L 434 92" 
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* A */}
        <path 
          d="M 500 92 L 545 18 L 590 92" 
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <line x1="516" y1="67" x2="574" y2="67" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />

        {/* F */}
        <path 
          d="M 655 92 V 18 H 715 M 655 53 H 705" 
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* I */}
        <line x1="775" y1="18" x2="775" y2="92" stroke="currentColor" strokeWidth="11" strokeLinecap="round" />

        {/* L */}
        <path 
          d="M 835 18 V 92 H 895" 
          stroke="currentColor" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
    </div>
  );
};

export default VerafilLogo;
