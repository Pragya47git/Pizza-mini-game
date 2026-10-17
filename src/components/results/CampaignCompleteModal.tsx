import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGameStore } from '../../store/gameStore';
import { Trophy, Star, ArrowRight, RotateCcw, Award } from 'lucide-react';

export const CampaignCompleteModal: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const coins = useGameStore((s) => s.coins);
  const lifetimeRevenue = useGameStore((s) => s.lifetimeRevenue);
  const lifetimeOrders = useGameStore((s) => s.lifetimeOrders);
  const reputation = useGameStore((s) => s.reputation);
  const startNextDay = useGameStore((s) => s.startNextDay);
  const resetProgress = useGameStore((s) => s.resetProgress);

  useEffect(() => {
    if (gamePhase === 'CAMPAIGN_COMPLETE') {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E85D4A', '#F4BF54', '#5E9B62', '#FFF8EC'],
        });
      } catch {}
    }
  }, [gamePhase]);

  if (gamePhase !== 'CAMPAIGN_COMPLETE') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative z-10 w-full max-w-xl bg-[#FFFDF8] rounded-3xl border border-amber-900/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Championship Trophy Banner */}
        <div className="p-8 bg-gradient-to-br from-amber-500/20 via-[#FFF8EC] to-amber-100 text-center border-b border-amber-200">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-[#F4BF54] to-amber-300 flex items-center justify-center text-amber-950 shadow-md">
            <Trophy size={36} className="text-amber-900" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
            Campaign Victorious
          </span>

          <h2 className="text-3xl font-black text-[#302B29] font-['Outfit'] mt-1">
            Pizzeria of the Year!
          </h2>

          <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
            You completed 10 intensive shifts, mastered artisanal recipes, satisfied hundreds of hungry neighbors, and turned a humble kitchen into the neighborhood’s beloved trattoria!
          </p>
        </div>

        {/* Lifetime Accomplishments */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#FFF8EC] border border-amber-200/70">
              <span className="text-[11px] text-stone-500 font-semibold block mb-0.5">
                Total Pizzas Served
              </span>
              <span className="text-2xl font-black text-stone-900 font-mono tabular-nums">
                {lifetimeOrders}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70">
              <span className="text-[11px] text-stone-500 font-semibold block mb-0.5">
                Lifetime Revenue
              </span>
              <span className="text-2xl font-black text-amber-950 font-mono tabular-nums">
                ${lifetimeRevenue}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
              <span className="text-[11px] text-stone-500 font-semibold block mb-0.5">
                Trattoria Reputation
              </span>
              <span className="text-2xl font-black text-emerald-950 font-mono tabular-nums">
                {reputation} / 100
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[11px] text-stone-500 font-semibold block mb-0.5">
                Closing Vault
              </span>
              <span className="text-2xl font-black text-stone-900 font-mono tabular-nums">
                {coins} Coins
              </span>
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-stone-700 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
              <Award size={15} />
              <span>Master Chef Certification Awarded</span>
            </div>
            You can keep playing in <strong>Endless Master Mode</strong> (Day 11+) to continue serving high-stakes orders, or start fresh anytime.
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-[#FFF8EC] border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={resetProgress}
            type="button"
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>New Game</span>
          </button>

          <button
            onClick={startNextDay}
            type="button"
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Continue in Endless Mode (Day 11)</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
