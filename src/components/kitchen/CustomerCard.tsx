import React from 'react';
import { CustomerOrder } from '../../types/game';
import { RECIPE_DEFINITIONS } from '../../config/recipes';
import { CustomerAvatar } from '../illustrations/CustomerAvatar';
import { Clock, Star, Zap } from 'lucide-react';

interface CustomerCardProps {
  order: CustomerOrder;
  isSelected: boolean;
  onSelect: () => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ order, isSelected, onSelect }) => {
  const recipe = RECIPE_DEFINITIONS[order.recipeId];
  const patiencePercent = Math.max(0, Math.min(100, (order.patienceRemaining / order.totalPatience) * 100));

  let patienceBarColor = 'bg-[#5E9B62]';
  if (patiencePercent < 30) {
    patienceBarColor = 'bg-[#E85D4A] animate-pulse';
  } else if (patiencePercent < 60) {
    patienceBarColor = 'bg-[#F4BF54]';
  }

  // Customer type styling
  const typeLabels = {
    regular: null,
    impatient: { label: 'Impatient', icon: <Clock size={12} />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
    generous: { label: 'Big Tipper', icon: <Star size={12} />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    vip: { label: 'VIP Critic', icon: <Star size={12} />, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    special_request: { label: 'Custom', icon: <Zap size={12} />, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  };

  const badge = typeLabels[order.customer.type];

  return (
    <div
      onClick={onSelect}
      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none text-left relative ${
        isSelected
          ? 'bg-[#FFFDF8] border-[#E85D4A] shadow-md ring-2 ring-[#E85D4A]/20 scale-[1.01]'
          : 'bg-[#FFFDF8]/90 border-amber-900/10 hover:border-amber-300 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <CustomerAvatar customer={order.customer} size={48} className="shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-bold text-[#302B29] truncate font-['Outfit']">
              {order.customer.name}
            </span>
            <span className="text-xs font-extrabold text-[#5E9B62] tabular-nums font-mono">
              ${recipe?.basePrice || 16}
            </span>
          </div>

          <div className="text-xs font-semibold text-[#815C43] truncate mt-0.5">
            {recipe?.name || 'Custom Pie'}
          </div>

          {/* Patience Bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5">
              <span>Patience</span>
              <span className="tabular-nums font-mono font-bold">
                {Math.ceil(order.patienceRemaining)}s
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${patienceBarColor}`}
                style={{ width: `${patiencePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {badge && (
        <div className="mt-2 pt-1.5 border-t border-amber-50 flex items-center justify-between text-[11px]">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-semibold ${badge.color}`}>
            {badge.icon}
            {badge.label}
          </span>
          {order.specialRequest && (
            <span className="text-[10px] text-stone-500 italic">
              Req: {order.specialRequest.replace(/_/g, ' ')}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
