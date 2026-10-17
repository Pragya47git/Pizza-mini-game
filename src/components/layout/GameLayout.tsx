import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useGameClock } from '../../hooks/useGameClock';
import { GameHeader } from '../kitchen/GameHeader';
import { CustomerQueue } from '../kitchen/CustomerQueue';
import { PizzaBuilder } from '../kitchen/PizzaBuilder';
import { OvenStation } from '../kitchen/OvenStation';
import { ServingCounter } from '../kitchen/ServingCounter';
import { SupplyShopModal } from '../shops/SupplyShopModal';
import { UpgradeShopModal } from '../shops/UpgradeShopModal';
import { RecipeBookModal } from '../shops/RecipeBookModal';
import { DailyResultsModal } from '../results/DailyResultsModal';
import { CampaignCompleteModal } from '../results/CampaignCompleteModal';
import { EmergencyFundModal } from '../overlays/EmergencyFundModal';
import { PauseModal } from '../overlays/PauseModal';
import { TutorialOverlay } from '../tutorial/TutorialOverlay';
import { Toast } from '../common/Toast';
import { HowToPlayModal } from '../menu/HowToPlayModal';
import { Users, ChefHat, Flame } from 'lucide-react';

export const GameLayout: React.FC = () => {
  // Mount game clock
  useGameClock();

  // Modals state
  const [showSupplies, setShowSupplies] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showRecipes, setShowRecipes] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Mobile Tab Navigation
  const [mobileTab, setMobileTab] = useState<'queue' | 'prep' | 'oven'>('prep');

  const activeOrdersCount = useGameStore((s) => s.activeOrders.length);
  const completedCount = useGameStore((s) => s.completedPizzas.length);
  const ovenCookingCount = useGameStore((s) => s.ovenSlots.filter((slot) => slot.isCooking).length);

  return (
    <div className="min-h-screen w-full bg-[#F7EDE0] flex flex-col text-[#302B29] selection:bg-[#E85D4A] selection:text-white">
      {/* Top Header */}
      <GameHeader
        onOpenSupplies={() => setShowSupplies(true)}
        onOpenUpgrades={() => setShowUpgrades(true)}
        onOpenRecipes={() => setShowRecipes(true)}
        onOpenEmergency={() => setShowEmergency(true)}
      />

      {/* Mobile Tab Switcher */}
      <div className="lg:hidden flex items-center justify-around bg-[#FFFDF8] border-b border-amber-900/10 px-2 py-1.5 shrink-0">
        <button
          onClick={() => setMobileTab('queue')}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            mobileTab === 'queue'
              ? 'bg-[#E85D4A] text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Users size={14} />
          <span>Guests ({activeOrdersCount})</span>
        </button>

        <button
          onClick={() => setMobileTab('prep')}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            mobileTab === 'prep'
              ? 'bg-[#E85D4A] text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ChefHat size={14} />
          <span>Pizza Board</span>
        </button>

        <button
          onClick={() => setMobileTab('oven')}
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            mobileTab === 'oven'
              ? 'bg-[#E85D4A] text-white shadow-2xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Flame size={14} />
          <span>Oven & Serve ({ovenCookingCount + completedCount})</span>
        </button>
      </div>

      {/* Main Kitchen Grid Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 overflow-hidden">
        {/* Left Column: Customer Queue & Active Tickets */}
        <section
          className={`lg:col-span-3 lg:flex flex-col gap-3 ${
            mobileTab === 'queue' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <CustomerQueue />
        </section>

        {/* Center Column: Pizza Prep Board & Ingredients */}
        <section
          className={`lg:col-span-5 lg:flex flex-col gap-3 ${
            mobileTab === 'prep' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <PizzaBuilder />
        </section>

        {/* Right Column: Oven Baking & Serving Counter */}
        <section
          className={`lg:col-span-4 lg:flex flex-col gap-3.5 overflow-y-auto ${
            mobileTab === 'oven' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <OvenStation />
          <ServingCounter />
        </section>
      </main>

      {/* Modals & Overlays */}
      <SupplyShopModal isOpen={showSupplies} onClose={() => setShowSupplies(false)} />
      <UpgradeShopModal isOpen={showUpgrades} onClose={() => setShowUpgrades(false)} />
      <RecipeBookModal isOpen={showRecipes} onClose={() => setShowRecipes(false)} />
      <EmergencyFundModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
      <PauseModal
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onOpenRecipes={() => setShowRecipes(true)}
      />

      {/* Daily Results Modal */}
      <DailyResultsModal />

      {/* Campaign Complete Modal */}
      <CampaignCompleteModal />

      {/* Tutorial Guidance */}
      <TutorialOverlay />

      {/* Toast Alert */}
      <Toast />
    </div>
  );
};
