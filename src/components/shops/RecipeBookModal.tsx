import React from 'react';
import { Modal } from '../common/Modal';
import { RECIPE_DEFINITIONS } from '../../config/recipes';
import { INGREDIENT_DEFINITIONS } from '../../config/ingredients';
import { useGameStore } from '../../store/gameStore';
import { IngredientId } from '../../types/game';
import { BookOpen, Clock, Lock, Sparkles, ChefHat } from 'lucide-react';

interface RecipeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeBookModal: React.FC<RecipeBookModalProps> = ({ isOpen, onClose }) => {
  const currentDay = useGameStore((s) => s.currentDay);
  const recipes = Object.values(RECIPE_DEFINITIONS);

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-800 border-amber-200',
    Hard: 'bg-orange-50 text-orange-800 border-orange-200',
    Master: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nonna's Secret Pizza Cookbook"
      subtitle="Authentic regional recipes, required proportions, and stone oven baking guides."
      maxWidth="max-w-3xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {recipes.map((recipe) => {
          const isLocked = recipe.unlockDay > currentDay;

          return (
            <div
              key={recipe.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isLocked
                  ? 'bg-stone-50/70 border-stone-200 opacity-60'
                  : 'bg-[#FFFDF8] border-amber-900/10 shadow-2xs hover:border-amber-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h3 className="text-sm font-bold text-[#302B29] font-['Outfit']">
                      {recipe.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${difficultyColors[recipe.difficulty]}`}>
                        {recipe.difficulty}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#5E9B62]">
                        ${recipe.basePrice} base
                      </span>
                    </div>
                  </div>

                  {isLocked ? (
                    <span className="flex items-center gap-1 text-[11px] text-stone-500 bg-stone-200/80 px-2 py-1 rounded-lg">
                      <Lock size={12} />
                      Day {recipe.unlockDay}
                    </span>
                  ) : (
                    <span className="text-xs text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg">
                      Unlocked
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Required Ingredients */}
                <div className="mt-3">
                  <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">
                    Required Recipe Build
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(recipe.requiredIngredients)
                      .filter(([_, count]) => count > 0)
                      .map(([ingId]) => {
                        const def = INGREDIENT_DEFINITIONS[ingId as IngredientId];
                        return (
                          <span
                            key={ingId}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium bg-[#FFF8EC] border border-amber-200/80 text-[#302B29]"
                          >
                            <span
                              className="w-2 h-2 rounded-full inline-block"
                              style={{ backgroundColor: def?.color || '#D83E2D' }}
                            />
                            {def?.name || ingId}
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Bottom Specs */}
              <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1 text-stone-700">
                  <Clock size={13} className="text-[#E85D4A]" />
                  Ideal: {recipe.idealCookingDuration}s bake
                </span>
                <span className="text-amber-800 font-semibold">
                  +${recipe.perfectOrderBonus} perfect bonus
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
