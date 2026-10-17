import React from 'react';
import { Pause, Play, Coins, TrendingUp, Heart, ShoppingBag, Wrench, BookOpen, AlertTriangle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { SoundToggle } from '../common/SoundToggle';

interface GameHeaderProps {
  onOpenSupplies: () => void;
  onOpenUpgrades: () => void;
  onOpenRecipes: () => void;
  onOpenEmergency: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onOpenSupplies,
  onOpenUpgrades,
  onOpenRecipes,
  onOpenEmergency,
}) => {
  const currentDay = useGameStore((s) => s.currentDay);
  const shiftTimeRemaining = useGameStore((s) => s.shiftTimeRemaining);
  const coins = useGameStore((s) => s.coins);
  const grossRevenue = useGameStore((s) => s.dailyLedger.grossRevenue);
  const targetRevenue = useGameStore((s) => s.dailyLedger.targetRevenue);
  const customerSatisfaction = useGameStore((s) => s.customerSatisfaction);
  const isPaused = useGameStore((s) => s.isPaused);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const inventory = useGameStore((s) => s.inventory);

  const minutes = Math.floor(shiftTimeRemaining / 60);
  const seconds = Math.floor(shiftTimeRemaining % 60);
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Check if player is low on supplies and money
  const isLowSupply = (inventory.dough || 0) <= 1 || (inventory.mozzarella || 0) <= 1;
  const isBroke = coins < 12;
  const showBailoutAlert = isLowSupply && isBroke;

  return (
    <header className="w-full bg-[#FFFDF8] border-b border-amber-900/10 px-4 py-2.5 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#E85D4A] flex items-center justify-center text-white font-['Outfit'] font-black text-lg shadow-sm">
            🍕
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-[#302B29] font-['Outfit'] leading-none">
              PIZZA RUSH
            </h1>
            <span className="text-[11px] font-semibold text-[#815C43]">
              Day {currentDay} Shift
            </span>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-2 sm:gap-4 text-xs font-medium text-[#302B29]">
          {/* Shift Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8EC] border border-amber-200/80 rounded-xl">
            <span className="text-stone-500 font-semibold">Shift:</span>
            <span className="font-bold text-[#E85D4A] tabular-nums font-mono text-sm">
              {timeFormatted}
            </span>
          </div>

          {/* Coins Balance */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200/80 rounded-xl">
            <Coins size={15} className="text-amber-500" />
            <span className="font-bold text-amber-950 tabular-nums font-mono text-sm">
              {coins}
            </span>
          </div>

          {/* Daily Sales Target */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl">
            <TrendingUp size={15} className="text-[#5E9B62]" />
            <span className="text-stone-500">Sales:</span>
            <span className="font-bold text-stone-900 tabular-nums font-mono">
              ${grossRevenue}
            </span>
            <span className="text-stone-400">/ ${targetRevenue}</span>
          </div>

          {/* Satisfaction */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200/80 rounded-xl">
            <Heart size={15} className="text-rose-500 fill-rose-500" />
            <span className="font-bold text-rose-950 tabular-nums font-mono">
              {customerSatisfaction}%
            </span>
          </div>

          {showBailoutAlert && (
            <button
              onClick={onOpenEmergency}
              type="button"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 text-red-700 font-bold rounded-xl animate-pulse text-xs hover:bg-red-200 transition-colors"
              title="Low supplies & coins! Request guild relief grant."
            >
              <AlertTriangle size={14} />
              <span>Relief Grant</span>
            </button>
          )}
        </div>

        {/* Quick Modal Nav & Utility Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSupplies}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFF8EC] border border-amber-200/80 text-[#815C43] hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <ShoppingBag size={15} className="text-[#E85D4A]" />
            <span className="hidden sm:inline">Pantry</span>
          </button>

          <button
            onClick={onOpenUpgrades}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFF8EC] border border-amber-200/80 text-[#815C43] hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <Wrench size={15} className="text-[#F4BF54]" />
            <span className="hidden sm:inline">Upgrades</span>
          </button>

          <button
            onClick={onOpenRecipes}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#FFF8EC] border border-amber-200/80 text-[#815C43] hover:bg-amber-100 transition-colors shadow-2xs"
          >
            <BookOpen size={15} className="text-[#5E9B62]" />
            <span className="hidden sm:inline">Recipes</span>
          </button>

          <SoundToggle />

          <button
            onClick={isPaused ? resumeGame : pauseGame}
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-100 border border-stone-200 text-stone-700 hover:bg-stone-200 transition-colors shadow-2xs"
            aria-label={isPaused ? 'Resume Shift' : 'Pause Shift'}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
