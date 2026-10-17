import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DEFAULT_INVENTORY_CAPACITY, INITIAL_INVENTORY, INGREDIENT_DEFINITIONS } from '../config/ingredients';
import { RECIPE_DEFINITIONS } from '../config/recipes';
import { UPGRADE_DEFINITIONS } from '../config/upgrades';
import { DAY_CONFIGS, getDayConfig } from '../config/days';
import { createRandomCustomer } from '../config/customers';
import {
  CustomerOrder,
  CustomerType,
  DailyLedger,
  GamePhase,
  GameSettings,
  IngredientId,
  OvenSlotState,
  PreparedPizza,
  RecipeId,
  ToppingPlacement,
} from '../types/game';
import { calculateOrderReward } from '../domain/rewards';
import { evaluateCookingState } from '../domain/cooking';
import { soundManager } from '../domain/soundEffects';

const STORAGE_KEY = 'PIZZA_RUSH_SAVE_V1';

export interface ToastInfo {
  id: string;
  text: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export interface GameStoreState {
  // Phase & Core State
  gamePhase: GamePhase;
  hasSavedGame: boolean;
  currentDay: number;
  shiftTimeRemaining: number;
  shiftTotalDuration: number;
  isPaused: boolean;

  // Economy & Progression
  coins: number;
  lifetimeRevenue: number;
  lifetimeOrders: number;
  reputation: number; // 0 to 100
  customerSatisfaction: number; // 0 to 100

  // Inventory & Upgrades
  inventory: Record<IngredientId, number>;
  inventoryCapacity: number;
  purchasedUpgradeIds: string[];
  unlockedRecipeIds: RecipeId[];

  // Orders & Customers
  activeOrders: CustomerOrder[];
  selectedOrderId: string | null;
  nextCustomerSpawnTimer: number;

  // Kitchen Assembly & Oven
  currentPizza: PreparedPizza;
  ovenSlots: OvenSlotState[];
  completedPizzas: {
    id: string;
    pizza: PreparedPizza;
    cookingTime: number;
    createdAt: number;
  }[];

  // Daily Ledger
  dailyLedger: DailyLedger;
  pastDayStats: DailyLedger[];

  // Tutorial & UI
  tutorialStep: number;
  settings: GameSettings;
  toast: ToastInfo | null;
  lastServeResult: {
    message: string;
    coins: number;
    isPerfect: boolean;
    success: boolean;
  } | null;

  // Actions
  startNewGame: (skipTutorial?: boolean) => void;
  continueGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  tick: (deltaSeconds: number) => void;
  selectOrder: (orderId: string | null) => void;

  // Kitchen Actions
  addDough: () => boolean;
  addSauce: () => boolean;
  addCheese: (cheeseId: IngredientId) => boolean;
  addTopping: (toppingId: IngredientId) => boolean;
  resetPizza: () => void;
  placePizzaInOven: (slotIndex?: number) => boolean;
  removePizzaFromOven: (slotIndex: number) => boolean;
  serveOrder: (orderId: string, completedPizzaId: string) => boolean;
  discardCompletedPizza: (completedPizzaId: string) => void;

  // Shop & Economy Actions
  buyIngredientPack: (ingredientId: IngredientId, count?: number) => boolean;
  buyUpgrade: (upgradeId: string) => boolean;
  claimEmergencyBailout: () => void;

  // Progression Actions
  finishShift: () => void;
  startNextDay: () => void;
  restartDay: () => void;
  advanceTutorial: () => void;
  skipTutorial: () => void;
  toggleSound: () => void;
  setSettings: (settings: Partial<GameSettings>) => void;
  resetProgress: () => void;
  setToast: (text: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  clearToast: () => void;
}

const createInitialPizza = (): PreparedPizza => ({
  id: `pizza_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
  hasDough: false,
  hasSauce: false,
  cheeses: [],
  toppings: [],
  toppingPlacements: [],
  ingredientCounts: {},
  createdAt: Date.now(),
});

const createInitialOvenSlots = (slotCount: number = 1): OvenSlotState[] => {
  return Array.from({ length: slotCount }, (_, idx) => ({
    slotIndex: idx,
    pizza: null,
    cookingTime: 0,
    targetCookingTime: 8,
    quality: 'raw',
    isCooking: false,
  }));
};

const createInitialDailyLedger = (dayNumber: number): DailyLedger => {
  const config = getDayConfig(dayNumber);
  return {
    day: dayNumber,
    targetRevenue: config.targetRevenue,
    ordersCompleted: 0,
    ordersLost: 0,
    perfectPizzas: 0,
    grossRevenue: 0,
    tipsEarned: 0,
    ingredientExpenses: 0,
    upgradeExpenses: 0,
    netProfit: 0,
    reputationChange: 0,
    targetAchieved: false,
  };
};

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      gamePhase: 'MAIN_MENU',
      hasSavedGame: false,
      currentDay: 1,
      shiftTimeRemaining: 70,
      shiftTotalDuration: 70,
      isPaused: false,

      coins: 45, // Healthy starting balance
      lifetimeRevenue: 0,
      lifetimeOrders: 0,
      reputation: 60,
      customerSatisfaction: 85,

      inventory: { ...INITIAL_INVENTORY },
      inventoryCapacity: DEFAULT_INVENTORY_CAPACITY,
      purchasedUpgradeIds: [],
      unlockedRecipeIds: ['margherita', 'pepperoni'],

      activeOrders: [],
      selectedOrderId: null,
      nextCustomerSpawnTimer: 4,

      currentPizza: createInitialPizza(),
      ovenSlots: createInitialOvenSlots(1),
      completedPizzas: [],

      dailyLedger: createInitialDailyLedger(1),
      pastDayStats: [],

      tutorialStep: 0,
      settings: {
        soundEnabled: true,
        soundVolume: 0.5,
        reducedMotion: false,
        fastMode: false,
      },
      toast: null,
      lastServeResult: null,

      setToast: (text, type = 'info') => {
        set({ toast: { id: Date.now().toString(), text, type } });
      },

      clearToast: () => set({ toast: null }),

      toggleSound: () => {
        const current = get().settings.soundEnabled;
        const next = !current;
        soundManager.setMuted(!next);
        set((state) => ({
          settings: { ...state.settings, soundEnabled: next },
        }));
      },

      setSettings: (newSettings) => {
        set((state) => {
          const updated = { ...state.settings, ...newSettings };
          if (typeof updated.soundEnabled === 'boolean') {
            soundManager.setMuted(!updated.soundEnabled);
          }
          if (typeof updated.soundVolume === 'number') {
            soundManager.setVolume(updated.soundVolume);
          }
          return { settings: updated };
        });
      },

      startNewGame: (skipTutorial = false) => {
        const config = getDayConfig(1);
        const newSlots = createInitialOvenSlots(1);
        const dayLedger = createInitialDailyLedger(1);

        set({
          gamePhase: skipTutorial ? 'SHIFT_ACTIVE' : 'TUTORIAL',
          hasSavedGame: true,
          currentDay: 1,
          shiftTimeRemaining: config.shiftDuration,
          shiftTotalDuration: config.shiftDuration,
          isPaused: false,
          coins: 45,
          lifetimeRevenue: 0,
          lifetimeOrders: 0,
          reputation: 60,
          customerSatisfaction: 85,
          inventory: { ...INITIAL_INVENTORY },
          inventoryCapacity: DEFAULT_INVENTORY_CAPACITY,
          purchasedUpgradeIds: [],
          unlockedRecipeIds: [...config.allowedRecipes],
          activeOrders: [],
          selectedOrderId: null,
          nextCustomerSpawnTimer: skipTutorial ? 3 : 9999, // In tutorial, spawn controlled order
          currentPizza: createInitialPizza(),
          ovenSlots: newSlots,
          completedPizzas: [],
          dailyLedger: dayLedger,
          pastDayStats: [],
          tutorialStep: skipTutorial ? 0 : 1,
          lastServeResult: null,
        });

        if (!skipTutorial) {
          // Spawn tutorial customer with Margherita
          const tutorialCust = createRandomCustomer('cust_tutorial', 'regular');
          tutorialCust.name = 'Sofia (First Guest)';
          const order: CustomerOrder = {
            id: 'order_tutorial_1',
            customerId: tutorialCust.id,
            customer: tutorialCust,
            recipeId: 'margherita',
            createdAt: Date.now(),
            totalPatience: 120, // generous tutorial patience
            patienceRemaining: 120,
            status: 'waiting',
            rewardModifiers: { tipBonus: 0, priceMultiplier: 1 },
          };
          set({
            activeOrders: [order],
            selectedOrderId: order.id,
          });
        }
      },

      continueGame: () => {
        const phase = get().gamePhase;
        if (phase === 'MAIN_MENU') {
          // If in tutorial or shift active, resume
          const nextPhase = get().tutorialStep > 0 && get().tutorialStep < 8 ? 'TUTORIAL' : 'SHIFT_ACTIVE';
          set({ gamePhase: nextPhase, isPaused: false });
        }
      },

      pauseGame: () => {
        set({ isPaused: true });
      },

      resumeGame: () => {
        set({ isPaused: false });
      },

      selectOrder: (orderId) => {
        set({ selectedOrderId: orderId });
      },

      // --- KITCHEN PIZZA BUILDER ACTIONS ---
      addDough: () => {
        const state = get();
        if (state.currentPizza.hasDough) {
          state.setToast('Dough is already prepped on the board!', 'warning');
          soundManager.playError();
          return false;
        }
        if ((state.inventory.dough || 0) <= 0) {
          state.setToast('Out of Artisan Dough! Visit the Supply Shop.', 'error');
          soundManager.playError();
          return false;
        }

        // Deduct inventory
        soundManager.playDoughSpread();
        set((s) => ({
          inventory: { ...s.inventory, dough: s.inventory.dough - 1 },
          currentPizza: {
            ...s.currentPizza,
            hasDough: true,
            ingredientCounts: {
              ...s.currentPizza.ingredientCounts,
              dough: (s.currentPizza.ingredientCounts.dough || 0) + 1,
            },
          },
        }));

        if (state.tutorialStep === 2) {
          get().advanceTutorial();
        }
        return true;
      },

      addSauce: () => {
        const state = get();
        if (!state.currentPizza.hasDough) {
          state.setToast('Roll out the dough base first!', 'warning');
          soundManager.playError();
          return false;
        }
        if (state.currentPizza.hasSauce) {
          state.setToast('Tomato sauce is already ladled!', 'warning');
          soundManager.playError();
          return false;
        }
        if ((state.inventory.tomato_sauce || 0) <= 0) {
          state.setToast('Out of San Marzano Tomato Sauce! Buy more in shop.', 'error');
          soundManager.playError();
          return false;
        }

        soundManager.playToppingPlace();
        set((s) => ({
          inventory: { ...s.inventory, tomato_sauce: s.inventory.tomato_sauce - 1 },
          currentPizza: {
            ...s.currentPizza,
            hasSauce: true,
            ingredientCounts: {
              ...s.currentPizza.ingredientCounts,
              tomato_sauce: (s.currentPizza.ingredientCounts.tomato_sauce || 0) + 1,
            },
          },
        }));

        if (state.tutorialStep === 3) {
          get().advanceTutorial();
        }
        return true;
      },

      addCheese: (cheeseId) => {
        const state = get();
        if (!state.currentPizza.hasDough) {
          state.setToast('Roll out the dough base first!', 'warning');
          soundManager.playError();
          return false;
        }
        if ((state.inventory[cheeseId] || 0) <= 0) {
          const ingDef = INGREDIENT_DEFINITIONS[cheeseId];
          state.setToast(`Out of ${ingDef?.name || cheeseId}! Restock in shop.`, 'error');
          soundManager.playError();
          return false;
        }

        // Max 2 portions of same cheese
        const currentCount = state.currentPizza.cheeses.filter((c) => c === cheeseId).length;
        if (currentCount >= 2) {
          state.setToast(`Enough ${INGREDIENT_DEFINITIONS[cheeseId]?.name || cheeseId} added!`, 'info');
          return false;
        }

        soundManager.playToppingPlace();
        set((s) => ({
          inventory: { ...s.inventory, [cheeseId]: s.inventory[cheeseId] - 1 },
          currentPizza: {
            ...s.currentPizza,
            cheeses: [...s.currentPizza.cheeses, cheeseId],
            ingredientCounts: {
              ...s.currentPizza.ingredientCounts,
              [cheeseId]: (s.currentPizza.ingredientCounts[cheeseId] || 0) + 1,
            },
          },
        }));

        if (state.tutorialStep === 4 && cheeseId === 'mozzarella') {
          get().advanceTutorial();
        }
        return true;
      },

      addTopping: (toppingId) => {
        const state = get();
        if (!state.currentPizza.hasDough) {
          state.setToast('Roll out the dough base first!', 'warning');
          soundManager.playError();
          return false;
        }
        if ((state.inventory[toppingId] || 0) <= 0) {
          const ingDef = INGREDIENT_DEFINITIONS[toppingId];
          state.setToast(`Out of ${ingDef?.name || toppingId}! Check supply shop.`, 'error');
          soundManager.playError();
          return false;
        }

        // Max 3 portions of any single topping
        const existingCount = state.currentPizza.toppings.filter((t) => t === toppingId).length;
        if (existingCount >= 2) {
          state.setToast(`Plentiful ${INGREDIENT_DEFINITIONS[toppingId]?.name || toppingId} already on pie!`, 'info');
          return false;
        }

        // Deterministic visual scatter coordinates for topping pieces
        const baseSeed = toppingId.charCodeAt(0) + toppingId.charCodeAt(1) * 3 + existingCount * 17;
        const numPieces = 6;
        const newPlacements: ToppingPlacement[] = [];

        for (let i = 0; i < numPieces; i++) {
          const angle = ((baseSeed + i * 60 + (i % 2) * 25) * Math.PI) / 180;
          const radiusPercent = 18 + ((baseSeed * (i + 1)) % 38); // stay within crust
          const x = Math.round(Math.cos(angle) * radiusPercent);
          const y = Math.round(Math.sin(angle) * radiusPercent);
          const rotation = (baseSeed * 13 + i * 45) % 360;
          const scale = 0.85 + (((baseSeed + i) % 30) / 100);

          newPlacements.push({
            ingredientId: toppingId,
            x,
            y,
            rotation,
            scale,
          });
        }

        soundManager.playToppingPlace();
        set((s) => ({
          inventory: { ...s.inventory, [toppingId]: s.inventory[toppingId] - 1 },
          currentPizza: {
            ...s.currentPizza,
            toppings: [...s.currentPizza.toppings, toppingId],
            toppingPlacements: [...s.currentPizza.toppingPlacements, ...newPlacements],
            ingredientCounts: {
              ...s.currentPizza.ingredientCounts,
              [toppingId]: (s.currentPizza.ingredientCounts[toppingId] || 0) + 1,
            },
          },
        }));

        return true;
      },

      resetPizza: () => {
        const state = get();
        if (!state.currentPizza.hasDough && state.currentPizza.toppings.length === 0) {
          return;
        }
        // Note: discarded ingredients are not refunded (realistic culinary scrap cost)
        soundManager.playError();
        state.setToast('Pizza discarded. Kitchen prep board reset.', 'info');
        set({ currentPizza: createInitialPizza() });
      },

      // --- OVEN ACTIONS ---
      placePizzaInOven: (targetSlotIndex) => {
        const state = get();
        if (!state.currentPizza.hasDough) {
          state.setToast('There is no pizza on the prep board!', 'warning');
          soundManager.playError();
          return false;
        }

        // Find available slot
        const slots = [...state.ovenSlots];
        let slotIndex = typeof targetSlotIndex === 'number' ? targetSlotIndex : -1;
        if (slotIndex === -1 || slots[slotIndex].isCooking) {
          slotIndex = slots.findIndex((s) => !s.isCooking && s.pizza === null);
        }

        if (slotIndex === -1) {
          state.setToast('All oven slots are occupied! Wait or upgrade oven capacity.', 'warning');
          soundManager.playError();
          return false;
        }

        // Check if turbo hearth upgrade is active
        const hasTurbo = state.purchasedUpgradeIds.includes('turbo_hearth');
        // Calculate ideal cooking duration based on toppings
        const activeOrder = state.activeOrders.find((o) => o.id === state.selectedOrderId);
        const recipe = activeOrder ? RECIPE_DEFINITIONS[activeOrder.recipeId] : RECIPE_DEFINITIONS.margherita;
        let targetCookingTime = recipe ? recipe.idealCookingDuration : 8;
        if (hasTurbo) {
          targetCookingTime = Math.round(targetCookingTime * 0.75 * 10) / 10;
        }

        slots[slotIndex] = {
          slotIndex,
          pizza: state.currentPizza,
          cookingTime: 0,
          targetCookingTime,
          quality: 'raw',
          isCooking: true,
        };

        soundManager.playDoughSpread();
        set({
          ovenSlots: slots,
          currentPizza: createInitialPizza(),
        });

        state.setToast(`Pizza slid into Oven Slot #${slotIndex + 1}!`, 'success');

        if (state.tutorialStep === 5) {
          get().advanceTutorial();
        }
        return true;
      },

      removePizzaFromOven: (slotIndex) => {
        const state = get();
        const slots = [...state.ovenSlots];
        const slot = slots[slotIndex];

        if (!slot || !slot.pizza || !slot.isCooking) {
          state.setToast('No pizza currently baking in this slot!', 'warning');
          return false;
        }

        const pizza = slot.pizza;
        const cookingTime = slot.cookingTime;
        const evalState = evaluateCookingState(cookingTime, slot.targetCookingTime);

        // Clear the slot
        slots[slotIndex] = {
          slotIndex,
          pizza: null,
          cookingTime: 0,
          targetCookingTime: 8,
          quality: 'raw',
          isCooking: false,
        };

        // Add to completed queue
        const completedItem = {
          id: `completed_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          pizza,
          cookingTime,
          createdAt: Date.now(),
        };

        soundManager.playOvenReady();
        set({
          ovenSlots: slots,
          completedPizzas: [completedItem, ...state.completedPizzas],
        });

        state.setToast(`Pizza pulled from oven! Quality: ${evalState.statusText}`, evalState.quality === 'perfect' ? 'success' : 'info');

        if (state.tutorialStep === 6) {
          get().advanceTutorial();
        }
        return true;
      },

      discardCompletedPizza: (completedPizzaId) => {
        set((state) => ({
          completedPizzas: state.completedPizzas.filter((p) => p.id !== completedPizzaId),
        }));
        get().setToast('Burnt or extra pizza cleared from serving counter.', 'info');
      },

      // --- SERVING & ORDER COMPLETION ---
      serveOrder: (orderId, completedPizzaId) => {
        const state = get();
        const order = state.activeOrders.find((o) => o.id === orderId);
        const completedItem = state.completedPizzas.find((p) => p.id === completedPizzaId);

        if (!order) {
          state.setToast('Order no longer active!', 'warning');
          return false;
        }
        if (!completedItem) {
          state.setToast('Please select a baked pizza from the serving counter!', 'warning');
          return false;
        }

        // Decor bonus calculation
        let decorBonus = 0;
        if (state.purchasedUpgradeIds.includes('charming_plants_decor')) decorBonus += 0.15;
        if (state.purchasedUpgradeIds.includes('neon_sign_decor')) decorBonus += 0.15;

        const result = calculateOrderReward(order, completedItem.pizza, completedItem.cookingTime, decorBonus);

        if (!result.success && result.totalCoinsEarned <= 2) {
          // Failure / Rejection
          soundManager.playOrderLost();
          state.setToast(result.feedbackMessage, 'error');

          // Remove completed pizza and penalize reputation
          set((s) => ({
            completedPizzas: s.completedPizzas.filter((p) => p.id !== completedPizzaId),
            reputation: Math.max(0, s.reputation + result.reputationDelta),
            customerSatisfaction: Math.max(10, s.customerSatisfaction - 12),
            lastServeResult: {
              message: result.feedbackMessage,
              coins: result.totalCoinsEarned,
              isPerfect: false,
              success: false,
            },
            dailyLedger: {
              ...s.dailyLedger,
              ordersLost: s.dailyLedger.ordersLost + 1,
              netProfit: s.dailyLedger.netProfit + result.totalCoinsEarned,
              reputationChange: s.dailyLedger.reputationChange + result.reputationDelta,
            },
          }));
          return false;
        }

        // Success!
        soundManager.playServeSuccess();
        setTimeout(() => soundManager.playCoinsEarned(), 250);

        const newCoins = state.coins + result.totalCoinsEarned;
        const newSatisfaction = Math.min(100, Math.round(state.customerSatisfaction * 0.85 + (result.isPerfectOrder ? 100 : 80) * 0.15));
        const newReputation = Math.min(100, Math.max(0, state.reputation + result.reputationDelta));

        set((s) => ({
          coins: newCoins,
          lifetimeRevenue: s.lifetimeRevenue + result.totalCoinsEarned,
          lifetimeOrders: s.lifetimeOrders + 1,
          reputation: newReputation,
          customerSatisfaction: newSatisfaction,
          activeOrders: s.activeOrders.filter((o) => o.id !== orderId),
          selectedOrderId: s.activeOrders.filter((o) => o.id !== orderId)[0]?.id || null,
          completedPizzas: s.completedPizzas.filter((p) => p.id !== completedPizzaId),
          lastServeResult: {
            message: result.feedbackMessage,
            coins: result.totalCoinsEarned,
            isPerfect: result.isPerfectOrder,
            success: true,
          },
          dailyLedger: {
            ...s.dailyLedger,
            ordersCompleted: s.dailyLedger.ordersCompleted + 1,
            perfectPizzas: s.dailyLedger.perfectPizzas + (result.isPerfectOrder ? 1 : 0),
            grossRevenue: s.dailyLedger.grossRevenue + result.baseReward + result.speedBonus,
            tipsEarned: s.dailyLedger.tipsEarned + result.tipAmount,
            netProfit: s.dailyLedger.netProfit + result.totalCoinsEarned,
            reputationChange: s.dailyLedger.reputationChange + result.reputationDelta,
          },
        }));

        state.setToast(`Served ${order.customer.name}! +${result.totalCoinsEarned} Coins (${result.feedbackMessage})`, 'success');

        if (state.tutorialStep === 7) {
          get().advanceTutorial();
        }
        return true;
      },

      // --- ECONOMY & PURCHASING ---
      buyIngredientPack: (ingredientId, count = 1) => {
        const state = get();
        const ingDef = INGREDIENT_DEFINITIONS[ingredientId];
        if (!ingDef) return false;

        const hasWholesalerDiscount = state.purchasedUpgradeIds.includes('bulk_wholesaler_contract');
        const discountMultiplier = hasWholesalerDiscount ? 0.85 : 1.0;

        const singlePackPrice = Math.round(ingDef.packPrice * discountMultiplier);
        const totalPrice = singlePackPrice * count;
        const totalItems = ingDef.packSize * count;

        if (state.coins < totalPrice) {
          state.setToast(`Insufficient coins! Need ${totalPrice} coins for ${count}x ${ingDef.name}.`, 'warning');
          soundManager.playError();
          return false;
        }

        const currentStock = state.inventory[ingredientId] || 0;
        if (currentStock + totalItems > state.inventoryCapacity) {
          state.setToast(`Pantry is full! Max capacity is ${state.inventoryCapacity} units per item. Upgrade storage!`, 'warning');
          soundManager.playError();
          return false;
        }

        soundManager.playPurchase();
        set((s) => ({
          coins: s.coins - totalPrice,
          inventory: {
            ...s.inventory,
            [ingredientId]: (s.inventory[ingredientId] || 0) + totalItems,
          },
          dailyLedger: {
            ...s.dailyLedger,
            ingredientExpenses: s.dailyLedger.ingredientExpenses + totalPrice,
            netProfit: s.dailyLedger.netProfit - totalPrice,
          },
        }));

        state.setToast(`Purchased ${totalItems}x ${ingDef.name} for ${totalPrice} coins.`, 'success');
        return true;
      },

      buyUpgrade: (upgradeId) => {
        const state = get();
        const upgrade = UPGRADE_DEFINITIONS.find((u) => u.id === upgradeId);
        if (!upgrade) return false;

        if (state.purchasedUpgradeIds.includes(upgradeId)) {
          state.setToast('This upgrade is already purchased!', 'info');
          return false;
        }

        if (state.coins < upgrade.cost) {
          state.setToast(`Need ${upgrade.cost} coins for ${upgrade.name}!`, 'warning');
          soundManager.playError();
          return false;
        }

        soundManager.playPurchase();

        // Specific upgrade effects
        let newCapacity = state.inventoryCapacity;
        let newSlots = [...state.ovenSlots];

        if (upgradeId === 'storage_expansion_1') newCapacity = 50;
        if (upgradeId === 'storage_expansion_2') newCapacity = 80;

        if (upgradeId === 'oven_slot_2') {
          if (newSlots.length < 2) {
            newSlots.push({
              slotIndex: 1,
              pizza: null,
              cookingTime: 0,
              targetCookingTime: 8,
              quality: 'raw',
              isCooking: false,
            });
          }
        }
        if (upgradeId === 'oven_slot_3') {
          while (newSlots.length < 3) {
            newSlots.push({
              slotIndex: newSlots.length,
              pizza: null,
              cookingTime: 0,
              targetCookingTime: 8,
              quality: 'raw',
              isCooking: false,
            });
          }
        }

        set((s) => ({
          coins: s.coins - upgrade.cost,
          purchasedUpgradeIds: [...s.purchasedUpgradeIds, upgradeId],
          inventoryCapacity: newCapacity,
          ovenSlots: newSlots,
          dailyLedger: {
            ...s.dailyLedger,
            upgradeExpenses: s.dailyLedger.upgradeExpenses + upgrade.cost,
            netProfit: s.dailyLedger.netProfit - upgrade.cost,
          },
        }));

        state.setToast(`Upgraded: ${upgrade.name}! ${upgrade.effectDescription}`, 'success');
        return true;
      },

      claimEmergencyBailout: () => {
        const state = get();
        // Give 35 coins grant from Neighborhood Guild
        soundManager.playCoinsEarned();
        set((s) => ({
          coins: s.coins + 35,
          inventory: {
            ...s.inventory,
            dough: Math.max(s.inventory.dough, 5),
            tomato_sauce: Math.max(s.inventory.tomato_sauce, 5),
            mozzarella: Math.max(s.inventory.mozzarella, 5),
          },
        }));
        state.setToast('Neighborhood Baker’s Guild emergency grant received! (+35 Coins & basic pantry)', 'success');
      },

      // --- CLOCK TICK LOOP ---
      tick: (deltaSeconds) => {
        const state = get();
        if (state.isPaused) return;

        // In Tutorial, don't tick down the shift countdown
        if (state.gamePhase === 'TUTORIAL') return;

        if (state.gamePhase !== 'SHIFT_ACTIVE') return;

        // 1. Shift Timer
        const newShiftTime = Math.max(0, state.shiftTimeRemaining - deltaSeconds);
        const shiftEnded = newShiftTime <= 0;

        // 2. Oven Cooking Simulation
        let ovenSlotsUpdated = false;
        const newOvenSlots = state.ovenSlots.map((slot) => {
          if (!slot.isCooking || !slot.pizza) return slot;
          ovenSlotsUpdated = true;
          const newTime = slot.cookingTime + deltaSeconds;
          const evalState = evaluateCookingState(newTime, slot.targetCookingTime);
          return {
            ...slot,
            cookingTime: newTime,
            quality: evalState.quality,
          };
        });

        // 3. Customer Patience Simulation
        const currentOrders = [...state.activeOrders];
        const survivingOrders: CustomerOrder[] = [];
        let lostOrdersCount = 0;
        let reputationLoss = 0;

        for (const order of currentOrders) {
          const newPatience = order.patienceRemaining - deltaSeconds;
          if (newPatience <= 0) {
            // Customer walked out!
            lostOrdersCount++;
            reputationLoss += 4;
            soundManager.playOrderLost();
          } else {
            survivingOrders.push({
              ...order,
              patienceRemaining: newPatience,
            });
          }
        }

        if (lostOrdersCount > 0) {
          state.setToast(`${lostOrdersCount} customer(s) ran out of patience and left!`, 'warning');
        }

        // 4. Customer Spawn
        let newSpawnTimer = state.nextCustomerSpawnTimer - deltaSeconds;
        const dayConfig = getDayConfig(state.currentDay);

        if (newSpawnTimer <= 0 && survivingOrders.length < dayConfig.maxActiveCustomers && newShiftTime > 12) {
          // Generate new customer
          const customerTypePool = dayConfig.allowedCustomerTypes;
          const chosenType = customerTypePool[Math.floor(Math.random() * customerTypePool.length)];
          const newCustomer = createRandomCustomer(`cust_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`, chosenType);

          // Decor patience bonus
          let patienceBonusMultiplier = 1.0;
          if (state.purchasedUpgradeIds.includes('cozy_music_player')) patienceBonusMultiplier += 0.2;

          const basePatience = Math.round((38 + Math.random() * 20) * newCustomer.patienceMultiplier * patienceBonusMultiplier);

          const recipePool = dayConfig.allowedRecipes;
          const recipeId = recipePool[Math.floor(Math.random() * recipePool.length)];

          const newOrder: CustomerOrder = {
            id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            customerId: newCustomer.id,
            customer: newCustomer,
            recipeId,
            createdAt: Date.now(),
            totalPatience: basePatience,
            patienceRemaining: basePatience,
            status: 'waiting',
            rewardModifiers: { tipBonus: 0, priceMultiplier: 1 },
          };

          survivingOrders.push(newOrder);
          soundManager.playCustomerArrive();

          // Reset spawn timer
          const intervalSpan = dayConfig.customerSpawnMaxInterval - dayConfig.customerSpawnMinInterval;
          newSpawnTimer = dayConfig.customerSpawnMinInterval + Math.random() * intervalSpan;
        }

        // Check if selected order still exists
        let currentSelected = state.selectedOrderId;
        if (currentSelected && !survivingOrders.some((o) => o.id === currentSelected)) {
          currentSelected = survivingOrders[0]?.id || null;
        } else if (!currentSelected && survivingOrders.length > 0) {
          currentSelected = survivingOrders[0].id;
        }

        set((s) => ({
          shiftTimeRemaining: newShiftTime,
          ovenSlots: ovenSlotsUpdated ? newOvenSlots : s.ovenSlots,
          activeOrders: survivingOrders,
          selectedOrderId: currentSelected,
          nextCustomerSpawnTimer: newSpawnTimer,
          reputation: Math.max(0, s.reputation - reputationLoss),
          customerSatisfaction: lostOrdersCount > 0 ? Math.max(10, s.customerSatisfaction - lostOrdersCount * 5) : s.customerSatisfaction,
          dailyLedger: {
            ...s.dailyLedger,
            ordersLost: s.dailyLedger.ordersLost + lostOrdersCount,
            reputationChange: s.dailyLedger.reputationChange - reputationLoss,
          },
        }));

        if (shiftEnded) {
          get().finishShift();
        }
      },

      // --- SHIFT COMPLETION & RESULTS ---
      finishShift: () => {
        const state = get();
        const config = getDayConfig(state.currentDay);
        const dayLedger = state.dailyLedger;
        const targetAchieved = dayLedger.grossRevenue >= config.targetRevenue;

        // Completion bonus if target achieved
        let bonusCoins = 0;
        if (targetAchieved) {
          bonusCoins = config.completionBonus;
        }

        const updatedLedger: DailyLedger = {
          ...dayLedger,
          targetAchieved,
          netProfit: dayLedger.netProfit + bonusCoins,
        };

        const isFinalCampaignDay = state.currentDay >= 10;

        set((s) => ({
          coins: s.coins + bonusCoins,
          gamePhase: isFinalCampaignDay ? 'CAMPAIGN_COMPLETE' : 'DAY_RESULTS',
          dailyLedger: updatedLedger,
          pastDayStats: [...s.pastDayStats, updatedLedger],
        }));

        if (targetAchieved) {
          soundManager.playServeSuccess();
        } else {
          soundManager.playOrderLost();
        }
      },

      startNextDay: () => {
        const state = get();
        const nextDay = state.currentDay + 1;
        const nextConfig = getDayConfig(nextDay);
        const nextDayLedger = createInitialDailyLedger(nextDay);

        // Reset kitchen station
        const activeSlots = state.ovenSlots.map((s) => ({
          ...s,
          pizza: null,
          cookingTime: 0,
          quality: 'raw' as const,
          isCooking: false,
        }));

        set({
          gamePhase: 'SHIFT_ACTIVE',
          currentDay: nextDay,
          shiftTimeRemaining: nextConfig.shiftDuration,
          shiftTotalDuration: nextConfig.shiftDuration,
          isPaused: false,
          activeOrders: [],
          selectedOrderId: null,
          nextCustomerSpawnTimer: 3,
          currentPizza: createInitialPizza(),
          ovenSlots: activeSlots,
          completedPizzas: [],
          dailyLedger: nextDayLedger,
          unlockedRecipeIds: [...nextConfig.allowedRecipes],
          lastServeResult: null,
        });

        get().setToast(`Day ${nextDay} commenced! Target: ${nextConfig.targetRevenue} Coins. Good luck chef!`, 'info');
      },

      restartDay: () => {
        const state = get();
        const config = getDayConfig(state.currentDay);
        const dayLedger = createInitialDailyLedger(state.currentDay);
        const activeSlots = state.ovenSlots.map((s) => ({
          ...s,
          pizza: null,
          cookingTime: 0,
          quality: 'raw' as const,
          isCooking: false,
        }));

        set({
          gamePhase: 'SHIFT_ACTIVE',
          shiftTimeRemaining: config.shiftDuration,
          shiftTotalDuration: config.shiftDuration,
          isPaused: false,
          activeOrders: [],
          selectedOrderId: null,
          nextCustomerSpawnTimer: 3,
          currentPizza: createInitialPizza(),
          ovenSlots: activeSlots,
          completedPizzas: [],
          dailyLedger: dayLedger,
          lastServeResult: null,
        });
      },

      // --- TUTORIAL PROGRESSION ---
      advanceTutorial: () => {
        const current = get().tutorialStep;
        const next = current + 1;
        if (next > 7) {
          // Tutorial finished!
          set({
            tutorialStep: 0,
            gamePhase: 'SHIFT_ACTIVE',
            shiftTimeRemaining: 70,
            shiftTotalDuration: 70,
            nextCustomerSpawnTimer: 4,
          });
          get().setToast('Tutorial Complete! Real lunch rush begins now. Have fun!', 'success');
        } else {
          set({ tutorialStep: next });
        }
      },

      skipTutorial: () => {
        const config = getDayConfig(1);
        set({
          tutorialStep: 0,
          gamePhase: 'SHIFT_ACTIVE',
          shiftTimeRemaining: config.shiftDuration,
          shiftTotalDuration: config.shiftDuration,
          activeOrders: [],
          selectedOrderId: null,
          nextCustomerSpawnTimer: 3,
          currentPizza: createInitialPizza(),
          completedPizzas: [],
        });
        get().setToast('Tutorial skipped. Pizzeria is open for business!', 'info');
      },

      resetProgress: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
        const config = getDayConfig(1);
        set({
          gamePhase: 'MAIN_MENU',
          hasSavedGame: false,
          currentDay: 1,
          shiftTimeRemaining: 70,
          shiftTotalDuration: 70,
          isPaused: false,
          coins: 45,
          lifetimeRevenue: 0,
          lifetimeOrders: 0,
          reputation: 60,
          customerSatisfaction: 85,
          inventory: { ...INITIAL_INVENTORY },
          inventoryCapacity: DEFAULT_INVENTORY_CAPACITY,
          purchasedUpgradeIds: [],
          unlockedRecipeIds: ['margherita', 'pepperoni'],
          activeOrders: [],
          selectedOrderId: null,
          nextCustomerSpawnTimer: 4,
          currentPizza: createInitialPizza(),
          ovenSlots: createInitialOvenSlots(1),
          completedPizzas: [],
          dailyLedger: createInitialDailyLedger(1),
          pastDayStats: [],
          tutorialStep: 0,
          toast: null,
          lastServeResult: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage;
        }
        const memoryStorage: Record<string, string> = {};
        return {
          getItem: (key: string) => memoryStorage[key] || null,
          setItem: (key: string, value: string) => {
            memoryStorage[key] = value;
          },
          removeItem: (key: string) => {
            delete memoryStorage[key];
          },
        };
      }),
      partialize: (state) => ({
        hasSavedGame: state.hasSavedGame,
        currentDay: state.currentDay,
        coins: state.coins,
        lifetimeRevenue: state.lifetimeRevenue,
        lifetimeOrders: state.lifetimeOrders,
        reputation: state.reputation,
        customerSatisfaction: state.customerSatisfaction,
        inventory: state.inventory,
        inventoryCapacity: state.inventoryCapacity,
        purchasedUpgradeIds: state.purchasedUpgradeIds,
        unlockedRecipeIds: state.unlockedRecipeIds,
        settings: state.settings,
        pastDayStats: state.pastDayStats,
        tutorialStep: state.tutorialStep,
      }),
    }
  )
);
