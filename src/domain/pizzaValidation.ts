import { RECIPE_DEFINITIONS } from '../config/recipes';
import { IngredientId, PreparedPizza, RecipeId } from '../types/game';

export interface ValidationResult {
  isMatch: boolean;
  accuracy: number; // 0 to 100
  isPerfect: boolean;
  missingIngredients: IngredientId[];
  extraIngredients: IngredientId[];
  feedbackNotes: string[];
}

export function validatePizzaForRecipe(pizza: PreparedPizza, recipeId: RecipeId): ValidationResult {
  const recipe = RECIPE_DEFINITIONS[recipeId];
  if (!recipe) {
    return {
      isMatch: false,
      accuracy: 0,
      isPerfect: false,
      missingIngredients: [],
      extraIngredients: [],
      feedbackNotes: ['Unknown recipe'],
    };
  }

  const missingIngredients: IngredientId[] = [];
  const extraIngredients: IngredientId[] = [];
  const feedbackNotes: string[] = [];

  // Check Dough
  if (!pizza.hasDough) {
    missingIngredients.push('dough');
    feedbackNotes.push('Missing dough base!');
  }

  // Check Sauce
  if (!pizza.hasSauce) {
    missingIngredients.push('tomato_sauce');
    feedbackNotes.push('Missing tomato sauce!');
  }

  // Check Recipe Ingredients
  const required = recipe.requiredIngredients;
  let totalRequiredItems = 0;
  let correctlyPresentItems = 0;
  let extraItemsCount = 0;

  for (const [ingIdStr, requiredCount] of Object.entries(required)) {
    const ingId = ingIdStr as IngredientId;
    if (requiredCount > 0) {
      totalRequiredItems += requiredCount;

      let actualCount = 0;
      if (ingId === 'dough') actualCount = pizza.hasDough ? 1 : 0;
      else if (ingId === 'tomato_sauce') actualCount = pizza.hasSauce ? 1 : 0;
      else if (ingId === 'mozzarella' || ingId === 'parmesan' || ingId === 'cheddar' || ingId === 'gorgonzola') {
        actualCount = pizza.cheeses.filter((c) => c === ingId).length;
      } else {
        actualCount = pizza.toppings.filter((t) => t === ingId).length;
      }

      if (actualCount >= requiredCount) {
        correctlyPresentItems += requiredCount;
      } else {
        missingIngredients.push(ingId);
        correctlyPresentItems += actualCount;
        feedbackNotes.push(`Missing ${ingId.replace(/_/g, ' ')}`);
      }
    }
  }

  // Check for unwanted extra toppings or cheeses
  const allPizzaIngredients: IngredientId[] = [
    ...(pizza.hasDough ? (['dough'] as IngredientId[]) : []),
    ...(pizza.hasSauce ? (['tomato_sauce'] as IngredientId[]) : []),
    ...pizza.cheeses,
    ...pizza.toppings,
  ];

  for (const ing of allPizzaIngredients) {
    const req = required[ing] || 0;
    if (req === 0) {
      if (!extraIngredients.includes(ing)) {
        extraIngredients.push(ing);
      }
      extraItemsCount++;
      feedbackNotes.push(`Unwanted ${ing.replace(/_/g, ' ')} added`);
    }
  }

  // Accuracy calculation:
  // (correct / totalRequired) scaled down by penalties for extras
  const baseAccuracy = totalRequiredItems > 0 ? (correctlyPresentItems / totalRequiredItems) * 100 : 0;
  const extraPenalty = extraItemsCount * 15;
  const rawAccuracy = Math.max(0, Math.min(100, Math.round(baseAccuracy - extraPenalty)));

  const isPerfect = missingIngredients.length === 0 && extraIngredients.length === 0 && rawAccuracy === 100;
  // A pizza can be served if it has at least dough and meets minimum 50% accuracy
  const isMatch = pizza.hasDough && rawAccuracy >= 40 && missingIngredients.length <= 1;

  return {
    isMatch,
    accuracy: rawAccuracy,
    isPerfect,
    missingIngredients,
    extraIngredients,
    feedbackNotes: feedbackNotes.length > 0 ? feedbackNotes : ['Made to perfection!'],
  };
}
