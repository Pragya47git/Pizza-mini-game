import { describe, it, expect } from 'vitest';
import { validatePizzaForRecipe } from '../domain/pizzaValidation';
import { PreparedPizza } from '../types/game';

describe('Pizza Validation Domain', () => {
  const createBasePizza = (): PreparedPizza => ({
    id: 'test_pizza',
    hasDough: true,
    hasSauce: true,
    cheeses: ['mozzarella'],
    toppings: [],
    toppingPlacements: [],
    ingredientCounts: { dough: 1, tomato_sauce: 1, mozzarella: 1 },
    createdAt: Date.now(),
  });

  it('validates a perfect Margherita pizza with 100% accuracy', () => {
    const pizza = createBasePizza();
    const result = validatePizzaForRecipe(pizza, 'margherita');

    expect(result.isMatch).toBe(true);
    expect(result.isPerfect).toBe(true);
    expect(result.accuracy).toBe(100);
    expect(result.missingIngredients).toHaveLength(0);
    expect(result.extraIngredients).toHaveLength(0);
  });

  it('detects missing dough on unrolled pizza', () => {
    const pizza = { ...createBasePizza(), hasDough: false };
    const result = validatePizzaForRecipe(pizza, 'margherita');

    expect(result.isMatch).toBe(false);
    expect(result.isPerfect).toBe(false);
    expect(result.missingIngredients).toContain('dough');
  });

  it('detects missing sauce and cheese', () => {
    const pizza: PreparedPizza = {
      ...createBasePizza(),
      hasSauce: false,
      cheeses: [],
    };
    const result = validatePizzaForRecipe(pizza, 'margherita');

    expect(result.isPerfect).toBe(false);
    expect(result.missingIngredients).toContain('tomato_sauce');
    expect(result.missingIngredients).toContain('mozzarella');
  });

  it('detects missing toppings on Pepperoni pizza', () => {
    const pizza = createBasePizza(); // only dough, sauce, cheese
    const result = validatePizzaForRecipe(pizza, 'pepperoni');

    expect(result.isPerfect).toBe(false);
    expect(result.missingIngredients).toContain('pepperoni');
  });

  it('penalizes incorrect extra toppings on a simple pizza', () => {
    const pizza: PreparedPizza = {
      ...createBasePizza(),
      toppings: ['mushrooms', 'olives'], // extra toppings not in Margherita
    };
    const result = validatePizzaForRecipe(pizza, 'margherita');

    expect(result.isPerfect).toBe(false);
    expect(result.extraIngredients).toContain('mushrooms');
    expect(result.extraIngredients).toContain('olives');
    expect(result.accuracy).toBeLessThan(100);
  });

  it('correctly validates complex Veggie Supreme pizza', () => {
    const pizza: PreparedPizza = {
      ...createBasePizza(),
      toppings: ['mushrooms', 'olives', 'bell_peppers', 'onions'],
    };
    const result = validatePizzaForRecipe(pizza, 'veggie_supreme');

    expect(result.isMatch).toBe(true);
    expect(result.isPerfect).toBe(true);
    expect(result.accuracy).toBe(100);
  });

  it('correctly validates Four Cheese Special with distinct cheese varieties', () => {
    const pizza: PreparedPizza = {
      ...createBasePizza(),
      cheeses: ['mozzarella', 'parmesan', 'cheddar', 'gorgonzola'],
    };
    const result = validatePizzaForRecipe(pizza, 'four_cheese');

    expect(result.isMatch).toBe(true);
    expect(result.isPerfect).toBe(true);
    expect(result.accuracy).toBe(100);
  });
});
