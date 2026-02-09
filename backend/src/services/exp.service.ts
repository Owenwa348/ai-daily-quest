//backend/src/services/exp.service.ts
/**
 * EXP calculation logic
 * This is the core RPG reinforcement system
 */

export function calculateExp(
  baseExp: number,
  difficulty: number,
  consistencyBonus = 1,
  fatiguePenalty = 1
) {
  /**
   * Formula:
   * EXP = base × difficulty × consistency × fatigue
   */

  return Math.floor(
    baseExp *
    difficulty *
    consistencyBonus *
    fatiguePenalty
  );
}
