import React from 'react';

export const StorefrontSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg viewBox="0 0 320 220" className={`w-full max-w-lg h-auto select-none ${className}`}>
      <defs>
        <linearGradient id="wall-brick" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F9EDE0" />
          <stop offset="100%" stopColor="#EDDAC6" />
        </linearGradient>

        <linearGradient id="warm-window" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="100%" stopColor="#FFE082" />
        </linearGradient>

        <filter id="store-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#302B29" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Ground / Pavement */}
      <rect x="0" y="195" width="320" height="25" fill="#D7CCC8" />
      <line x1="0" y1="195" x2="320" y2="195" stroke="#BCAAA4" strokeWidth="2" />

      {/* Main Building Facade */}
      <rect x="25" y="45" width="270" height="150" fill="url(#wall-brick)" stroke="#C7B299" strokeWidth="2.5" rx="6" filter="url(#store-shadow)" />

      {/* Roof Cornice */}
      <rect x="18" y="38" width="284" height="10" fill="#815C43" stroke="#5D4037" strokeWidth="2" rx="3" />

      {/* Upper Sign Board */}
      <rect x="65" y="12" width="190" height="28" fill="#E85D4A" stroke="#B62C1D" strokeWidth="2" rx="4" />
      <rect x="70" y="16" width="180" height="20" fill="none" stroke="#F4BF54" strokeWidth="1.5" strokeDasharray="4 2" rx="2" />
      <text x="160" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontFamily="Outfit, sans-serif" fontWeight="800" letterSpacing="2">
        PIZZA RUSH
      </text>

      {/* Pizzeria Awning */}
      <g>
        {/* Striped panels */}
        <polygon points="35,52 65,52 58,80 28,80" fill="#E85D4A" />
        <polygon points="65,52 95,52 88,80 58,80" fill="#FFF8EC" />
        <polygon points="95,52 125,52 118,80 88,80" fill="#5E9B62" />
        <polygon points="125,52 155,52 148,80 118,80" fill="#E85D4A" />
        <polygon points="155,52 185,52 178,80 148,80" fill="#FFF8EC" />
        <polygon points="185,52 215,52 208,80 178,80" fill="#5E9B62" />
        <polygon points="215,52 245,52 238,80 208,80" fill="#E85D4A" />
        <polygon points="245,52 275,52 268,80 238,80" fill="#FFF8EC" />
        <polygon points="275,52 295,52 288,80 268,80" fill="#5E9B62" />

        {/* Scallop valence bottom */}
        <path
          d="M 28 80 Q 43 88 58 80 Q 73 88 88 80 Q 103 88 118 80 Q 133 88 148 80 Q 163 88 178 80 Q 193 88 208 80 Q 223 88 238 80 Q 253 88 268 80 Q 278 88 288 80 L 288 82 Q 278 90 268 82 Q 253 90 238 82 Q 223 90 208 82 Q 193 90 178 82 Q 163 90 148 82 Q 133 90 118 82 Q 103 90 88 82 Q 73 90 58 82 Q 43 90 28 82 Z"
          fill="#F4BF54"
        />
      </g>

      {/* Left Large Bay Window with warm glow */}
      <rect x="42" y="98" width="90" height="74" fill="url(#warm-window)" stroke="#815C43" strokeWidth="2.5" rx="3" />
      <line x1="87" y1="98" x2="87" y2="172" stroke="#815C43" strokeWidth="2" />
      <line x1="42" y1="135" x2="132" y2="135" stroke="#815C43" strokeWidth="2" />
      {/* Menu / Slice silhouette on glass */}
      <circle cx="87" cy="135" r="14" fill="#FFFFFF" opacity="0.65" />
      <path d="M 87 125 L 96 142 L 78 142 Z" fill="#E85D4A" opacity="0.8" />

      {/* Flower planter box below left window */}
      <rect x="38" y="172" width="98" height="12" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" rx="2" />
      {/* Lush basil leaves */}
      <circle cx="48" cy="170" r="4.5" fill="#5E9B62" />
      <circle cx="62" cy="168" r="5" fill="#4E8452" />
      <circle cx="76" cy="170" r="5.5" fill="#5E9B62" />
      <circle cx="90" cy="168" r="5" fill="#4E8452" />
      <circle cx="104" cy="169" r="5.5" fill="#5E9B62" />
      <circle cx="118" cy="170" r="4.5" fill="#4E8452" />
      {/* Little red blossoms */}
      <circle cx="68" cy="166" r="2.2" fill="#E85D4A" />
      <circle cx="98" cy="165" r="2.2" fill="#E85D4A" />

      {/* Right Entrance Glass Door */}
      <rect x="180" y="94" width="55" height="101" fill="url(#warm-window)" stroke="#815C43" strokeWidth="2.5" rx="2" />
      <rect x="186" y="100" width="43" height="42" fill="#FFFFFF" opacity="0.4" stroke="#815C43" strokeWidth="1.5" />
      <rect x="186" y="148" width="43" height="42" fill="#815C43" opacity="0.3" stroke="#815C43" strokeWidth="1.5" />
      <circle cx="188" cy="144" r="2.5" fill="#F4BF54" stroke="#815C43" strokeWidth="1" />

      {/* Trattoria Chalkboard Stand */}
      <g transform="translate(250, 130)">
        {/* Easel legs */}
        <line x1="8" y1="20" x2="2" y2="65" stroke="#5D4037" strokeWidth="2.5" />
        <line x1="28" y1="20" x2="34" y2="65" stroke="#5D4037" strokeWidth="2.5" />
        <line x1="18" y1="20" x2="18" y2="65" stroke="#3E2723" strokeWidth="2" />
        {/* Chalkboard frame */}
        <rect x="4" y="16" width="28" height="42" fill="#302B29" stroke="#815C43" strokeWidth="2" rx="2" />
        <text x="18" y="27" textAnchor="middle" fill="#F4BF54" fontSize="4.5" fontFamily="Outfit" fontWeight="bold">
          TODAY
        </text>
        <line x1="8" y1="31" x2="28" y2="31" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.7" />
        <text x="18" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="3.5" fontFamily="Outfit">
          Fresh Dough
        </text>
        <text x="18" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="3.5" fontFamily="Outfit">
          Stone Baked
        </text>
        <text x="18" y="52" textAnchor="middle" fill="#E85D4A" fontSize="4" fontFamily="Outfit" fontWeight="bold">
          BUON APPETITO!
        </text>
      </g>
    </svg>
  );
};
