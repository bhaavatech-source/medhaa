export interface GameVisibilityState {
  tier: string;
  access: { allowed: boolean };
}

export function isGameVisible(game: GameVisibilityState): boolean {
  return game.tier !== 'rotating-free' || game.access.allowed;
}