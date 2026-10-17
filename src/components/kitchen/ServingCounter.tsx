import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { evaluateCookingState } from '../../domain/cooking';
import { PizzaSvg } from '../illustrations/PizzaSvg';
import { CheckCircle2, Trash2, UtensilsCrossed, AlertTriangle } from 'lucide-react';
import { RECIPE_DEFINITIONS } from '../../config/recipes';

export const ServingCounter: React.FC = () => {
  const completedPizzas = useGameStore((s) => s.completedPizzas);
  const activeOrders = useGameStore((s) => s.activeOrders);
  const selectedOrderId = useGameStore((s) => s.selectedOrderId);
  const serveOrder = useGameStore((s) => s.serveOrder);
  const discardCompletedPizza = useGameStore((s) => s.discardCompletedPizza);
  const tutorialStep = useGameStore((s) => s.tutorialStep);

  const selectedOrder = activeOrders.find((o) => o.id === selectedOrderId) || activeOrders[0];
  const targetRecipe = selectedOrder ? RECIPE_DEFINITIONS[selectedOrder.recipeId] : null;

  return (
    <div className="flex flex-col bg-[#FFFDF8] border border-amber-900/10 rounded-3xl p-4 shadow-sm gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-[#5E9B62]" />
          <h2 className="text-sm font-bold text-[#302B29] font-['Outfit']">
            Serving Counter ({completedPizzas.length})
          </h2>
        </div>
      </div>

      {completedPizzas.length === 0 ? (
        <div className="p-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50/50 text-center flex flex-col items-center justify-center min-h-[120px]">
          <span className="text-2xl mb-1">🪵</span>
          <p className="text-xs font-semibold text-stone-600">Counter is clean</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Baked pizzas will appear here to serve</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {completedPizzas.map((item) => {
            const cookingEval = evaluateCookingState(item.cookingTime, targetRecipe ? targetRecipe.idealCookingDuration : 8);

            return (
              <div
                key={item.id}
                className="p-3 bg-[#FFF8EC] border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
              >
                {/* Mini Pizza Visual Preview */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <PizzaSvg
                    pizza={item.pizza}
                    size={64}
                    cookingQuality={cookingEval.quality}
                    showCuttingGuides={true}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-md inline-block"
                      style={{
                        backgroundColor: `${cookingEval.badgeColor}25`,
                        color: cookingEval.quality === 'perfect' ? '#065F46' : cookingEval.quality === 'burnt' ? '#991B1B' : '#854D0E',
                      }}
                    >
                      {cookingEval.statusText}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {item.cookingTime.toFixed(1)}s bake
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-stone-800 truncate mt-1">
                    {item.pizza.toppings.length === 0
                      ? 'Cheese Pie'
                      : `${item.pizza.toppings.length} toppings`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      if (selectedOrder) {
                        serveOrder(selectedOrder.id, item.id);
                      }
                    }}
                    disabled={!selectedOrder}
                    type="button"
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                      !selectedOrder
                        ? 'bg-stone-300 cursor-not-allowed'
                        : tutorialStep === 7
                        ? 'bg-[#5E9B62] hover:bg-[#4E8452] animate-bounce ring-4 ring-[#5E9B62]/30'
                        : 'bg-[#5E9B62] hover:bg-[#4E8452] active:scale-98'
                    }`}
                  >
                    <CheckCircle2 size={14} />
                    <span>Serve</span>
                  </button>

                  <button
                    onClick={() => discardCompletedPizza(item.id)}
                    type="button"
                    className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Discard pizza"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <div className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-xl border border-stone-200/80 flex items-center gap-1.5">
          <span className="text-amber-600 font-bold">Target Guest:</span>
          <span className="font-semibold text-stone-800">{selectedOrder.customer.name}</span>
          <span className="text-stone-400">({RECIPE_DEFINITIONS[selectedOrder.recipeId]?.name})</span>
        </div>
      )}
    </div>
  );
};
