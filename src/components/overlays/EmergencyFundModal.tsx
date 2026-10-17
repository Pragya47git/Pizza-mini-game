import React from 'react';
import { Modal } from '../common/Modal';
import { useGameStore } from '../../store/gameStore';
import { HeartHandshake, Coins, Wheat, Check } from 'lucide-react';

interface EmergencyFundModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyFundModal: React.FC<EmergencyFundModalProps> = ({ isOpen, onClose }) => {
  const claimEmergencyBailout = useGameStore((s) => s.claimEmergencyBailout);

  const handleClaim = () => {
    claimEmergencyBailout();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Neighborhood Baker's Guild Relief Grant"
      subtitle="The local artisan community has your back when times get tough."
      maxWidth="max-w-md"
    >
      <div className="flex flex-col gap-4 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 shadow-sm">
          <HeartHandshake size={32} />
        </div>

        <div>
          <h3 className="text-base font-bold text-[#302B29] font-['Outfit']">
            Emergency Community Relief
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Every great chef faces challenging mornings. The Baker’s Guild is proud to extend an interest-free community grant to keep your oven glowing!
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FFF8EC] border border-amber-200/80 text-left flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <Coins size={16} className="text-amber-500" />
            <span>+35 Emergency Coins</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-stone-900">
            <Wheat size={16} className="text-[#815C43]" />
            <span>+5 Artisan Dough, +5 Tomato Sauce, +5 Mozzarella</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            type="button"
            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Not Now
          </button>
          <button
            onClick={handleClaim}
            type="button"
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white shadow-xs transition-all active:scale-98 flex items-center justify-center gap-1.5"
          >
            <Check size={14} />
            <span>Accept Grant</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
