import React from 'react';
import { CustomerCard } from './CustomerCard';
import { useGameStore } from '../../store/gameStore';
import { RECIPE_DEFINITIONS } from '../../config/recipes';
import { INGREDIENT_DEFINITIONS } from '../../config/ingredients';
import { Users, Info } from 'lucide-react';
import { IngredientId } from '../../types/game';

export const CustomerQueue: React.FC = () => {
  const activeOrders = useGameStore((s) => s.activeOrders);
  const selectedOrderId = useGameStore((s) => s.selectedOrderId);
  const selectOrder = useGameStore((s) => s.selectOrder);

  const selectedOrder = activeOrders.find((o) => o.id === selectedOrderId) || activeOrders[0];
  const selectedRecipe = selectedOrder ? RECIPE_DEFINITIONS[selectedOrder.recipeId] : null;

  return (
    <div className="flex flex-col h-full gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-[#E85D4A]" />
          <h2 className="text-sm font-bold text-[#302B29] font-['Outfit']">
            Waiting Guests ({activeOrders.length})
          </h2>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[280px] lg:max-h-[340px] pr-1">
        {activeOrders.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-[#FFFDF8] border border-amber-900/10 text-stone-500 text-xs flex flex-col items-center justify-center min-h-[140px]">
            <span className="text-2xl mb-1">🛎️</span>
            <p className="font-semibold text-stone-600">The counter is quiet</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Next guest arriving shortly...</p>
          </div>
        ) : (
          activeOrders.map((order) => (
            <CustomerCard
              key={order.id}
              order={order}
              isSelected={order.id === selectedOrderId}
              onSelect={() => selectOrder(order.id)}
            />
          ))
        )}
      </div>

      {/* Selected Order Recipe Ticket (Cheat Sheet / Order Ticket) */}
      {selectedRecipe && selectedOrder && (
        <div className="p-3.5 bg-[#FFF8EC] border border-amber-200/80 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800">
                Order Ticket
              </span>
              <h3 className="text-xs font-bold text-[#302B29] font-['Outfit']">
                {selectedRecipe.name}
              </h3>
            </div>
            <span className="text-xs font-extrabold text-[#5E9B62]">
              +${selectedRecipe.basePrice}
            </span>
          </div>

          <div className="text-[11px] text-stone-600 mb-2">
            Required ingredients:
          </div>

          <div className="flex flex-wrap gap-1.5">
            {Object.entries(selectedRecipe.requiredIngredients)
              .filter(([_, count]) => count > 0)
              .map(([ingId]) => {
                const def = INGREDIENT_DEFINITIONS[ingId as IngredientId];
                return (
                  <span
                    key={ingId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-medium bg-[#FFFDF8] border border-amber-900/10 text-[#302B29]"
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: def?.color || '#D83E2D' }}
                    />
                    {def?.name || ingId}
                  </span>
                );
              })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-stone-500">
            <span className="flex items-center gap-1">
              <Info size={12} />
              Ideal Bake: {selectedRecipe.idealCookingDuration}s
            </span>
            <span className="font-semibold text-amber-800">
              +{selectedRecipe.perfectOrderBonus} Perfect Bonus
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
