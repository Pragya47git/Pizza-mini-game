import React from 'react';
import { INGREDIENT_DEFINITIONS } from '../../config/ingredients';
import { useGameStore } from '../../store/gameStore';
import { IngredientId } from '../../types/game';
import { Plus, Disc, Flame, Layers } from 'lucide-react';

export const IngredientControls: React.FC = () => {
  const inventory = useGameStore((s) => s.inventory);
  const currentPizza = useGameStore((s) => s.currentPizza);
  const unlockedRecipeIds = useGameStore((s) => s.unlockedRecipeIds);
  const currentDay = useGameStore((s) => s.currentDay);

  const addDough = useGameStore((s) => s.addDough);
  const addSauce = useGameStore((s) => s.addSauce);
  const addCheese = useGameStore((s) => s.addCheese);
  const addTopping = useGameStore((s) => s.addTopping);

  // Group ingredients
  const doughDef = INGREDIENT_DEFINITIONS.dough;
  const sauceDef = INGREDIENT_DEFINITIONS.tomato_sauce;

  const cheeseList: IngredientId[] = ['mozzarella', 'parmesan', 'cheddar', 'gorgonzola'];
  const toppingList: IngredientId[] = ['pepperoni', 'mushrooms', 'olives', 'bell_peppers', 'onions', 'basil'];

  // Filter based on unlock day
  const availableCheeses = cheeseList.filter((id) => INGREDIENT_DEFINITIONS[id].unlockDay <= currentDay);
  const availableToppings = toppingList.filter((id) => INGREDIENT_DEFINITIONS[id].unlockDay <= currentDay);

  const renderStockCount = (id: IngredientId) => {
    const count = inventory[id] || 0;
    const isLow = count <= 2;
    return (
      <span
        className={`text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded-md ${
          count === 0
            ? 'bg-red-100 text-red-700 font-bold'
            : isLow
            ? 'bg-amber-100 text-amber-800 font-semibold'
            : 'bg-stone-100 text-stone-600'
        }`}
      >
        {count} left
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 1. Base Dough & Sauce Row */}
      <div>
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Disc size={13} className="text-[#815C43]" />
          <span>Crust & Base Sauce</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* Dough Button */}
          <button
            onClick={addDough}
            disabled={currentPizza.hasDough || (inventory.dough || 0) <= 0}
            type="button"
            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              currentPizza.hasDough
                ? 'bg-amber-50/50 border-amber-300 opacity-80 cursor-default'
                : (inventory.dough || 0) <= 0
                ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                : 'bg-[#FFFDF8] border-amber-900/10 hover:border-[#815C43] hover:shadow-xs active:scale-98'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#F9E5BE] border border-[#D9A76A] flex items-center justify-center text-xs">
                🥖
              </span>
              <div>
                <div className="text-xs font-bold text-[#302B29]">Artisan Dough</div>
                {renderStockCount('dough')}
              </div>
            </div>
            {currentPizza.hasDough && <span className="text-[10px] text-[#5E9B62] font-bold">Ready</span>}
          </button>

          {/* Sauce Button */}
          <button
            onClick={addSauce}
            disabled={!currentPizza.hasDough || currentPizza.hasSauce || (inventory.tomato_sauce || 0) <= 0}
            type="button"
            className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
              currentPizza.hasSauce
                ? 'bg-red-50/50 border-red-300 opacity-80 cursor-default'
                : !currentPizza.hasDough || (inventory.tomato_sauce || 0) <= 0
                ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                : 'bg-[#FFFDF8] border-amber-900/10 hover:border-[#D83E2D] hover:shadow-xs active:scale-98'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#D83E2D] flex items-center justify-center text-xs text-white">
                🍅
              </span>
              <div>
                <div className="text-xs font-bold text-[#302B29]">Tomato Sauce</div>
                {renderStockCount('tomato_sauce')}
              </div>
            </div>
            {currentPizza.hasSauce && <span className="text-[10px] text-[#5E9B62] font-bold">Ladle Ready</span>}
          </button>
        </div>
      </div>

      {/* 2. Cheese Selection Row */}
      <div>
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Layers size={13} className="text-[#F4BF54]" />
          <span>Cheeses</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {availableCheeses.map((id) => {
            const def = INGREDIENT_DEFINITIONS[id];
            const stock = inventory[id] || 0;
            const isAdded = currentPizza.cheeses.includes(id);

            return (
              <button
                key={id}
                onClick={() => addCheese(id)}
                disabled={!currentPizza.hasDough || stock <= 0}
                type="button"
                className={`flex flex-col p-2 rounded-xl border text-left transition-all relative ${
                  isAdded
                    ? 'bg-amber-50 border-amber-400 ring-1 ring-amber-400/30'
                    : stock <= 0
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                    : 'bg-[#FFFDF8] border-amber-900/10 hover:border-amber-400 hover:shadow-2xs active:scale-98'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                    style={{ backgroundColor: def.color }}
                  />
                  {renderStockCount(id)}
                </div>
                <span className="text-xs font-bold text-[#302B29] truncate">{def.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Savory & Fresh Toppings */}
      <div>
        <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Flame size={13} className="text-[#E85D4A]" />
          <span>Toppings</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {availableToppings.map((id) => {
            const def = INGREDIENT_DEFINITIONS[id];
            const stock = inventory[id] || 0;
            const countOnPie = currentPizza.toppings.filter((t) => t === id).length;

            return (
              <button
                key={id}
                onClick={() => addTopping(id)}
                disabled={!currentPizza.hasDough || stock <= 0}
                type="button"
                className={`flex items-center justify-between p-2 rounded-xl border text-left transition-all ${
                  countOnPie > 0
                    ? 'bg-amber-50/60 border-amber-300'
                    : stock <= 0
                    ? 'bg-stone-50 border-stone-200 opacity-50 cursor-not-allowed'
                    : 'bg-[#FFFDF8] border-amber-900/10 hover:border-[#E85D4A] hover:shadow-2xs active:scale-98'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block border border-black/10 shrink-0"
                    style={{ backgroundColor: def.color }}
                  />
                  <span className="text-xs font-semibold text-[#302B29] truncate">{def.name}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {countOnPie > 0 && (
                    <span className="text-[10px] font-bold text-[#E85D4A] bg-red-50 px-1 rounded">
                      x{countOnPie}
                    </span>
                  )}
                  {renderStockCount(id)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
