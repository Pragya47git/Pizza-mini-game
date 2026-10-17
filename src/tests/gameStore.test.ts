import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../store/gameStore';

describe('GameStore State & Economy Loop', () => {
  beforeEach(() => {
    // Reset store before each test
    useGameStore.getState().resetProgress();
  });

  it('initializes a new game with healthy starting balance and pantry inventory', () => {
    useGameStore.getState().startNewGame(true);
    const state = useGameStore.getState();

    expect(state.coins).toBe(45);
    expect(state.currentDay).toBe(1);
    expect(state.inventory.dough).toBeGreaterThan(0);
    expect(state.inventory.tomato_sauce).toBeGreaterThan(0);
    expect(state.inventory.mozzarella).toBeGreaterThan(0);
    expect(state.ovenSlots).toHaveLength(1);
  });

  it('consumes inventory when ingredients are assembled on the pizza board', () => {
    useGameStore.getState().startNewGame(true);
    const initialDough = useGameStore.getState().inventory.dough;
    const initialSauce = useGameStore.getState().inventory.tomato_sauce;

    // Add dough
    const doughSuccess = useGameStore.getState().addDough();
    expect(doughSuccess).toBe(true);
    expect(useGameStore.getState().inventory.dough).toBe(initialDough - 1);
    expect(useGameStore.getState().currentPizza.hasDough).toBe(true);

    // Cannot add second dough base
    const secondDough = useGameStore.getState().addDough();
    expect(secondDough).toBe(false);

    // Add sauce
    const sauceSuccess = useGameStore.getState().addSauce();
    expect(sauceSuccess).toBe(true);
    expect(useGameStore.getState().inventory.tomato_sauce).toBe(initialSauce - 1);
    expect(useGameStore.getState().currentPizza.hasSauce).toBe(true);
  });

  it('prevents assembling ingredients without dough', () => {
    useGameStore.getState().startNewGame(true);
    // Try to add sauce without dough
    const sauceSuccess = useGameStore.getState().addSauce();
    expect(sauceSuccess).toBe(false);

    // Try to add topping without dough
    const toppingSuccess = useGameStore.getState().addTopping('pepperoni');
    expect(toppingSuccess).toBe(false);
  });

  it('prevents assembling ingredients with zero inventory', () => {
    useGameStore.getState().startNewGame(true);
    // Set dough to 0
    useGameStore.setState({ inventory: { ...useGameStore.getState().inventory, dough: 0 } });

    const doughSuccess = useGameStore.getState().addDough();
    expect(doughSuccess).toBe(false);
  });

  it('places assembled pizza into oven and frees the board', () => {
    useGameStore.getState().startNewGame(true);
    useGameStore.getState().addDough();
    useGameStore.getState().addSauce();
    useGameStore.getState().addCheese('mozzarella');

    const ovenSuccess = useGameStore.getState().placePizzaInOven();
    expect(ovenSuccess).toBe(true);

    const ovenSlots = useGameStore.getState().ovenSlots;
    expect(ovenSlots[0].isCooking).toBe(true);
    expect(ovenSlots[0].pizza).not.toBeNull();

    // Board is now reset
    expect(useGameStore.getState().currentPizza.hasDough).toBe(false);
  });

  it('advances oven cooking when tick is called', () => {
    useGameStore.getState().startNewGame(true);
    useGameStore.getState().addDough();
    useGameStore.getState().placePizzaInOven();

    expect(useGameStore.getState().ovenSlots[0].cookingTime).toBe(0);

    // Tick 2 seconds
    useGameStore.getState().tick(2.0);
    expect(useGameStore.getState().ovenSlots[0].cookingTime).toBe(2.0);
  });

  it('does not advance clock or oven when game is paused', () => {
    useGameStore.getState().startNewGame(true);
    useGameStore.getState().addDough();
    useGameStore.getState().placePizzaInOven();

    useGameStore.getState().pauseGame();
    expect(useGameStore.getState().isPaused).toBe(true);

    useGameStore.getState().tick(3.0);
    expect(useGameStore.getState().ovenSlots[0].cookingTime).toBe(0);
  });

  it('purchases upgrades and expands oven decks', () => {
    useGameStore.getState().startNewGame(true);
    // Give enough coins for dual oven upgrade (cost 85)
    useGameStore.setState({ coins: 150 });

    const buySuccess = useGameStore.getState().buyUpgrade('oven_slot_2');
    expect(buySuccess).toBe(true);
    expect(useGameStore.getState().coins).toBe(150 - 85);
    expect(useGameStore.getState().purchasedUpgradeIds).toContain('oven_slot_2');
    expect(useGameStore.getState().ovenSlots).toHaveLength(2);
  });

  it('prevents purchasing upgrades when player has insufficient coins', () => {
    useGameStore.getState().startNewGame(true);
    useGameStore.setState({ coins: 10 }); // only 10 coins

    const buySuccess = useGameStore.getState().buyUpgrade('oven_slot_2');
    expect(buySuccess).toBe(false);
    expect(useGameStore.getState().purchasedUpgradeIds).not.toContain('oven_slot_2');
  });

  it('allows buying ingredient packs and updating inventory and ledger', () => {
    useGameStore.getState().startNewGame(true);
    const initialFlour = useGameStore.getState().inventory.dough;
    const initialCoins = useGameStore.getState().coins;

    // Pack price for dough is 15 coins for 10 units
    const buySuccess = useGameStore.getState().buyIngredientPack('dough', 1);
    expect(buySuccess).toBe(true);
    expect(useGameStore.getState().inventory.dough).toBe(initialFlour + 10);
    expect(useGameStore.getState().coins).toBe(initialCoins - 15);
    expect(useGameStore.getState().dailyLedger.ingredientExpenses).toBe(15);
  });
});
