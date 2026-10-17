import React from 'react';

interface OvenSvgProps {
  isCooking?: boolean;
  className?: string;
}

export const OvenSvg: React.FC<OvenSvgProps> = ({ isCooking = false, className = '' }) => {
  return (
    <svg
      viewBox="0 0 160 140"
      className={`w-full h-auto select-none ${className}`}
    >
      <defs>
        {/* Fire glow */}
        <radialGradient id="fire-glow" cx="50%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#FFF176" />
          <stop offset="40%" stopColor="#FF7043" />
          <stop offset="80%" stopColor="#D84315" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>

        <linearGradient id="brick-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B2533E" />
          <stop offset="50%" stopColor="#8F3C2C" />
          <stop offset="100%" stopColor="#67281D" />
        </linearGradient>

        <linearGradient id="hearth-stone" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
      </defs>

      {/* Chimney */}
      <rect x="68" y="6" width="24" height="26" fill="#8F3C2C" stroke="#67281D" strokeWidth="2" rx="2" />
      <rect x="64" y="4" width="32" height="6" fill="#67281D" rx="2" />

      {/* Subtle smoke puffs if active */}
      {isCooking && (
        <g opacity="0.6">
          <circle cx="76" cy="1" r="3" fill="#D7CCC8" opacity="0.6" />
          <circle cx="84" cy="-3" r="4.5" fill="#D7CCC8" opacity="0.4" />
        </g>
      )}

      {/* Brick Dome Outer */}
      <path
        d="M 15 130
           C 15 50, 45 28, 80 28
           C 115 28, 145 50, 145 130
           Z"
        fill="url(#brick-grad)"
        stroke="#4E1D15"
        strokeWidth="3"
      />

      {/* Brick Joint Lines */}
      <g stroke="#532219" strokeWidth="1.2" opacity="0.5">
        <path d="M 30 70 Q 80 60 130 70" fill="none" />
        <path d="M 22 95 Q 80 85 138 95" fill="none" />
        <path d="M 18 115 Q 80 108 142 115" fill="none" />
        <line x1="55" y1="28" x2="52" y2="70" />
        <line x1="105" y1="28" x2="108" y2="70" />
        <line x1="40" y1="70" x2="38" y2="95" />
        <line x1="75" y1="65" x2="75" y2="90" />
        <line x1="120" y1="70" x2="122" y2="95" />
      </g>

      {/* Oven Mouth Arch Ring */}
      <path
        d="M 36 130
           C 36 78, 56 62, 80 62
           C 104 62, 124 78, 124 130
           Z"
        fill="#261915"
        stroke="#F4BF54"
        strokeWidth="2.5"
      />

      {/* Inner Chamber with Fire Glow */}
      <path
        d="M 40 130
           C 40 84, 58 70, 80 70
           C 102 70, 120 84, 120 130
           Z"
        fill={isCooking ? 'url(#fire-glow)' : '#1A100E'}
      />

      {/* Burning Fire Flames (animated or glowing when active) */}
      {isCooking && (
        <g>
          {/* Flame 1 */}
          <path
            d="M 64 128 C 62 105, 74 100, 72 88 C 76 96, 82 102, 78 128 Z"
            fill="#FFF176"
            opacity="0.9"
          />
          {/* Flame 2 */}
          <path
            d="M 74 128 C 72 108, 86 98, 84 82 C 90 94, 96 106, 90 128 Z"
            fill="#FFB74D"
            opacity="0.95"
          />
          {/* Flame 3 */}
          <path
            d="M 86 128 C 88 112, 100 106, 96 92 C 102 104, 104 114, 98 128 Z"
            fill="#FF7043"
            opacity="0.9"
          />
        </g>
      )}

      {/* Oven Stone Hearth Base */}
      <rect x="10" y="128" width="140" height="12" fill="url(#hearth-stone)" stroke="#3E2723" strokeWidth="2" rx="3" />
    </svg>
  );
};
