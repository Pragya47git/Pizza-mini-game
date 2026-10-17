import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const SoundToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const soundEnabled = useGameStore((s) => s.settings.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  return (
    <button
      onClick={toggleSound}
      type="button"
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
      aria-label={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
      title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
    >
      {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} className="text-stone-400" />}
    </button>
  );
};
