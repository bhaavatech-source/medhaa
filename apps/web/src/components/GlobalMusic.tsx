// apps/web/src/components/GlobalMusic.tsx
// Site-wide ambient background music (Home, dashboards, admin, etc).
// Shares the same localStorage keys and /audio/background tracks as the
// per-game player in public/games-static/bhava-session.js so the on/off
// preference stays consistent whether the user is on the main site or
// inside a game. Mounted once at the App root so it survives route changes.
import { useEffect, useRef, useState } from 'react';
import '../styles/global-music.css';

const ENABLED_KEY = 'medhaa_global_music_enabled';
const VOLUME_KEY = 'medhaa_global_music_volume';
const TRACKS = [
  '/audio/background/audio1.mpeg',
  '/audio/background/audio2.mpeg',
  '/audio/background/audio3.mpeg',
  '/audio/background/audio4.mpeg',
];

function readEnabled() {
  try {
    return localStorage.getItem(ENABLED_KEY) !== 'false';
  } catch {
    return true;
  }
}

function readVolume() {
  try {
    const value = parseFloat(localStorage.getItem(VOLUME_KEY) || '0.28');
    return Number.isNaN(value) ? 0.28 : Math.max(0, Math.min(1, value));
  } catch {
    return 0.28;
  }
}

export function GlobalMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef(TRACKS[Math.floor(Math.random() * TRACKS.length)]);
  const [enabled, setEnabled] = useState(readEnabled);
  const volumeRef = useRef(readVolume());

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volumeRef.current;

    function tryPlay() {
      if (!enabled) return;
      audio!.play().catch(() => {
        // Autoplay blocked until a real user gesture; the pointerdown/keydown
        // listeners below will retry on the first interaction.
      });
    }

    function startAfterGesture() {
      tryPlay();
    }

    if (enabled) tryPlay();
    window.addEventListener('pointerdown', startAfterGesture, { once: true });
    window.addEventListener('touchstart', startAfterGesture, { once: true, passive: true });
    window.addEventListener('keydown', startAfterGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startAfterGesture);
      window.removeEventListener('touchstart', startAfterGesture);
      window.removeEventListener('keydown', startAfterGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      localStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
    if (enabled) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [enabled]);

  return (
    <>
      <audio ref={audioRef} src={trackRef.current} loop preload="none" aria-hidden="true" />
      <button
        type="button"
        id="medhaa-site-music-toggle"
        className={`medhaa-site-music-toggle${enabled ? '' : ' off'}`}
        aria-label={enabled ? 'Turn music off' : 'Turn music on'}
        title={enabled ? 'Turn music off' : 'Turn music on'}
        onClick={() => setEnabled((prev) => !prev)}
      >
        {enabled ? '♫' : '♬'}
      </button>
    </>
  );
}

export default GlobalMusic;
