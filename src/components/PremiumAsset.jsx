import React from 'react';

export const PremiumAsset = ({ type, color = "from-indigo-500 to-blue-600", className = "" }) => {
  // Returns custom inline SVG graphics representing the products
  switch (type) {
    case 'Earphones':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-earbuds" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow-earbuds" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366F1" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#glow-earbuds)">
            {/* Left Earbud */}
            <path d="M35 30 C35 20, 48 20, 48 30 C48 38, 38 42, 38 52 A8 8 0 0 1 22 52 C22 42, 35 40, 35 30 Z" fill="url(#grad-earbuds)" />
            <circle cx="28" cy="52" r="3" fill="#ffffff" opacity="0.8" />
            
            {/* Right Earbud */}
            <path d="M65 30 C65 20, 52 20, 52 30 C52 38, 62 42, 62 52 A8 8 0 0 0 78 52 C78 42, 65 40, 65 30 Z" fill="url(#grad-earbuds)" />
            <circle cx="72" cy="52" r="3" fill="#ffffff" opacity="0.8" />

            {/* Wireless charging case outline background */}
            <rect x="30" y="62" width="40" height="26" rx="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="75" r="2" fill="#10B981" /> {/* Case LED status green */}
          </g>
        </svg>
      );

    case 'Headphones':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-headphones" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
            <filter id="glow-headphones" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#A855F7" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#glow-headphones)">
            {/* Headband */}
            <path d="M25 50 A25 25 0 0 1 75 50" fill="none" stroke="url(#grad-headphones)" strokeWidth="6" strokeLinecap="round" />
            {/* Metal extenders */}
            <line x1="25" y1="50" x2="25" y2="60" stroke="#9CA3AF" strokeWidth="3" />
            <line x1="75" y1="50" x2="75" y2="60" stroke="#9CA3AF" strokeWidth="3" />
            {/* Left Ear Cushion */}
            <rect x="18" y="58" width="14" height="24" rx="7" fill="url(#grad-headphones)" />
            <rect x="25" y="63" width="5" height="14" rx="2" fill="#1F2937" />
            {/* Right Ear Cushion */}
            <rect x="68" y="58" width="14" height="24" rx="7" fill="url(#grad-headphones)" />
            <rect x="70" y="63" width="5" height="14" rx="2" fill="#1F2937" />
            {/* Aesthetic metal details */}
            <circle cx="25" cy="50" r="3" fill="#ffffff" />
            <circle cx="75" cy="50" r="3" fill="#ffffff" />
          </g>
        </svg>
      );

    case 'Footwear':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-shoe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color.includes("emerald") ? "#10B981" : "#F59E0B"} />
              <stop offset="100%" stopColor={color.includes("emerald") ? "#059669" : "#D97706"} />
            </linearGradient>
            <filter id="glow-shoe" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={color.includes("emerald") ? "#10B981" : "#F59E0B"} floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#glow-shoe)">
            {/* Shoe body outline */}
            <path d="M15 65 L30 40 L60 38 L85 55 L85 68 L15 68 Z" fill="url(#grad-shoe)" />
            {/* Sole */}
            <path d="M12 68 L88 68 L88 74 L12 74 Z" fill="#ffffff" />
            <path d="M12 74 L88 74 L84 78 L16 78 Z" fill="#1F2937" />
            {/* Mesh pattern overlay */}
            <path d="M30 40 L50 55 L35 65 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* Laces */}
            <line x1="45" y1="42" x2="52" y2="46" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="47" x2="55" y2="51" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            <line x1="51" y1="52" x2="58" y2="56" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            {/* Back pull tab */}
            <path d="M15 65 C12 60 12 55 16 52" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
          </g>
        </svg>
      );

    case 'Shirt':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-shirt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="glow-shirt" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#06B6D4" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#glow-shirt)">
            {/* Windbreaker outline */}
            <path d="M30 22 L50 15 L70 22 L82 38 L72 44 L68 36 L68 85 L32 85 L32 36 L28 44 L18 38 Z" fill="url(#grad-shirt)" />
            {/* Collar details */}
            <path d="M42 20 L50 28 L58 20" fill="none" stroke="#ffffff" strokeWidth="2" />
            {/* Zipper center line */}
            <line x1="50" y1="28" x2="50" y2="85" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
            {/* Zipper handle */}
            <rect x="48" y="32" width="4" height="8" rx="1" fill="#ffffff" />
            {/* Reflective lining */}
            <path d="M32 50 L68 50" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
          </g>
        </svg>
      );

    case 'Backpack':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-bag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
            <filter id="glow-bag" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#64748B" floodOpacity="0.3" />
            </filter>
          </defs>
          <g filter="url(#glow-bag)">
            {/* Top Loop */}
            <path d="M40 22 C40 16, 60 16, 60 22" fill="none" stroke="#475569" strokeWidth="3" />
            {/* Main Body */}
            <rect x="28" y="24" width="44" height="58" rx="10" fill="url(#grad-bag)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Outer Pocket */}
            <rect x="34" y="48" width="32" height="28" rx="6" fill="#1E293B" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* Zipper Lines */}
            <path d="M28 36 C35 34, 65 34, 72 36" fill="none" stroke="#0F172A" strokeWidth="2" />
            <path d="M34 54 L66 54" stroke="#0F172A" strokeWidth="2" />
            {/* Brand Logo emblem */}
            <circle cx="50" cy="64" r="3" fill="#6366F1" />
          </g>
        </svg>
      );

    case 'Watch':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-watch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <filter id="glow-watch" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#F43F5E" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#glow-watch)">
            {/* Straps */}
            <rect x="42" y="10" width="16" height="80" rx="4" fill="#1F2937" />
            <rect x="42" y="10" width="16" height="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <rect x="42" y="75" width="16" height="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            
            {/* Watch Bezel */}
            <circle cx="50" cy="50" r="24" fill="#374151" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
            {/* Screen */}
            <circle cx="50" cy="50" r="21" fill="url(#grad-watch)" />
            {/* Crown buttons */}
            <rect x="73" y="46" width="3" height="8" rx="1" fill="#9CA3AF" />
            
            {/* Watch Info Interface */}
            {/* Digital Time */}
            <text x="50" y="46" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">10:08</text>
            {/* Circular rings */}
            <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            <path d="M50 36 A14 14 0 0 1 64 50" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" /> {/* Activity ring */}
            <text x="50" y="58" fill="#ffffff" fontSize="5" fontWeight="bold" textAnchor="middle" letterSpacing="0.05em">7482 STEPS</text>
          </g>
        </svg>
      );

    case 'Bottle':
      return (
        <svg viewBox="0 0 100 100" className={`w-full h-full p-6 ${className}`}>
          <defs>
            <linearGradient id="grad-bottle" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4D4D8" />
              <stop offset="50%" stopColor="#F4F4F5" />
              <stop offset="100%" stopColor="#A1A1AA" />
            </linearGradient>
            <filter id="glow-bottle" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#D4D4D8" floodOpacity="0.25" />
            </filter>
          </defs>
          <g filter="url(#glow-bottle)">
            {/* Bottle cap loop */}
            <path d="M44 14 C44 8, 56 8, 56 14" fill="none" stroke="#71717A" strokeWidth="3" />
            
            {/* Cap */}
            <rect x="43" y="16" width="14" height="8" rx="2" fill="#3F3F46" />
            {/* Neck */}
            <path d="M45 24 L55 24 L57 32 L43 32 Z" fill="#A1A1AA" />
            {/* Body */}
            <path d="M36 32 C36 32, 64 32, 64 32 C64 42, 66 50, 66 82 C66 86, 62 88, 50 88 C38 88, 34 86, 34 82 C34 50, 36 42, 36 32 Z" fill="url(#grad-bottle)" />
            {/* Sleek reflection */}
            <path d="M38 34 Q45 36 45 84" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
          </g>
        </svg>
      );

    default:
      return (
        <div className={`w-full h-full bg-gradient-to-tr ${color} flex items-center justify-content`}>
          📦
        </div>
      );
  }
};
