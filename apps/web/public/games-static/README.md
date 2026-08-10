# games-static/README.md
# MEDHAA Games Migration Guide

This folder holds all ~40 standalone HTML/JS games as individual
subfolders (e.g. `math-blitz/`, `logic-grid/`, `devanagari-learning/`).
Push this entire `games-static/` directory to the new GitHub repo you
are creating, then point the `deploy-games.yml` workflow at it.

## Steps to migrate each existing game

1. Copy your existing game folder as-is into `games-static/<slug>/`.
2. Add one line before your closing `</body>` tag:
   `<script src="../_shared/medhaa-bridge.js"></script>`
3. Call `medhaaSessionStart()` when the player begins.
4. Call `medhaaSessionEnd({ durationMs, score, accuracy, hintsUsed, completionStatus })`
   when the player finishes, quits, or fails.
5. (Optional) Call `medhaaHintUsed()` whenever a hint is shown.
6. Add the game's slug/title/domain to `apps/api/src/registry/gameRegistry.seed.ts`.
7. Push to the `main` branch — GitHub Actions deploys automatically to
   `games.medhaa.net/<slug>/`.

## Domain routing on medhaa.net

- `medhaa.net` -> main web app (student/parent/teacher/admin dashboards)
- `games.medhaa.net/<slug>/` -> individual static game bundles, loaded
  inside an iframe by `GameContainer` via `createIframeGame(slug)`
- `api.medhaa.net` -> backend API

No game needs a rewrite — only the bridge script and two-three lifecycle
calls, so all ~40 games can be migrated incrementally without blocking
the rest of the MEDHAA launch.
