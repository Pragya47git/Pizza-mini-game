import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { INGREDIENT_DEFINITIONS } from '../../config/ingredients';
import { useGameStore } from '../../store/gameStore';
import { IngredientId } from '../../types/game';
import { ShoppingCart, Package, AlertCircle, Coins, Check } from 'lucide-react';

interface SupplyShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupplyShopModal: React.FC<SupplyShopModalProps> = ({ isOpen, onClose }) => {
  const coins = useGameStore((s) => s.coins);
  const inventory = useGameStore((s) => s.inventory);
  const inventoryCapacity = useGameStore((s) => s.inventoryCapacity);
  const currentDay = useGameStore((s) => s.currentDay);
  const purchasedUpgradeIds = useGameStore((s) => s.purchasedUpgradeIds);
  const buyIngredientPack = useGameStore((s) => s.buyIngredientPack);

  const hasDiscount = purchasedUpgradeIds.includes('bulk_wholesaler_contract');
  const discountMultiplier = hasDiscount ? 0.85 : 1.0;

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'base' | 'cheese' | 'topping'>('all');

  const ingredients = Object.values(INGREDIENT_DEFINITIONS).filter((ing) => {
    if (ing.unlockDay > currentDay) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'base') return ing.category === 'base' || ing.category === 'sauce';
    return ing.category === selectedCategory;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mercato Pantry & Supplies"
      subtitle={`Fresh ingredients delivered daily · Pantry Capacity: ${inventoryCapacity} units/item`}
      maxWidth="max-w-3xl"
    >
      {/* Wholesaler discount notification */}
      {hasDiscount && (
        <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check size={16} className="text-emerald-600" />
          <span>Wholesaler Contract Active: 15% discount applied to all packs!</span>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl mb-4">
        {(['all', 'base', 'cheese', 'topping'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            type="button"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {cat === 'all' ? 'All Supplies' : cat === 'base' ? 'Crust & Sauce' : cat === 'cheese' ? 'Cheeses' : 'Toppings'}
          </button>
        ))}
      </div>

      {/* Grid of Ingredients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ingredients.map((ing) => {
          const currentStock = inventory[ing.id] || 0;
          const isAtCapacity = currentStock >= inventoryCapacity;
          const discountedPackPrice = Math.round(ing.packPrice * discountMultiplier);
          const canAfford = coins >= discountedPackPrice && !isAtCapacity;

          return (
            <div
              key={ing.id}
              className="p-3.5 rounded-2xl border border-amber-900/10 bg-[#FFFDF8] flex flex-col justify-between gap-2.5 shadow-2xs hover:border-amber-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-2xs border border-black/10 shrink-0"
                    style={{ backgroundColor: ing.color }}
                  >
                    🍕
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-[#302B29] font-['Outfit']">
                      {ing.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {ing.description}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-stone-900 tabular-nums">
                    {discountedPackPrice} Coins
                  </div>
                  <div className="text-[10px] text-stone-400">
                    per pack of {ing.packSize}
                  </div>
                </div>
              </div>

              {/* Stock Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-600 mb-1">
                  <span>In Stock</span>
                  <span className="font-mono tabular-nums font-bold">
                    {currentStock} / {inventoryCapacity}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      currentStock <= 2 ? 'bg-red-500' : currentStock < 10 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (currentStock / inventoryCapacity) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-amber-50">
                <button
                  onClick={() => buyIngredientPack(ing.id, 1)}
                  disabled={!canAfford}
                  type="button"
                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold bg-[#E85D4A] hover:bg-[#D44B38] text-white disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-all shadow-2xs flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart size={13} />
                  <span>Buy +{ing.packSize} ({discountedPackPrice}c)</span>
                </button>

                <button
                  onClick={() => buyIngredientPack(ing.id, 2)}
                  disabled={coins < discountedPackPrice * 2 || currentStock + ing.packSize * 2 > inventoryCapacity}
                  type="button"
                  className="py-1.5 px-3 rounded-xl text-xs font-semibold bg-amber-100 hover:bg-amber-200 text-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Buy 2 packs"
                >
                  <span>2x</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
