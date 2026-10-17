import { describe, it, expect } from 'vitest';
import { calculateOrderReward } from '../domain/rewards';
import { CustomerOrder, PreparedPizza } from '../types/game';
import { createRandomCustomer } from '../config/customers';

describe('Order Rewards & Payout Domain', () => {
  const customer = createRandomCustomer('cust_test', 'regular');

  const order: CustomerOrder = {
    id: 'order_test',
    customerId: customer.id,
    customer,
    recipeId: 'margherita',
    createdAt: Date.now(),
    totalPatience: 60,
    patienceRemaining: 50, // 83% patience left -> high speed bonus
    status: 'waiting',
    rewardModifiers: { tipBonus: 0, priceMultiplier: 1 },
  };

  const perfectPizza: PreparedPizza = {
    id: 'pizza_test',
    hasDough: true,
    hasSauce: true,
    cheeses: ['mozzarella'],
    toppings: [],
    toppingPlacements: [],
    ingredientCounts: { dough: 1, tomato_sauce: 1, mozzarella: 1 },
    createdAt: Date.now(),
  };

  it('calculates full payout with perfect bonus for a flawlessly timed Margherita', () => {
    // 8.0s is inside the 70-100% window of 8s Margherita
    const result = calculateOrderReward(order, perfectPizza, 7.5, 0);

    expect(result.success).toBe(true);
    expect(result.isPerfectOrder).toBe(true);
    expect(result.totalCoinsEarned).toBeGreaterThan(16); // base price 16 + tip + perfect bonus
    expect(result.reputationDelta).toBeGreaterThan(0);
  });

  it('applies penalties for burnt pizzas and prevents full rewards', () => {
    const burntCookingTime = 16.0; // 200% of target duration
    const result = calculateOrderReward(order, perfectPizza, burntCookingTime, 0);

    expect(result.success).toBe(false);
    expect(result.isPerfectOrder).toBe(false);
    expect(result.totalCoinsEarned).toBeLessThanOrEqual(2);
    expect(result.reputationDelta).toBeLessThan(0);
  });

  it('rejects raw pizzas served before baked', () => {
    const rawCookingTime = 1.0;
    const result = calculateOrderReward(order, perfectPizza, rawCookingTime, 0);

    expect(result.success).toBe(false);
    expect(result.totalCoinsEarned).toBe(0);
    expect(result.reputationDelta).toBeLessThan(0);
  });

  it('increases tip reward for VIP customer', () => {
    const vipCustomer = createRandomCustomer('cust_vip', 'vip');
    const vipOrder: CustomerOrder = { ...order, customer: vipCustomer };

    const regularResult = calculateOrderReward(order, perfectPizza, 7.5, 0);
    const vipResult = calculateOrderReward(vipOrder, perfectPizza, 7.5, 0);

    expect(vipResult.tipAmount).toBeGreaterThan(regularResult.tipAmount);
  });
});
