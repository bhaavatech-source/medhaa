import { playClip } from "./audio/clips";

export const speak = (text: string) => {
  // a recorded pronunciation (your own voice) always wins over the synthetic voice
  try { if (playClip(text)) return; } catch { /* fall through to TTS */ }
  try {
    const rv = (window as any).responsiveVoice;
    if (rv) {
      rv.cancel();
      rv.speak(text, "Hindi Female", { rate: 0.85, pitch: 1.1, volume: 1 });
      return;
    }
  } catch (_) {}
  // Web Speech fallback
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "hi-IN"; u.rate = 0.8;
  window.speechSynthesis.speak(u);
};

export const speakRoman = (roman: string) => {
  try {
    const rv = (window as any).responsiveVoice;
    if (rv) {
      rv.cancel();
      rv.speak(roman, "UK English Female", { rate: 0.7 });
      return;
    }
  } catch (_) {}
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(roman);
  u.lang = "en-US"; u.rate = 0.7;
  window.speechSynthesis.speak(u);
};