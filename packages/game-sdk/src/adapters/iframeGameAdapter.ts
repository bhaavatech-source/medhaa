// packages/game-sdk/src/adapters/iframeGameAdapter.ts
// Wraps a standalone HTML/JS game (hosted as a static folder, e.g.
// games-static/math-blitz/index.html) inside an iframe and bridges its
// postMessage events into the MedhaaGame contract. This means NONE of
// your existing ~40 HTML/JS games need to be rewritten — only a small
// bridge script (see gameSdkBridge.js below) is dropped into each game
// folder so it can talk to the MEDHAA host.

import { MedhaaGame, GameLaunchContext, GameSessionEnd } from '../types';

// Base path where all standalone game folders are hosted. In production
// this points to games.medhaa.net or a /games/ subpath on medhaa.net.
const GAMES_STATIC_BASE = process.env.NEXT_PUBLIC_GAMES_BASE_URL || 'https://games.medhaa.net';

export function createIframeGame(slug: string): MedhaaGame {
  let iframe: HTMLIFrameElement | null = null;
  let messageHandler: ((event: MessageEvent) => void) | null = null;

  return {
    slug,
    mount(container: HTMLElement, context: GameLaunchContext) {
      iframe = document.createElement('iframe');
      iframe.src = `${GAMES_STATIC_BASE}/${slug}/index.html?studentId=${context.studentId}`;
      iframe.title = slug;
      iframe.setAttribute('allow', 'fullscreen');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '16px';

      // Listens for events posted by the bridge script embedded inside
      // each legacy game folder. Origin is checked to prevent spoofed
      // session data from arbitrary iframes.
      messageHandler = (event: MessageEvent) => {
        if (!event.origin.includes('medhaa.net') && !event.origin.includes('localhost')) return;

        const { type, payload } = event.data || {};

        if (type === 'MEDHAA_SESSION_START') {
          context.onSessionStart({
            gameSlug: slug,
            studentId: context.studentId,
            startTime: new Date().toISOString(),
          });
        }

        if (type === 'MEDHAA_SESSION_END') {
          const sessionEnd: GameSessionEnd = {
            gameSlug: slug,
            studentId: context.studentId,
            endTime: new Date().toISOString(),
            durationMs: payload.durationMs,
            score: payload.score,
            accuracy: payload.accuracy,
            hintsUsed: payload.hintsUsed ?? 0,
            completionStatus: payload.completionStatus ?? 'completed',
          };
          context.onSessionEnd(sessionEnd);
        }

        if (type === 'MEDHAA_HINT_USED') {
          context.onHintUsed();
        }
      };

      window.addEventListener('message', messageHandler);
      container.appendChild(iframe);
    },

    unmount() {
      if (messageHandler) window.removeEventListener('message', messageHandler);
      iframe?.remove();
      iframe = null;
    },
  };
}
