import { RECIPE_DEFINITIONS } from '../config/recipes';
import { CustomerOrder, PreparedPizza, RecipeId } from '../types/game';
import { evaluateCookingState } from './cooking';
import { validatePizzaForRecipe } from './pizzaValidation';

export interface ServeResult {
  success: boolean;
  baseReward: number;
  accuracyMultiplier: number;
  cookingQualityMultiplier: number;
  speedBonus: number;
  tipAmount: number;
  totalCoinsEarned: number;
  reputationDelta: number;
  feedbackMessage: string;
  isPerfectOrder: boolean;
  quality: string;
}

export function calculateOrderReward(
  order: CustomerOrder,
  pizza: PreparedPizza,
  cookingTime: number,
  decorBonusMultiplier: number = 0 // from shop decor upgrades
): ServeResult {
  const recipe = RECIPE_DEFINITIONS[order.recipeId];
  if (!recipe) {
    return {
      success: false,
      baseReward: 0,
      accuracyMultiplier: 0,
      cookingQualityMultiplier: 0,
      speedBonus: 0,
      tipAmount: 0,
      totalCoinsEarned: 0,
      reputationDelta: -5,
      feedbackMessage: 'Invalid order recipe!',
      isPerfectOrder: false,
      quality: 'raw',
    };
  }

  const validation = validatePizzaForRecipe(pizza, order.recipeId);
  const cookingEval = evaluateCookingState(cookingTime, recipe.idealCookingDuration);

  // If completely burnt, customer rejects or pays tiny salvage fee with heavy reputation loss
  if (cookingEval.quality === 'burnt') {
    return {
      success: false,
      baseReward: 2,
      accuracyMultiplier: 0.1,
      cookingQualityMultiplier: 0.15,
      speedBonus: 0,
      tipAmount: 0,
      totalCoinsEarned: 2,
      reputationDelta: -8,
      feedbackMessage: 'The pizza is completely burnt! Customer is deeply disappointed.',
      isPerfectOrder: false,
      quality: cookingEval.quality,
    };
  }

  // If raw or undercooked:
  if (cookingEval.quality === 'raw' || (cookingEval.quality === 'undercooked' && cookingTime < recipe.idealCookingDuration * 0.5)) {
    return {
      success: false,
      baseReward: 0,
      accuracyMultiplier: 0,
      cookingQualityMultiplier: 0.2,
      speedBonus: 0,
      tipAmount: 0,
      totalCoinsEarned: 0,
      reputationDelta: -6,
      feedbackMessage: 'The pizza dough is completely raw inside!',
      isPerfectOrder: false,
      quality: cookingEval.quality,
    };
  }

  // Check if accuracy is acceptable
  if (!validation.isMatch) {
    return {
      success: false,
      baseReward: Math.round(recipe.basePrice * 0.3),
      accuracyMultiplier: validation.accuracy / 100,
      cookingQualityMultiplier: cookingEval.scoreMultiplier,
      speedBonus: 0,
      tipAmount: 0,
      totalCoinsEarned: Math.round(recipe.basePrice * 0.3),
      reputationDelta: -5,
      feedbackMessage: `Wrong pizza! Missing: ${validation.missingIngredients.join(', ')}`,
      isPerfectOrder: false,
      quality: cookingEval.quality,
    };
  }

  // Base payout calculation
  const accuracyMultiplier = validation.accuracy / 100;
  const cookingQualityMultiplier = cookingEval.scoreMultiplier;

  // Speed bonus:
  // Ratio of remaining patience
  const patienceRatio = Math.max(0, order.patienceRemaining / order.totalPatience);
  let speedBonus = 0;
  if (patienceRatio >= 0.7) {
    speedBonus = Math.round(recipe.basePrice * 0.25); // +25% lightning speed bonus
  } else if (patienceRatio >= 0.4) {
    speedBonus = Math.round(recipe.basePrice * 0.12);
  }

  // Tip calculation based on customer personality and decor
  const baseTip = Math.round(recipe.basePrice * 0.15);
  const personalityTipMultiplier = order.customer.tipMultiplier;
  const decorBonus = 1 + decorBonusMultiplier;

  let tipAmount = Math.round(baseTip * personalityTipMultiplier * decorBonus);
  if (cookingEval.quality === 'undercooked' || cookingEval.quality === 'overcooked') {
    tipAmount = Math.round(tipAmount * 0.4);
  }

  // Check if perfect order
  const isPerfectOrder = validation.isPerfect && cookingEval.quality === 'perfect';
  const perfectBonus = isPerfectOrder ? recipe.perfectOrderBonus : 0;

  const baseReward = Math.round(recipe.basePrice * accuracyMultiplier * cookingQualityMultiplier);
  const totalCoinsEarned = Math.max(1, baseReward + speedBonus + tipAmount + perfectBonus);

  // Reputation delta
  let reputationDelta = 3;
  if (isPerfectOrder) {
    reputationDelta = 6;
  } else if (cookingEval.quality === 'undercooked' || cookingEval.quality === 'overcooked') {
    reputationDelta = 1;
  }
  if (order.customer.type === 'vip') {
    reputationDelta = Math.round(reputationDelta * 1.5);
  }

  let feedbackMessage = 'Delicious! Customer was very happy!';
  if (isPerfectOrder) {
    feedbackMessage = 'Flawless execution! 5-Star review!';
  } else if (cookingEval.quality === 'overcooked') {
    feedbackMessage = 'A bit overbaked, but tasty nonetheless.';
  } else if (cookingEval.quality === 'undercooked') {
    feedbackMessage = 'Slightly doughy, but satisfied hunger.';
  }

  return {
    success: true,
    baseReward,
    accuracyMultiplier,
    cookingQualityMultiplier,
    speedBonus,
    tipAmount: tipAmount + perfectBonus,
    totalCoinsEarned,
    reputationDelta,
    feedbackMessage,
    isPerfectOrder,
    quality: cookingEval.quality,
  };
}
