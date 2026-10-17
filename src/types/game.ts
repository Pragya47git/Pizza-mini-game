export type GamePhase =
  | 'MAIN_MENU'
  | 'TUTORIAL'
  | 'SHIFT_ACTIVE'
  | 'SHIFT_PAUSED'
  | 'DAY_RESULTS'
  | 'CAMPAIGN_COMPLETE'
  | 'GAME_OVER';

export type IngredientId =
  | 'dough'
  | 'tomato_sauce'
  | 'mozzarella'
  | 'pepperoni'
  | 'mushrooms'
  | 'olives'
  | 'bell_peppers'
  | 'onions'
  | 'parmesan'
  | 'cheddar'
  | 'gorgonzola'
  | 'basil';

export type IngredientCategory = 'base' | 'sauce' | 'cheese' | 'topping';

export interface IngredientDefinition {
  id: IngredientId;
  name: string;
  category: IngredientCategory;
  packSize: number;
  packPrice: number;
  unitCost: number; // calculated packPrice / packSize
  color: string;
  accentColor: string;
  unlockDay: number;
  description: string;
}

export type RecipeId =
  | 'margherita'
  | 'pepperoni'
  | 'veggie_supreme'
  | 'mushroom_delight'
  | 'four_cheese'
  | 'spicy_diablo'
  | 'rustic_basilico';

export interface PizzaRecipe {
  id: RecipeId;
  name: string;
  description: string;
  basePrice: number;
  requiredIngredients: Record<IngredientId, number>;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Master';
  idealCookingDuration: number; // in seconds
  unlockDay: number;
  perfectOrderBonus: number;
  imageAccentColor: string;
}

export type CustomerType = 'regular' | 'impatient' | 'generous' | 'vip' | 'special_request';

export interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  avatarStyle: {
    skinTone: string;
    hairColor: string;
    accessory: 'glasses' | 'hat' | 'scarf' | 'chef_band' | 'none';
    expression: 'happy' | 'neutral' | 'impatient' | 'excited';
    shirtColor: string;
  };
  patienceMultiplier: number;
  tipMultiplier: number;
  reputationMultiplier: number;
}

export type OrderStatus = 'waiting' | 'in_progress' | 'ready_to_serve' | 'served' | 'expired';

export interface CustomerOrder {
  id: string;
  customerId: string;
  customer: Customer;
  recipeId: RecipeId;
  specialRequest?: 'extra_crispy' | 'light_bake' | 'extra_cheese' | 'no_onions';
  createdAt: number;
  totalPatience: number; // in seconds
  patienceRemaining: number; // in seconds
  status: OrderStatus;
  rewardModifiers: {
    tipBonus: number;
    priceMultiplier: number;
  };
}

export interface ToppingPlacement {
  ingredientId: IngredientId;
  x: number; // percentage from center
  y: number; // percentage from center
  rotation: number; // degrees
  scale: number;
}

export interface PreparedPizza {
  id: string;
  hasDough: boolean;
  hasSauce: boolean;
  cheeses: IngredientId[];
  toppings: IngredientId[];
  toppingPlacements: ToppingPlacement[];
  ingredientCounts: Partial<Record<IngredientId, number>>;
  createdAt: number;
}

export type CookingQuality = 'raw' | 'undercooked' | 'perfect' | 'overcooked' | 'burnt';

export interface OvenSlotState {
  slotIndex: number;
  pizza: PreparedPizza | null;
  cookingTime: number; // elapsed in seconds
  targetCookingTime: number; // target seconds
  quality: CookingQuality;
  isCooking: boolean;
}

export type UpgradeCategory = 'equipment' | 'efficiency' | 'decor' | 'storage';

export interface UpgradeDefinition {
  id: string;
  name: string;
  category: UpgradeCategory;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  unlockDay: number;
  effectDescription: string;
  purchased: boolean;
}

export interface DailyLedger {
  day: number;
  targetRevenue: number;
  ordersCompleted: number;
  ordersLost: number;
  perfectPizzas: number;
  grossRevenue: number;
  tipsEarned: number;
  ingredientExpenses: number;
  upgradeExpenses: number;
  netProfit: number;
  reputationChange: number;
  targetAchieved: boolean;
}

export interface DayConfig {
  day: number;
  shiftDuration: number; // in seconds (e.g. 75 - 120s)
  targetRevenue: number;
  maxActiveCustomers: number;
  customerSpawnMinInterval: number; // seconds
  customerSpawnMaxInterval: number; // seconds
  allowedRecipes: RecipeId[];
  allowedCustomerTypes: CustomerType[];
  narrativeIntro: string;
  completionBonus: number;
}

export interface TutorialStep {
  id: number;
  title: string;
  description: string;
  highlightElementId?: string;
  actionRequired:
    | 'select_order'
    | 'add_dough'
    | 'add_sauce'
    | 'add_cheese'
    | 'put_in_oven'
    | 'wait_and_remove'
    | 'serve_order'
    | 'inspect_shop'
    | 'finish_tutorial';
}

export interface GameSettings {
  soundEnabled: boolean;
  soundVolume: number;
  reducedMotion: boolean;
  fastMode: boolean;
}

export interface GameSaveSchema {
  version: number;
  lastSaved: number;
  currentDay: number;
  coins: number;
  lifetimeRevenue: number;
  lifetimeOrders: number;
  reputation: number; // 0 - 100
  inventory: Record<IngredientId, number>;
  inventoryCapacity: number;
  purchasedUpgradeIds: string[];
  unlockedRecipeIds: RecipeId[];
  tutorialCompleted: boolean;
  settings: GameSettings;
  pastDayStats: DailyLedger[];
}
