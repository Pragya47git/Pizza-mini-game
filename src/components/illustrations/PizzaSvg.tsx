import React from 'react';
import { CookingQuality, IngredientId, PreparedPizza } from '../../types/game';

interface PizzaSvgProps {
  pizza: PreparedPizza;
  size?: number;
  cookingQuality?: CookingQuality;
  showCuttingGuides?: boolean;
  className?: string;
}

export const PizzaSvg: React.FC<PizzaSvgProps> = ({
  pizza,
  size = 220,
  cookingQuality = 'raw',
  showCuttingGuides = false,
  className = '',
}) => {
  const { hasDough, hasSauce, cheeses, toppings, toppingPlacements } = pizza;

  // Determine crust and bake overlay color
  let crustColor = '#F7DCB0';
  let crustStroke = '#DCA364';
  let bakeOverlayOpacity = 0;
  let bakeOverlayColor = 'transparent';

  switch (cookingQuality) {
    case 'undercooked':
      crustColor = '#FDF0D5';
      crustStroke = '#E6C587';
      break;
    case 'perfect':
      crustColor = '#D97706';
      crustStroke = '#B45309';
      bakeOverlayColor = '#92400E';
      bakeOverlayOpacity = 0.12;
      break;
    case 'overcooked':
      crustColor = '#92400E';
      crustStroke = '#78350F';
      bakeOverlayColor = '#451A03';
      bakeOverlayOpacity = 0.28;
      break;
    case 'burnt':
      crustColor = '#262626';
      crustStroke = '#171717';
      bakeOverlayColor = '#0A0A0A';
      bakeOverlayOpacity = 0.65;
      break;
    default:
      crustColor = '#F7DCB0';
      crustStroke = '#DCA364';
      break;
  }

  const renderSingleTopping = (id: IngredientId, x: number, y: number, rot: number, scale: number, key: string) => {
    const transform = `translate(${50 + x}, ${50 + y}) rotate(${rot}) scale(${scale})`;

    switch (id) {
      case 'pepperoni':
        return (
          <g key={key} transform={transform}>
            <circle cx="0" cy="0" r="5" fill="#B62C1D" stroke="#881A0E" strokeWidth="0.8" />
            <circle cx="-1.5" cy="-1.5" r="1.2" fill="#D94E34" opacity="0.6" />
            <circle cx="1.8" cy="1.2" r="0.7" fill="#601008" />
            <circle cx="-1" cy="2" r="0.6" fill="#601008" />
          </g>
        );

      case 'mushrooms':
        return (
          <g key={key} transform={transform}>
            {/* Mushroom cap and stem */}
            <path
              d="M -4.5 1 C -4.5 -3.5, 4.5 -3.5, 4.5 1 C 4.5 2, 2 2.5, 0 2.5 C -2 2.5, -4.5 2, -4.5 1 Z"
              fill="#D4C2AB"
              stroke="#8C7761"
              strokeWidth="0.7"
            />
            <path d="M -1.5 2 L -1.2 5 L 1.2 5 L 1.5 2 Z" fill="#EFE8DD" stroke="#8C7761" strokeWidth="0.6" />
            <circle cx="-1.5" cy="-0.5" r="0.8" fill="#8C7761" opacity="0.4" />
          </g>
        );

      case 'olives':
        return (
          <g key={key} transform={transform}>
            <circle cx="0" cy="0" r="3.8" fill="#2C2B38" stroke="#181820" strokeWidth="0.7" />
            <circle cx="0" cy="0" r="1.6" fill="#D83E2D" opacity="0.85" />
          </g>
        );

      case 'bell_peppers':
        return (
          <g key={key} transform={transform}>
            <path
              d="M -4.5 -2.5 C -1.5 -4.5, 3 -3, 4.5 0 C 3.5 1.5, 0.5 0.5, -2.5 1.5 C -4 2, -5 -1, -4.5 -2.5 Z"
              fill="#4FA55A"
              stroke="#2C6D34"
              strokeWidth="0.7"
            />
            <path d="M -3 -1.5 Q 0 -2.5 3 -0.5" fill="none" stroke="#78C682" strokeWidth="0.7" />
          </g>
        );

      case 'onions':
        return (
          <g key={key} transform={transform}>
            <path
              d="M -5 -2 Q 0 -5 5 -1 Q 0 -3 -5 -2"
              fill="#9C3A69"
              stroke="#6B1B41"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M -4 -1.5 Q 0 -3.8 4 -0.5"
              fill="none"
              stroke="#DDA0DD"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          </g>
        );

      case 'basil':
        return (
          <g key={key} transform={transform}>
            <path
              d="M 0 -4.5 C 3.5 -3, 3.5 3, 0 4.5 C -3.5 3, -3.5 -3, 0 -4.5 Z"
              fill="#559A44"
              stroke="#346B26"
              strokeWidth="0.7"
            />
            <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke="#75BE62" strokeWidth="0.6" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none transition-transform duration-200 ${className}`}
    >
      <defs>
        {/* Crust Drop Shadow */}
        <filter id={`pizza-shadow-${size}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#302B29" floodOpacity="0.22" />
        </filter>

        {/* Sauce flecks pattern */}
        <radialGradient id={`sauce-grad-${size}`} cx="45%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#E64A38" />
          <stop offset="70%" stopColor="#D83E2D" />
          <stop offset="100%" stopColor="#A82516" />
        </radialGradient>

        {/* Cheese melt pattern */}
        <radialGradient id={`cheese-grad-${size}`} cx="40%" cy="38%" r="55%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="65%" stopColor="#FFF4D0" />
          <stop offset="100%" stopColor="#F5DC92" />
        </radialGradient>
      </defs>

      {/* Dough / Crust Base */}
      {hasDough ? (
        <g filter={`url(#pizza-shadow-${size})`}>
          {/* Main Crust Outer Circle */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={crustColor}
            stroke={crustStroke}
            strokeWidth="3.5"
          />

          {/* Crust blistering & bubbles */}
          <circle cx="28" cy="22" r="1.8" fill={crustStroke} opacity="0.45" />
          <circle cx="72" cy="30" r="2.2" fill={crustStroke} opacity="0.45" />
          <circle cx="80" cy="62" r="1.5" fill={crustStroke} opacity="0.5" />
          <circle cx="36" cy="82" r="2" fill={crustStroke} opacity="0.4" />
          <circle cx="18" cy="55" r="1.6" fill={crustStroke} opacity="0.5" />
        </g>
      ) : (
        /* Empty wooden prep board placeholder */
        <g>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="#F7EDE0"
            stroke="#D6C4AD"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          <text
            x="50"
            y="52"
            textAnchor="middle"
            fill="#A38F78"
            fontSize="7"
            fontFamily="Outfit, sans-serif"
            fontWeight="600"
          >
            Roll Out Dough
          </text>
        </g>
      )}

      {/* Tomato Sauce Layer */}
      {hasDough && hasSauce && (
        <g>
          <circle cx="50" cy="50" r="38" fill={`url(#sauce-grad-${size})`} />
          {/* Herb specks */}
          <circle cx="42" cy="36" r="0.6" fill="#3D5A34" opacity="0.7" />
          <circle cx="62" cy="44" r="0.5" fill="#3D5A34" opacity="0.7" />
          <circle cx="36" cy="60" r="0.7" fill="#3D5A34" opacity="0.7" />
          <circle cx="54" cy="64" r="0.6" fill="#3D5A34" opacity="0.7" />
          <circle cx="58" cy="32" r="0.5" fill="#3D5A34" opacity="0.7" />
        </g>
      )}

      {/* Cheese Layer */}
      {hasDough && cheeses.length > 0 && (
        <g>
          {/* Melted Mozzarella Base */}
          {cheeses.includes('mozzarella') && (
            <path
              d="M 50 16
                 C 62 16, 74 24, 79 35
                 C 84 46, 82 60, 75 70
                 C 68 80, 54 84, 42 82
                 C 30 80, 20 72, 17 60
                 C 14 48, 18 34, 27 24
                 C 35 15, 45 16, 50 16 Z"
              fill={`url(#cheese-grad-${size})`}
              opacity="0.94"
            />
          )}

          {/* Golden Cheddar Swirls */}
          {cheeses.includes('cheddar') && (
            <g fill="#F9A825" opacity="0.8">
              <ellipse cx="44" cy="38" rx="6" ry="3" transform="rotate(25 44 38)" />
              <ellipse cx="60" cy="55" rx="7" ry="3.5" transform="rotate(-15 60 55)" />
              <ellipse cx="38" cy="64" rx="5" ry="2.5" transform="rotate(45 38 64)" />
              <ellipse cx="56" cy="34" rx="5.5" ry="2.8" transform="rotate(-30 56 34)" />
            </g>
          )}

          {/* Aged Parmesan Flakes */}
          {cheeses.includes('parmesan') && (
            <g fill="#FFFDE7" stroke="#F0E68C" strokeWidth="0.5">
              <rect x="34" y="44" width="4" height="2" transform="rotate(12 34 44)" />
              <rect x="52" y="48" width="4" height="2" transform="rotate(70 52 48)" />
              <rect x="46" y="28" width="4" height="2" transform="rotate(-25 46 28)" />
              <rect x="64" y="42" width="4" height="2" transform="rotate(40 64 42)" />
              <rect x="48" y="70" width="4" height="2" transform="rotate(-45 48 70)" />
            </g>
          )}

          {/* Gorgonzola Crumbles */}
          {cheeses.includes('gorgonzola') && (
            <g fill="#6B9080" opacity="0.85">
              <circle cx="48" cy="40" r="1.5" />
              <circle cx="58" cy="48" r="1.8" />
              <circle cx="38" cy="52" r="1.4" />
              <circle cx="44" cy="62" r="1.6" />
              <circle cx="62" cy="36" r="1.5" />
            </g>
          )}
        </g>
      )}

      {/* Render Toppings using deterministic coordinate placements */}
      {hasDough && toppingPlacements.map((p, idx) =>
        renderSingleTopping(p.ingredientId, p.x, p.y, p.rotation, p.scale, `top_${idx}_${p.ingredientId}`)
      )}

      {/* Bake Oven Quality Tint Overlay */}
      {bakeOverlayOpacity > 0 && (
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={bakeOverlayColor}
          opacity={bakeOverlayOpacity}
          style={{ mixBlendMode: 'multiply' }}
        />
      )}

      {/* Slicing Lines Guide */}
      {showCuttingGuides && hasDough && (
        <g stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.6">
          <line x1="50" y1="8" x2="50" y2="92" />
          <line x1="8" y1="50" x2="92" y2="50" />
          <line x1="20" y1="20" x2="80" y2="80" />
          <line x1="20" y1="80" x2="80" y2="20" />
        </g>
      )}
    </svg>
  );
};
