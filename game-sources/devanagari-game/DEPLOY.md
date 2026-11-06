# Akṣarābhyāsaḥ: Medhaa integration and release

## Source versus published files

- Edit this project in `game-sources/devanagari-game`, especially `src/`.
- The root-level `App.tsx`, `components/` and data files came with the supplied
  project but are not the active entry. `src/main.tsx` loads `src/App.tsx`.
- Do not copy the whole source project, `node_modules`, or its development
  `index.html` into Medhaa's public directory.
- Published files live in `apps/web/public/games-static/devanagari-game`.
  The slug, domain and launch path remain unchanged, preserving existing history
  and catalogue registration. No database reseed is needed for this replacement.
- The student-facing name is `Akṣarābhyāsaḥ` in IAST. Catalogue cards normalize
  legacy database titles for this slug; new seed records use the same name.
  Existing database titles in admin/history views can be renamed through the
  approved admin catalogue flow. Do not run the demo seed against production.

## Build and publish

From the repository root in PowerShell:

```powershell
# First checkout, or after changing this game's dependencies:
npm --prefix .\game-sources\devanagari-game ci

# After every source/content/recording change:
npm run build:devanagari

# Check launch-path parity and the published integration contract:
npm run test --workspace @medhaa/web -- src/data/gamesCatalog.test.ts src/data/devanagariIntegration.test.ts src/data/devanagariWriting.test.ts
```

The command type-checks and builds into this project's `dist`, validates the
generated entry and shared helper paths, then publishes production files.
It replaces the generated `assets` and `audio` directories, while leaving the
existing host responsive helper files intact. The game uses its own responsive
CSS; it does not load the old layout helper or duplicate inline navigation.
Vite's warnings that the two classic host scripts cannot be bundled are expected:
they must remain external and be served by Medhaa.

Commit the source changes AND the updated public entry/assets/audio together.
The standard Medhaa web build serves the committed production game; it does not
rebuild this separate source project automatically.

## Verify through Medhaa

```powershell
npm run dev --workspace @medhaa/web -- --port 5174 --strictPort
```

Open `http://localhost:5174/student`, find Devanagari and launch it.
The destination must remain `/games-static/devanagari-game/index.html`.
For direct debugging, open that path on the same host. A standalone game Vite
server is NOT an integration test: it cannot supply Medhaa's sibling scripts.

1. Confirm all three journey regions and 23 stations render.
2. Complete Vowels, dismiss its result with Map/Next/Retry, and check the next
   station unlocks. Reload to check local progress persists.
3. Check Writing: watch, trace with pointer/touch, Check, clear, next letter.
   Shared stroke starts must show separate numbered labels with connector lines,
   in Watch, Trace and teacher review. क्ष uses three pen movements: the joining
   curve flows right-to-left into the upper loop, lower bowl and hook (1), then
   lift for the downward right stem (2), then lift for the headline (3).
   श्र, त्र and ज्ञ also use a flowing body (1), downward stem (2) and headline (3).
   Read their on-screen direction instructions and check the arrows around each
   turn; their old skeleton junctions must not appear as separate pen lifts.
   Obsolete review overrides are discarded with console warnings. Previous
   checked marks for these four changed guides are cleared once; teachers must
   review their new three-stroke models again.
   The 57 models include doubled consonants क्क, त्त, न्न, प्प, म्म, ल्ल and
   conjuncts क्ष, त्र, ज्ञ, श्र, स्त, न्त in separate groups, with decomposition,
   transliteration and example words. Next/Previous must keep the group selection
   synchronized when crossing a group boundary.
4. Check Alphabet chart and Word breakdown, including a custom Devanagari word.
5. At desktop and narrow phone widths, check no horizontal overflow and that
   Back, Home and My Report are visible. Home should return to `/student`.
6. With a real test account, inspect Network for exactly one successful
   `POST /api/games/devanagari-game/attempts` per completed station, then confirm
   the attempt in the student's history/report. Do not equate an initiated
   request or the shared helper's "Score saved" message with confirmed persistence.
7. Build the web app with `npm run build --workspace @medhaa/web`, deploy using
   the normal web release workflow, and repeat the launch on the deployed site.
   Packaged Android releases additionally need the normal web build/Capacitor
   sync/rebuild flow; a web deployment does not replace an installed AAB.

## Session and audio behavior

- Shared `../bhava-session.js` and `../bhava-game-nav.js` load once.
  There is no `BhavaSession.start()` call.
- A completed station reports its star rating normalized to 0-100 when its result
  is dismissed (or its React view unmounts), once per run. Recommendations do not
  cover the celebration immediately. Failed stations remain local because the
  shared helper only supports completed submissions. Writing practice is local.
- Shared telemetry limitations still apply: duration starts at page load,
  accuracy is inferred from normalized stars, hints are zero, and delivery is
  neither acknowledged nor retried by this game. Closing the browser before
  dismissing a result is not a guaranteed save.
- The non-commercial ResponsiveVoice `key=FREE` script is not loaded. Recorded
  clips take priority; browser speech synthesis is the fallback and requires a
  usable Hindi voice on the device. Confirm pronunciation audibly on real devices.
- Publish teacher-recorded audio by placing the exported manifest and clips in
  `public/audio` here, then rebuild. The empty manifest means no recordings have
  been published yet.
- Before release, have a subject reviewer check all 57 stroke paths in Stroke review.
  All 12 added joined-letter practice guides now use independently font-checked
  paths in `src/likhana/conjunctGeometry.ts`; the incorrect hand-assembled
  ligatures and generic half-form joins have been replaced. See
  [stroke-tool instructions](./tools/strokes/README.md) to rerun shape validation.
  Stroke order remains a draft for teacher review before teaching it as a standard;
  the order/direction review editor cannot correct path geometry.
  The remaining eight joined forms passed shape validation but their handwritten
  sequences are not approved; the stroke-tool instructions list the unresolved
  junctions. Do not mistake shape validation for handwriting-order approval.
  Test writing on a physical Android phone and iPhone; desktop emulation does not
  establish touch accuracy, pronunciation quality or microphone permissions.
- Metadata now covers ages 6-17. Existing database title/access policy are not
  changed by publishing; use the approved admin catalogue flow for database edits,
  not the demo seed against production.
