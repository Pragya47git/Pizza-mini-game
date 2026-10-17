import React from 'react';
import { Modal } from '../common/Modal';
import { ChefHat, Flame, ShoppingBag, Clock, Heart, Sparkles } from 'lucide-react';

export const HowToPlayModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="How to Play Pizza Rush"
      subtitle="The complete guide to artisanal pizza preparation and trattoria management."
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4 text-xs text-stone-700 leading-relaxed">
        {/* Step 1: Customer & Orders */}
        <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E85D4A] text-white flex items-center justify-center shrink-0">
            <Clock size={16} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 font-['Outfit'] text-sm">
              1. Customer Orders & Patience
            </h3>
            <p className="mt-0.5 text-stone-600">
              Customers line up on the left with specific pizza orders. Watch their patience bar—fast service earns juicy speed tips! If their patience runs out, they walk out disappointed and your trattoria loses reputation.
            </p>
          </div>
        </div>

        {/* Step 2: Assembling the Pizza */}
        <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#F4BF54] text-amber-950 flex items-center justify-center shrink-0">
            <ChefHat size={16} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 font-['Outfit'] text-sm">
              2. Assemble on the Board
            </h3>
            <p className="mt-0.5 text-stone-600">
              Click <strong>Artisan Dough</strong> first, followed by <strong>Tomato Sauce</strong>, your cheeses, and requested toppings. Check the order ticket to ensure you don’t miss ingredients or add unwanted extras that lower recipe accuracy!
            </p>
          </div>
        </div>

        {/* Step 3: Oven & Golden Crust */}
        <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E85D4A] text-white flex items-center justify-center shrink-0">
            <Flame size={16} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 font-['Outfit'] text-sm">
              3. Master the Wood-Fired Oven
            </h3>
            <p className="mt-0.5 text-stone-600">
              Slide the prepped pizza into the stone deck. Watch the timer: pull it out during the <strong>Golden Crust (Ready!)</strong> window for maximum score and tips. Pulling too early produces raw dough; leaving it too long burns it!
            </p>
          </div>
        </div>

        {/* Step 4: Serve & Collect Coins */}
        <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#5E9B62] text-white flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 font-['Outfit'] text-sm">
              4. Serve to Guests & Collect Coins
            </h3>
            <p className="mt-0.5 text-stone-600">
              Select the baked pizza on the Serving Counter and click <strong>Serve</strong>. 100% accurate recipes with golden bakes earn a generous Perfect Bonus!
            </p>
          </div>
        </div>

        {/* Step 5: Pantry & Shop Upgrades */}
        <div className="p-3.5 bg-[#FFF8EC] rounded-2xl border border-amber-200/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#815C43] text-white flex items-center justify-center shrink-0">
            <ShoppingBag size={16} />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 font-['Outfit'] text-sm">
              5. Pantry Restocks & Pizzeria Upgrades
            </h3>
            <p className="mt-0.5 text-stone-600">
              Every ingredient you use is deducted from your stock. Visit the <strong>Pantry</strong> to restock flour, cheeses, and toppings. Use excess profit in the <strong>Upgrades Workshop</strong> to unlock dual and triple oven decks, faster baking, and trattoria decor!
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
