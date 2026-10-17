import { CookingQuality } from '../types/game';

export interface CookingEvaluation {
  quality: CookingQuality;
  progressPercent: number; // 0 to 100+
  canRemove: boolean;
  isReady: boolean;
  statusText: string;
  badgeColor: string;
  crustColor: string;
  glowColor: string;
  scoreMultiplier: number;
}

export function evaluateCookingState(elapsedSeconds: number, targetSeconds: number): CookingEvaluation {
  if (targetSeconds <= 0) {
    return {
      quality: 'raw',
      progressPercent: 0,
      canRemove: true,
      isReady: false,
      statusText: 'Raw',
      badgeColor: '#A0AEC0',
      crustColor: '#F9E5BE',
      glowColor: 'transparent',
      scoreMultiplier: 0.1,
    };
  }

  const ratio = elapsedSeconds / targetSeconds;
  const progressPercent = Math.min(100, Math.round(ratio * 100));

  if (ratio < 0.7) {
    return {
      quality: 'undercooked',
      progressPercent,
      canRemove: true,
      isReady: false,
      statusText: 'Baking (Undercooked)',
      badgeColor: '#E2E8F0',
      crustColor: '#F7DCB0',
      glowColor: 'rgba(232, 93, 74, 0.25)',
      scoreMultiplier: 0.6,
    };
  }

  if (ratio >= 0.7 && ratio <= 1.0) {
    // 70% to 100% of target duration is the golden perfect window!
    return {
      quality: 'perfect',
      progressPercent,
      canRemove: true,
      isReady: true,
      statusText: 'Golden Crust (Ready!)',
      badgeColor: '#10B981',
      crustColor: '#D97706',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      scoreMultiplier: 1.25,
    };
  }

  if (ratio > 1.0 && ratio <= 1.35) {
    return {
      quality: 'overcooked',
      progressPercent: 100,
      canRemove: true,
      isReady: true,
      statusText: 'Dark Bake (Overcooked)',
      badgeColor: '#F59E0B',
      crustColor: '#92400E',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      scoreMultiplier: 0.65,
    };
  }

  // Above 1.35x target duration: Burnt!
  return {
    quality: 'burnt',
    progressPercent: 100,
    canRemove: true,
    isReady: true,
    statusText: 'Burnt to a Crisp!',
    badgeColor: '#EF4444',
    crustColor: '#262626',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    scoreMultiplier: 0.15,
  };
}
