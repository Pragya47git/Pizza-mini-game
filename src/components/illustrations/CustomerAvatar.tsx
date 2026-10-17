import React from 'react';
import { Customer } from '../../types/game';

interface CustomerAvatarProps {
  customer: Customer;
  size?: number;
  className?: string;
}

export const CustomerAvatar: React.FC<CustomerAvatarProps> = ({
  customer,
  size = 64,
  className = '',
}) => {
  const { skinTone, hairColor, shirtColor, accessory, expression } = customer.avatarStyle;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`rounded-full overflow-hidden shadow-inner ${className}`}
      style={{ backgroundColor: '#FDF6E2' }}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#FBF3DB" stroke="#E6D3A3" strokeWidth="3" />

      {/* Shoulders / Shirt */}
      <path
        d="M 18 96 C 22 74, 38 70, 50 70 C 62 70, 78 74, 82 96 Z"
        fill={shirtColor}
      />
      {/* Shirt Collar / V-neck */}
      <path
        d="M 44 70 L 50 80 L 56 70 Z"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Neck */}
      <rect x="44" y="58" width="12" height="15" rx="3" fill={skinTone} />

      {/* Head */}
      <ellipse cx="50" cy="46" rx="20" ry="22" fill={skinTone} />

      {/* Hair - Back Layer for longer hair if needed */}
      <path
        d="M 28 46 C 24 30, 34 16, 50 16 C 66 16, 76 30, 72 46 C 68 34, 32 34, 28 46 Z"
        fill={hairColor}
      />

      {/* Ears */}
      <circle cx="29" cy="48" r="4.5" fill={skinTone} />
      <circle cx="71" cy="48" r="4.5" fill={skinTone} />

      {/* Eyes */}
      {expression === 'impatient' ? (
        // Annoyed slightly angled eyes
        <g stroke="#302B29" strokeWidth="2.5" strokeLinecap="round">
          <line x1="39" y1="41" x2="45" y2="44" />
          <line x1="61" y1="41" x2="55" y2="44" />
          <circle cx="42" cy="46" r="2.2" fill="#302B29" stroke="none" />
          <circle cx="58" cy="46" r="2.2" fill="#302B29" stroke="none" />
        </g>
      ) : expression === 'excited' ? (
        // Happy star/sparkle or arched open eyes
        <g fill="#302B29">
          <circle cx="42" cy="44" r="3.2" />
          <circle cx="58" cy="44" r="3.2" />
          <circle cx="43.5" cy="42.5" r="1.2" fill="#FFFFFF" />
          <circle cx="59.5" cy="42.5" r="1.2" fill="#FFFFFF" />
        </g>
      ) : (
        // Friendly dot eyes
        <g fill="#302B29">
          <circle cx="42" cy="44" r="2.6" />
          <circle cx="58" cy="44" r="2.6" />
          <circle cx="43" cy="43" r="0.9" fill="#FFFFFF" />
          <circle cx="59" cy="43" r="0.9" fill="#FFFFFF" />
        </g>
      )}

      {/* Cheeks blush */}
      <circle cx="36" cy="50" r="3.5" fill="#E85D4A" opacity="0.3" />
      <circle cx="64" cy="50" r="3.5" fill="#E85D4A" opacity="0.3" />

      {/* Nose */}
      <path
        d="M 50 46 Q 52 50 49 52"
        fill="none"
        stroke="#815C43"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Mouth */}
      {expression === 'impatient' ? (
        <path
          d="M 44 59 Q 50 56 56 58"
          fill="none"
          stroke="#302B29"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      ) : expression === 'excited' ? (
        <path
          d="M 43 56 Q 50 64 57 56 Z"
          fill="#E85D4A"
          stroke="#302B29"
          strokeWidth="1.5"
        />
      ) : (
        <path
          d="M 44 57 Q 50 63 56 57"
          fill="none"
          stroke="#302B29"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Accessories */}
      {accessory === 'glasses' && (
        <g stroke="#302B29" strokeWidth="2.2" fill="none">
          <circle cx="42" cy="44" r="7" fill="rgba(255,255,255,0.2)" />
          <circle cx="58" cy="44" r="7" fill="rgba(255,255,255,0.2)" />
          <line x1="49" y1="44" x2="51" y2="44" />
          <line x1="35" y1="44" x2="29" y2="46" />
          <line x1="65" y1="44" x2="71" y2="46" />
        </g>
      )}

      {accessory === 'chef_band' && (
        <path
          d="M 30 32 Q 50 28 70 32 L 69 26 Q 50 22 31 26 Z"
          fill="#E85D4A"
          stroke="#B62C1D"
          strokeWidth="1.5"
        />
      )}

      {accessory === 'hat' && (
        <g>
          {/* Beret / Cap */}
          <path
            d="M 24 30 C 26 12, 74 12, 76 30 C 78 35, 68 37, 50 36 C 32 37, 22 35, 24 30 Z"
            fill="#5E9B62"
            stroke="#4A7A4D"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="14" r="3" fill="#F4BF54" />
        </g>
      )}

      {accessory === 'scarf' && (
        <path
          d="M 36 67 C 44 65, 56 65, 64 67 C 68 73, 62 76, 50 75 C 38 76, 32 73, 36 67 Z"
          fill="#E85D4A"
          stroke="#B62C1D"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
};
