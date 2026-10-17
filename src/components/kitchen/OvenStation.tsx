import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { evaluateCookingState } from '../../domain/cooking';
import { OvenSvg } from '../illustrations/OvenSvg';
import { Flame, Clock, HandMetal, AlertCircle } from 'lucide-react';

export const OvenStation: React.FC = () => {
  const ovenSlots = useGameStore((s) => s.ovenSlots);
  const removePizzaFromOven = useGameStore((s) => s.removePizzaFromOven);
  const tutorialStep = useGameStore((s) => s.tutorialStep);

  const hasAnyCooking = ovenSlots.some((s) => s.isCooking);

  return (
    <div className="flex flex-col bg-[#FFFDF8] border border-amber-900/10 rounded-3xl p-4 shadow-sm gap-3">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-100">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-[#E85D4A]" />
          <h2 className="text-sm font-bold text-[#302B29] font-['Outfit']">
            Brick Oven ({ovenSlots.length} {ovenSlots.length === 1 ? 'Deck' : 'Decks'})
          </h2>
        </div>
      </div>

      {/* Oven Visual Artwork */}
      <div className="relative w-full max-w-[200px] mx-auto py-1">
        <OvenSvg isCooking={hasAnyCooking} />
      </div>

      {/* Slots List */}
      <div className="flex flex-col gap-2.5">
        {ovenSlots.map((slot) => {
          if (!slot.isCooking || !slot.pizza) {
            return (
              <div
                key={slot.slotIndex}
                className="p-3 rounded-2xl border border-dashed border-stone-200 bg-stone-50/70 text-center flex items-center justify-between"
              >
                <div className="text-left">
                  <span className="text-xs font-bold text-stone-500 font-['Outfit']">
                    Deck #{slot.slotIndex + 1}
                  </span>
                  <p className="text-[11px] text-stone-400">Empty & Preheated (485°C)</p>
                </div>
                <span className="text-xs text-stone-400 font-medium">Ready</span>
              </div>
            );
          }

          const cookingEval = evaluateCookingState(slot.cookingTime, slot.targetCookingTime);
          const isGolden = cookingEval.quality === 'perfect';
          const isBurnt = cookingEval.quality === 'burnt';

          return (
            <div
              key={slot.slotIndex}
              className={`p-3 rounded-2xl border transition-all ${
                isGolden
                  ? 'bg-emerald-50/80 border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                  : isBurnt
                  ? 'bg-red-50 border-red-300'
                  : 'bg-[#FFFDF8] border-amber-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#302B29] font-['Outfit']">
                    Deck #{slot.slotIndex + 1}
                  </span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${cookingEval.badgeColor}25`,
                      color: cookingEval.quality === 'perfect' ? '#065F46' : cookingEval.quality === 'burnt' ? '#991B1B' : '#854D0E',
                    }}
                  >
                    {cookingEval.statusText}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono font-bold tabular-nums text-stone-700">
                  <Clock size={12} className="text-stone-400" />
                  {slot.cookingTime.toFixed(1)}s / {slot.targetCookingTime}s
                </div>
              </div>

              {/* Progress Bar with Quality Windows */}
              <div className="relative w-full h-2.5 bg-stone-200 rounded-full overflow-hidden mb-2">
                {/* 70% to 100% Perfect Window Marker */}
                <div
                  className="absolute top-0 bottom-0 bg-emerald-200 opacity-60 pointer-events-none"
                  style={{ left: '70%', width: '30%' }}
                  title="Golden Crust Window"
                />
                <div
                  className={`h-full transition-all duration-150 ${
                    isGolden
                      ? 'bg-emerald-500'
                      : isBurnt
                      ? 'bg-stone-900'
                      : cookingEval.quality === 'overcooked'
                      ? 'bg-amber-600'
                      : 'bg-[#E85D4A]'
                  }`}
                  style={{ width: `${Math.min(100, (slot.cookingTime / slot.targetCookingTime) * 100)}%` }}
                />
              </div>

              {/* Take Out Button */}
              <button
                onClick={() => removePizzaFromOven(slot.slotIndex)}
                type="button"
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                  isGolden || tutorialStep === 6
                    ? 'bg-[#10B981] hover:bg-[#059669] text-white animate-pulse ring-2 ring-emerald-500/40'
                    : isBurnt
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                }`}
              >
                <HandMetal size={14} />
                <span>Pull From Oven</span>
                {isGolden && <span className="text-[10px] bg-white/20 px-1 rounded">PERFECT!</span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
