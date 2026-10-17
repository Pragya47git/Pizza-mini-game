import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { UPGRADE_DEFINITIONS } from '../../config/upgrades';
import { useGameStore } from '../../store/gameStore';
import { UpgradeCategory } from '../../types/game';
import { Wrench, Check, Lock, Sparkles, HardDrive, Zap, Palette } from 'lucide-react';

interface UpgradeShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeShopModal: React.FC<UpgradeShopModalProps> = ({ isOpen, onClose }) => {
  const coins = useGameStore((s) => s.coins);
  const currentDay = useGameStore((s) => s.currentDay);
  const purchasedUpgradeIds = useGameStore((s) => s.purchasedUpgradeIds);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);

  const [activeTab, setActiveTab] = useState<'all' | UpgradeCategory>('all');

  const filteredUpgrades = UPGRADE_DEFINITIONS.filter((u) => {
    if (activeTab === 'all') return true;
    return u.category === activeTab;
  });

  const getCategoryIcon = (category: UpgradeCategory) => {
    switch (category) {
      case 'equipment':
        return <Wrench size={14} className="text-[#E85D4A]" />;
      case 'efficiency':
        return <Zap size={14} className="text-[#F4BF54]" />;
      case 'storage':
        return <HardDrive size={14} className="text-[#815C43]" />;
      case 'decor':
        return <Palette size={14} className="text-[#5E9B62]" />;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pizzeria Workshop & Upgrades"
      subtitle={`Expand oven decks, speed up baking, decorate your trattoria, and scale your kitchen.`}
      maxWidth="max-w-3xl"
    >
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mb-4 overflow-x-auto">
        {(['all', 'equipment', 'efficiency', 'decor', 'storage'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tab === 'all' ? 'All Upgrades' : tab}
          </button>
        ))}
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredUpgrades.map((upgrade) => {
          const isPurchased = purchasedUpgradeIds.includes(upgrade.id);
          const isLocked = upgrade.unlockDay > currentDay;
          const canAfford = coins >= upgrade.cost && !isPurchased && !isLocked;

          return (
            <div
              key={upgrade.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isPurchased
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isLocked
                  ? 'bg-stone-50 border-stone-200 opacity-60'
                  : 'bg-[#FFFDF8] border-amber-900/10 hover:border-amber-400 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-50 border border-amber-200/60">
                      {getCategoryIcon(upgrade.category)}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-[#302B29] font-['Outfit']">
                        {upgrade.name}
                      </h3>
                      <span className="text-[10px] text-stone-400 capitalize">
                        {upgrade.category}
                      </span>
                    </div>
                  </div>

                  {!isPurchased && !isLocked && (
                    <span className="text-xs font-extrabold text-amber-950 font-mono tabular-nums">
                      {upgrade.cost} Coins
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {upgrade.description}
                </p>

                <div className="mt-2.5 p-2 rounded-xl bg-[#FFF8EC] border border-amber-200/50 text-[11px] font-semibold text-[#815C43]">
                  ⚡ {upgrade.effectDescription}
                </div>
              </div>

              {/* Status or Buy Button */}
              <div>
                {isPurchased ? (
                  <div className="w-full py-2 px-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <Check size={14} />
                    <span>Purchased & Active</span>
                  </div>
                ) : isLocked ? (
                  <div className="w-full py-2 px-3 rounded-xl bg-stone-200/80 text-stone-500 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <Lock size={14} />
                    <span>Unlocks on Day {upgrade.unlockDay}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => buyUpgrade(upgrade.id)}
                    disabled={!canAfford}
                    type="button"
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Upgrade for {upgrade.cost} Coins</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
