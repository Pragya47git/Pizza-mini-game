import React from 'react';
import { PizzaSvg } from '../illustrations/PizzaSvg';
import { IngredientControls } from './IngredientControls';
import { useGameStore } from '../../store/gameStore';
import { RotateCcw, ArrowRight, ChefHat, Check } from 'lucide-react';
import { INGREDIENT_DEFINITIONS } from '../../config/ingredients';

export const PizzaBuilder: React.FC = () => {
  const currentPizza = useGameStore((s) => s.currentPizza);
  const resetPizza = useGameStore((s) => s.resetPizza);
  const placePizzaInOven = useGameStore((s) => s.placePizzaInOven);
  const tutorialStep = useGameStore((s) => s.tutorialStep);

  const hasItems = currentPizza.hasDough || currentPizza.toppings.length > 0;

  return (
    <div className="flex flex-col h-full bg-[#FFFDF8] border border-amber-900/10 rounded-3xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <ChefHat size={18} className="text-[#815C43]" />
          <h2 className="text-sm font-bold text-[#302B29] font-['Outfit']">
            Prep Station
          </h2>
        </div>

        {/* Action Buttons: Reset & Put in Oven */}
        <div className="flex items-center gap-2">
          <button
            onClick={resetPizza}
            disabled={!hasItems}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Clear and discard current pizza assembly"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>

          <button
            onClick={() => placePizzaInOven()}
            disabled={!currentPizza.hasDough}
            type="button"
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
              !currentPizza.hasDough
                ? 'bg-stone-300 cursor-not-allowed'
                : tutorialStep === 5
                ? 'bg-[#E85D4A] hover:bg-[#D44B38] animate-bounce ring-4 ring-[#E85D4A]/30'
                : 'bg-[#E85D4A] hover:bg-[#D44B38] active:scale-98'
            }`}
          >
            <span>Slide to Oven</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Center Pizza Prep Stage */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-3 border-b border-amber-100 bg-[#FFF8EC]/40 rounded-2xl my-3">
        {/* Large Interactive Pizza Canvas */}
        <div className="relative flex items-center justify-center p-2">
          <PizzaSvg pizza={currentPizza} size={190} />
        </div>

        {/* Current Assembly Recipe Layers Summary */}
        <div className="flex flex-col gap-1.5 min-w-[160px] text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
            Current Layers
          </span>

          <div className="flex items-center gap-1.5 text-stone-700">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${currentPizza.hasDough ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-400'}`}>
              {currentPizza.hasDough ? <Check size={10} /> : '—'}
            </span>
            <span className={currentPizza.hasDough ? 'font-semibold text-stone-900' : 'text-stone-400'}>
              Dough Base
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-700">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${currentPizza.hasSauce ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-400'}`}>
              {currentPizza.hasSauce ? <Check size={10} /> : '—'}
            </span>
            <span className={currentPizza.hasSauce ? 'font-semibold text-stone-900' : 'text-stone-400'}>
              Tomato Sauce
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-stone-700">
            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${currentPizza.cheeses.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-400'}`}>
              {currentPizza.cheeses.length > 0 ? <Check size={10} /> : '—'}
            </span>
            <span className={currentPizza.cheeses.length > 0 ? 'font-semibold text-stone-900' : 'text-stone-400'}>
              {currentPizza.cheeses.length > 0 ? currentPizza.cheeses.map(c => INGREDIENT_DEFINITIONS[c]?.name).join(', ') : 'No Cheese'}
            </span>
          </div>

          <div className="mt-1 pt-1 border-t border-amber-200/50">
            <div className="text-[10px] text-stone-500 mb-1">Toppings ({currentPizza.toppings.length}):</div>
            {currentPizza.toppings.length === 0 ? (
              <span className="text-[11px] text-stone-400 italic">None yet</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {currentPizza.toppings.map((t, idx) => (
                  <span
                    key={`${t}_${idx}`}
                    className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100/70 text-amber-900"
                  >
                    {INGREDIENT_DEFINITIONS[t]?.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ingredient Selector Controls */}
      <div className="flex-1 overflow-y-auto">
        <IngredientControls />
      </div>
    </div>
  );
};
