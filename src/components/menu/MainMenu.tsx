import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { StorefrontSvg } from '../illustrations/StorefrontSvg';
import { SoundToggle } from '../common/SoundToggle';
import { HowToPlayModal } from './HowToPlayModal';
import { Play, RotateCcw, HelpCircle, Award, Sparkles, BookOpen } from 'lucide-react';

export const MainMenu: React.FC<{ onOpenRecipes: () => void }> = ({ onOpenRecipes }) => {
  const hasSavedGame = useGameStore((s) => s.hasSavedGame);
  const currentDay = useGameStore((s) => s.currentDay);
  const coins = useGameStore((s) => s.coins);
  const reputation = useGameStore((s) => s.reputation);
  const startNewGame = useGameStore((s) => s.startNewGame);
  const continueGame = useGameStore((s) => s.continueGame);
  const resetProgress = useGameStore((s) => s.resetProgress);

  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F7EDE0] flex flex-col items-center justify-between p-4 sm:p-6 text-[#302B29] selection:bg-[#E85D4A] selection:text-white">
      {/* Top utility row */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#815C43]">
            Cozy Indie Cooking Simulation
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
        </div>
      </div>

      {/* Main Title & Storefront Illustration */}
      <div className="w-full max-w-xl flex flex-col items-center text-center my-auto py-4">
        {/* Animated Storefront Graphic */}
        <div className="mb-4 drop-shadow-md">
          <StorefrontSvg />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#302B29] font-['Outfit'] tracking-tight">
          Pizza Rush: Shop Manager
        </h1>
        <p className="text-xs sm:text-sm text-[#815C43] font-medium mt-1 max-w-md">
          Craft artisan pizzas, manage oven hearths, satisfy neighborhood guests, and expand your dream trattoria.
        </p>

        {/* Save Status Banner if save exists */}
        {hasSavedGame && currentDay > 1 && (
          <div className="mt-4 px-4 py-2 rounded-2xl bg-[#FFF8EC] border border-amber-200/80 text-xs text-[#815C43] flex items-center gap-3 shadow-2xs">
            <span className="font-bold text-stone-900">Active Campaign:</span>
            <span>Day {currentDay}</span>
            <span aria-hidden="true">·</span>
            <span>{coins} Coins</span>
            <span aria-hidden="true">·</span>
            <span>{reputation}% Reputation</span>
          </div>
        )}

        {/* Main Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-2.5 mt-6">
          {hasSavedGame && (
            <button
              onClick={continueGame}
              type="button"
              className="w-full py-3 px-6 rounded-2xl text-sm font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Play size={17} className="fill-white" />
              <span>Continue Shift (Day {currentDay})</span>
            </button>
          )}

          <button
            onClick={() => startNewGame(false)}
            type="button"
            className={`w-full py-3 px-6 rounded-2xl text-sm font-bold transition-all active:scale-98 flex items-center justify-center gap-2 ${
              hasSavedGame
                ? 'bg-[#FFFDF8] hover:bg-amber-50 text-[#815C43] border border-amber-200/80 shadow-2xs'
                : 'bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-md'
            }`}
          >
            <Sparkles size={16} />
            <span>{hasSavedGame ? 'Play Tutorial Again' : 'Play New Game'}</span>
          </button>

          <button
            onClick={() => setShowHowToPlay(true)}
            type="button"
            className="w-full py-2.5 px-6 rounded-2xl text-xs font-semibold bg-[#FFFDF8] hover:bg-amber-50 text-stone-700 border border-amber-200/80 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle size={15} />
            <span>How to Play</span>
          </button>

          <button
            onClick={onOpenRecipes}
            type="button"
            className="w-full py-2.5 px-6 rounded-2xl text-xs font-semibold bg-[#FFFDF8] hover:bg-amber-50 text-stone-700 border border-amber-200/80 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={15} />
            <span>View Recipe Book</span>
          </button>

          {hasSavedGame && (
            <button
              onClick={() => setShowResetConfirm(true)}
              type="button"
              className="w-full py-2 px-6 rounded-2xl text-[11px] font-semibold text-stone-400 hover:text-red-600 transition-colors flex items-center justify-center gap-1.5 mt-1"
            >
              <RotateCcw size={12} />
              <span>Reset Saved Progress</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer credits */}
      <footer className="text-center text-[11px] text-[#815C43]/70 pb-2">
        <span>Handcrafted Trattoria Simulation · 10+ Progression Days · Local Save</span>
      </footer>

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="relative z-10 w-full max-w-sm bg-[#FFFDF8] rounded-3xl border border-amber-900/10 shadow-2xl p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-red-100 flex items-center justify-center text-red-700 mb-3">
              <RotateCcw size={22} />
            </div>

            <h3 className="text-base font-bold text-[#302B29] font-['Outfit']">
              Reset All Progress?
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-5">
              This will erase all unlocked upgrades, recipes, saved coins, and return you to Day 1. This action cannot be undone.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                type="button"
                className="flex-1 py-2 px-4 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowResetConfirm(false);
                }}
                type="button"
                className="flex-1 py-2 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
