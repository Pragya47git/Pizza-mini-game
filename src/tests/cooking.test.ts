import { describe, it, expect } from 'vitest';
import { evaluateCookingState } from '../domain/cooking';

describe('Cooking Simulation Domain', () => {
  const targetDuration = 10; // 10 seconds

  it('marks early state as undercooked (< 70% elapsed)', () => {
    const evalState = evaluateCookingState(4.0, targetDuration); // 40%
    expect(evalState.quality).toBe('undercooked');
    expect(evalState.isReady).toBe(false);
    expect(evalState.scoreMultiplier).toBeLessThan(1.0);
  });

  it('marks 70% - 100% window as perfect golden crust', () => {
    const evalAt75 = evaluateCookingState(7.5, targetDuration);
    expect(evalAt75.quality).toBe('perfect');
    expect(evalAt75.isReady).toBe(true);
    expect(evalAt75.scoreMultiplier).toBeGreaterThan(1.0);

    const evalAt90 = evaluateCookingState(9.0, targetDuration);
    expect(evalAt90.quality).toBe('perfect');
    expect(evalAt90.isReady).toBe(true);
  });

  it('marks 101% - 135% as overcooked with dark crust penalty', () => {
    const evalState = evaluateCookingState(11.5, targetDuration);
    expect(evalState.quality).toBe('overcooked');
    expect(evalState.isReady).toBe(true);
    expect(evalState.scoreMultiplier).toBeLessThan(1.0);
  });

  it('marks > 135% duration as burnt with severe penalty', () => {
    const evalState = evaluateCookingState(15.0, targetDuration);
    expect(evalState.quality).toBe('burnt');
    expect(evalState.scoreMultiplier).toBeLessThan(0.3);
  });

  it('handles zero target duration safely', () => {
    const evalState = evaluateCookingState(0, 0);
    expect(evalState.quality).toBe('raw');
    expect(evalState.isReady).toBe(false);
  });
});
