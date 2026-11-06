export {};

declare global {
  interface Window {
    BhavaSession?: {
      end: (score: number) => void | Promise<void>;
    };
  }
}
