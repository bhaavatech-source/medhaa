import clickSound from "../../assets/sounds/click.mp3";

export function useClickSound() {
  // Create audio object once per hook instance
  const audio = new Audio(clickSound);

  function playClick() {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore errors (e.g. autoplay restrictions)
    });
  }

  /**
   * Wrap an existing event handler so it plays the click sound first.
   * Usage:
   *   onClick={withClickSound(() => { ... })}
   */
  function withClickSound<T extends (...args: any[]) => void>(handler: T): T {
    return ((...args: any[]) => {
      playClick();
      handler(...args);
    }) as T;
  }

  return { playClick, withClickSound };
}