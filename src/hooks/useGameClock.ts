import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function useGameClock() {
  const isPaused = useGameStore((s) => s.isPaused);
  const gamePhase = useGameStore((s) => s.gamePhase);
  const tick = useGameStore((s) => s.tick);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    // Only run clock when in active shift
    if (isPaused || gamePhase !== 'SHIFT_ACTIVE') {
      lastTimeRef.current = performance.now();
      return;
    }

    lastTimeRef.current = performance.now();

    const intervalId = window.setInterval(() => {
      const now = performance.now();
      const deltaMs = now - lastTimeRef.current;
      lastTimeRef.current = now;

      // Cap deltaMs to avoid massive jumps if computer sleeps
      const safeDeltaSeconds = Math.min(1.0, deltaMs / 1000);
      if (safeDeltaSeconds > 0.05) {
        tick(safeDeltaSeconds);
      }
    }, 250);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, gamePhase, tick]);
}
