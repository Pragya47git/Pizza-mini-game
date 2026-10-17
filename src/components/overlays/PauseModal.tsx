import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { Play, RotateCcw, Home, Volume2, VolumeX, HelpCircle, BookOpen } from 'lucide-react';

interface PauseModalProps {
  onOpenHowToPlay: () => void;
  onOpenRecipes: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ onOpenHowToPlay, onOpenRecipes }) => {
  const isPaused = useGameStore((s) => s.isPaused);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const restartDay = useGameStore((s) => s.restartDay);
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const currentDay = useGameStore((s) => s.currentDay);

  if (!isPaused) return null;

  const handleReturnToMenu = () => {
    useGameStore.setState({ gamePhase: 'MAIN_MENU', isPaused: false });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div className="relative z-10 w-full max-w-sm bg-[#FFFDF8] rounded-3xl border border-amber-900/10 shadow-2xl p-6 text-center">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-[#FFF8EC] border border-amber-200/80 flex items-center justify-center text-[#E85D4A] mb-3 shadow-xs">
          🍕
        </div>

        <h2 className="text-xl font-bold text-[#302B29] font-['Outfit']">
          Shift Paused
        </h2>
        <p className="text-xs text-stone-500 mt-0.5 mb-5">
          Take a breath, chef! Day {currentDay} is waiting for you.
        </p>

        <div className="flex flex-col gap-2.5">
          {/* Resume Button */}
          <button
            onClick={resumeGame}
            type="button"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            <Play size={15} />
            <span>Resume Shift</span>
          </button>

          {/* Recipes Guide */}
          <button
            onClick={() => {
              resumeGame();
              onOpenRecipes();
            }}
            type="button"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-[#FFF8EC] hover:bg-amber-100 text-[#815C43] border border-amber-200/80 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen size={15} />
            <span>Check Recipe Book</span>
          </button>

          {/* How to Play */}
          <button
            onClick={onOpenHowToPlay}
            type="button"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle size={15} />
            <span>How to Play</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center justify-center gap-2"
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>Sound: {soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>

          {/* Restart Day */}
          <button
            onClick={() => {
              if (window.confirm('Restart current day shift? Timer and active orders will reset.')) {
                restartDay();
              }
            }}
            type="button"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-amber-900 hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Restart Day {currentDay}</span>
          </button>

          {/* Main Menu */}
          <button
            onClick={handleReturnToMenu}
            type="button"
            className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Save & Exit to Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
