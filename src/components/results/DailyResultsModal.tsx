import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { getDayConfig } from '../../config/days';
import { RECIPE_DEFINITIONS } from '../../config/recipes';
import { UPGRADE_DEFINITIONS } from '../../config/upgrades';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Coins,
  Heart,
  Award,
} from 'lucide-react';

export const DailyResultsModal: React.FC = () => {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const currentDay = useGameStore((s) => s.currentDay);
  const dailyLedger = useGameStore((s) => s.dailyLedger);
  const coins = useGameStore((s) => s.coins);
  const customerSatisfaction = useGameStore((s) => s.customerSatisfaction);
  const startNextDay = useGameStore((s) => s.startNextDay);

  if (gamePhase !== 'DAY_RESULTS') return null;

  const currentConfig = getDayConfig(currentDay);
  const nextConfig = getDayConfig(currentDay + 1);

  // Newly unlocked recipes or upgrades on the upcoming day
  const newlyUnlockedRecipes = Object.values(RECIPE_DEFINITIONS).filter(
    (r) => r.unlockDay === currentDay + 1
  );
  const newlyUnlockedUpgrades = UPGRADE_DEFINITIONS.filter(
    (u) => u.unlockDay === currentDay + 1
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative z-10 w-full max-w-xl bg-[#FFFDF8] rounded-3xl border border-amber-900/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-[#FFF8EC] to-amber-50 border-b border-amber-200/80 text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Award size={14} className="text-[#E85D4A]" />
            <span>Shift Finished · Day {currentDay}</span>
          </div>

          <h2 className="text-2xl font-black text-[#302B29] font-['Outfit']">
            {dailyLedger.targetAchieved ? 'Target Crushed! Magnificent Shift!' : 'Shift Complete! Keep Going!'}
          </h2>

          <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
            {dailyLedger.targetAchieved
              ? `You earned the daily completion reward of +${currentConfig.completionBonus} coins!`
              : `Sales fell slightly short of the $${currentConfig.targetRevenue} goal, but your skills are growing.`}
          </p>
        </div>

        {/* Financial Ledger & Metrics Grid */}
        <div className="p-6 overflow-y-auto flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Orders Completed */}
            <div className="p-3 rounded-2xl bg-[#FFF8EC] border border-amber-200/70 text-center">
              <div className="flex items-center justify-center text-[#5E9B62] mb-1">
                <CheckCircle size={18} />
              </div>
              <div className="text-lg font-extrabold text-stone-900 tabular-nums font-mono">
                {dailyLedger.ordersCompleted}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Orders Served</div>
            </div>

            {/* Perfect Pizzas */}
            <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-center">
              <div className="flex items-center justify-center text-amber-500 mb-1">
                <Sparkles size={18} />
              </div>
              <div className="text-lg font-extrabold text-amber-950 tabular-nums font-mono">
                {dailyLedger.perfectPizzas}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Flawless Bakes</div>
            </div>

            {/* Orders Lost */}
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-center">
              <div className="flex items-center justify-center text-rose-500 mb-1">
                <XCircle size={18} />
              </div>
              <div className="text-lg font-extrabold text-rose-950 tabular-nums font-mono">
                {dailyLedger.ordersLost}
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Walkouts</div>
            </div>

            {/* Customer Satisfaction */}
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-center">
              <div className="flex items-center justify-center text-rose-500 mb-1">
                <Heart size={18} className="fill-rose-500" />
              </div>
              <div className="text-lg font-extrabold text-stone-900 tabular-nums font-mono">
                {customerSatisfaction}%
              </div>
              <div className="text-[11px] text-stone-500 font-medium">Satisfaction</div>
            </div>
          </div>

          {/* Detailed Financial Breakdown */}
          <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Financial Breakdown
            </h3>

            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center text-stone-700">
                <span>Gross Pizza Sales</span>
                <span className="font-mono tabular-nums font-semibold text-stone-900">
                  +${dailyLedger.grossRevenue}
                </span>
              </div>

              <div className="flex justify-between items-center text-stone-700">
                <span>Tips & Accolades</span>
                <span className="font-mono tabular-nums font-semibold text-[#5E9B62]">
                  +${dailyLedger.tipsEarned}
                </span>
              </div>

              {dailyLedger.targetAchieved && (
                <div className="flex justify-between items-center text-amber-800">
                  <span>Day Completion Bonus</span>
                  <span className="font-mono tabular-nums font-semibold">
                    +${currentConfig.completionBonus}
                  </span>
                </div>
              )}

              {dailyLedger.ingredientExpenses > 0 && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Pantry Ingredient Restocks</span>
                  <span className="font-mono tabular-nums font-semibold text-red-600">
                    -${dailyLedger.ingredientExpenses}
                  </span>
                </div>
              )}

              {dailyLedger.upgradeExpenses > 0 && (
                <div className="flex justify-between items-center text-stone-600">
                  <span>Equipment & Shop Upgrades</span>
                  <span className="font-mono tabular-nums font-semibold text-red-600">
                    -${dailyLedger.upgradeExpenses}
                  </span>
                </div>
              )}

              <div className="pt-2 mt-1 border-t border-stone-300 flex justify-between items-center font-bold text-sm">
                <span className="text-[#302B29]">Closing Vault Balance</span>
                <span className="font-mono tabular-nums text-amber-950 flex items-center gap-1">
                  <Coins size={15} className="text-amber-500" />
                  {coins} Coins
                </span>
              </div>
            </div>
          </div>

          {/* Unlocked tomorrow preview */}
          {(newlyUnlockedRecipes.length > 0 || newlyUnlockedUpgrades.length > 0) && (
            <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80">
              <span className="text-xs font-bold text-[#815C43] flex items-center gap-1 mb-1.5">
                <Sparkles size={14} className="text-[#F4BF54]" />
                Unlocking Tomorrow on Day {currentDay + 1}:
              </span>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {newlyUnlockedRecipes.map((r) => (
                  <span key={r.id} className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-stone-800 font-semibold text-[11px]">
                    🍕 Recipe: {r.name}
                  </span>
                ))}
                {newlyUnlockedUpgrades.map((u) => (
                  <span key={u.id} className="px-2 py-0.5 rounded-lg bg-white border border-amber-200 text-stone-800 font-semibold text-[11px]">
                    ⚡ Upgrade: {u.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tomorrow's Briefing */}
          <div className="text-xs text-stone-600 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
            <span className="font-bold text-[#815C43]">Tomorrow's Goal:</span>{' '}
            {nextConfig.narrativeIntro} Target revenue is{' '}
            <strong className="text-stone-900">${nextConfig.targetRevenue}</strong>.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FFF8EC] border-t border-amber-200/80 flex items-center justify-end">
          <button
            onClick={startNextDay}
            type="button"
            className="w-full sm:w-auto py-2.5 px-6 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Open Day {currentDay + 1} Shift</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
