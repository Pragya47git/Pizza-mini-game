import React, { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './components/menu/MainMenu';
import { GameLayout } from './components/layout/GameLayout';
import { RecipeBookModal } from './components/shops/RecipeBookModal';

export default function App() {
  const gamePhase = useGameStore((s) => s.gamePhase);
  const [showRecipesFromMenu, setShowRecipesFromMenu] = useState(false);

  if (gamePhase === 'MAIN_MENU') {
    return (
      <>
        <MainMenu onOpenRecipes={() => setShowRecipesFromMenu(true)} />
        <RecipeBookModal
          isOpen={showRecipesFromMenu}
          onClose={() => setShowRecipesFromMenu(false)}
        />
      </>
    );
  }

  return <GameLayout />;
}
