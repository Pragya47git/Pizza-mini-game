import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { ChefHat, ArrowRight, SkipForward } from 'lucide-react';

export const TutorialOverlay: React.FC = () => {
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const skipTutorial = useGameStore((s) => s.skipTutorial);
  const advanceTutorial = useGameStore((s) => s.advanceTutorial);

  if (tutorialStep <= 0) return null;

  const stepsData: Record<number, { title: string; instruction: string; hint: string }> = {
    1: {
      title: 'Welcome to your Pizzeria!',
      instruction: 'A customer has just arrived at the counter! Click on Sofia’s order card on the left to review her ticket.',
      hint: 'Sofia wants a Classic Margherita pizza.',
    },
    2: {
      title: 'Step 1: Prep the Dough',
      instruction: 'Click the "Artisan Dough" button in the Prep Station to roll out your crust base on the wooden board.',
      hint: 'Every pizza starts with airy, fermented wheat dough.',
    },
    3: {
      title: 'Step 2: Spread Tomato Sauce',
      instruction: 'Click "Tomato Sauce" to ladle sweet San Marzano tomato sauce over the raw dough base.',
      hint: 'Sauce creates the juicy foundation for melting cheese.',
    },
    4: {
      title: 'Step 3: Sprinkle Mozzarella',
      instruction: 'Click "Mozzarella" in the Cheeses row to add fresh Fior di Latte mozzarella.',
      hint: 'Margherita requires only dough, tomato sauce, and mozzarella.',
    },
    5: {
      title: 'Step 4: Slide Into the Brick Oven',
      instruction: 'Your Margherita is fully assembled! Click "Slide to Oven" in the prep header to bake it.',
      hint: 'The stone deck is preheated to blazing authentic temperature.',
    },
    6: {
      title: 'Step 5: Watch the Bake Meter',
      instruction: 'Watch the cooking timer! When the progress bar enters the green "Golden Crust (Ready!)" zone, click "Pull From Oven".',
      hint: 'Pulling too early leaves it doughy; pulling too late burns the crust!',
    },
    7: {
      title: 'Step 6: Serve the Customer',
      instruction: 'Your pizza is resting on the marble counter. Click "Serve" to hand it over to Sofia and collect your coins & tip!',
      hint: 'Accurate toppings and golden crust earn 5-star reviews and tips!',
    },
    8: {
      title: 'You Got Paid! Master the Pizzeria!',
      instruction: 'Great job chef! Remember to check your "Pantry" to buy ingredient packs and "Upgrades" to get more oven decks.',
      hint: 'Click "Start Real Shift" to open doors to the lunchtime crowd.',
    },
  };

  const current = stepsData[tutorialStep] || stepsData[1];

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-xl mx-auto animate-bounce-in">
      <div className="bg-[#302B29] text-white rounded-2xl p-4 shadow-2xl border-2 border-[#F4BF54] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#E85D4A] flex items-center justify-center text-xs">
              <ChefHat size={14} />
            </span>
            <span className="text-xs font-bold text-[#F4BF54] font-['Outfit'] tracking-wide">
              Tutorial · Step {tutorialStep} of 7: {current.title}
            </span>
          </div>

          <button
            onClick={skipTutorial}
            type="button"
            className="text-[11px] text-stone-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <SkipForward size={12} />
            <span>Skip Tutorial</span>
          </button>
        </div>

        <p className="text-xs text-stone-200 font-medium leading-relaxed">
          {current.instruction}
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-700/80">
          <span className="italic">💡 {current.hint}</span>
          {tutorialStep === 1 && (
            <button
              onClick={advanceTutorial}
              type="button"
              className="text-[#F4BF54] font-bold hover:underline flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
