# Medhaa Game Development: Agent Handbook

Prepared on 2026-10-11 from the current repository and repository-maintained development notes.

## 1. Purpose and Evidence

Medhaa is Bhava Tech's educational gaming platform for cognitive, emotional, practical, and subject learning. Build experiences in which learners do something meaningful, observe consequences, receive useful feedback, and try again. Do not turn every subject into a reskinned multiple-choice quiz.

This handbook supports agents designing new games, expanding existing ones, reviewing content, and verifying releases. It is a reference document, not an automatically loaded VS Code agent configuration.

Three labels apply throughout:

- **Verified:** checked against the source files linked here during preparation.
- **Historical lesson:** recorded in repository memory from previous work; inspect the current affected implementation before applying the old fix.
- **Proposed standard:** guidance for future development, not a claim that every existing game already follows it.

There is no claim of perfect recall of all prior conversations or a complete audit of every game. Catalogue descriptions explain intended experiences, not independently established educational efficacy. Treat old comments, README counts, and previous test totals as potentially stale.

Start every task with the relevant source, an observable behavior, and a small discriminating test. Preserve unrelated user changes. Do not rebuild the whole architecture to add one game.

## 2. Repository Map and Sources of Truth

| Area | Current location | How agents should use it |
| --- | --- | --- |
| Web application | `apps/web` | React 19, TypeScript, Vite, React Router; catalogue, account flows, dashboards, and game launching. |
| Live static game content | `apps/web/public/games-static` | Standalone HTML games and folder-based game bundles served by the web app. |
| Devanagari editable source | `game-sources/devanagari-game` | Separate React/Vite project. Run `npm run build:devanagari` from the repository root to publish only its production files to the existing static launch path; see its [release guide](../game-sources/devanagari-game/DEPLOY.md). |
| API | `apps/api` | Express, Zod, Prisma; identity, catalogue, access, attempts, subscriptions, and reports. |
| Android shell | `apps/android` | Capacitor wrapper around the web build. |
| Separate Smriti application | `apps/medhaa-smriti` | Separate application surface; do not assume it shares the main Android release pipeline. Inspect its own configuration for tasks here. |
| Desktop application | `apps/desktop` | Separate legacy/native integration surface; do not infer its behavior from web testing. |
| Shared SDK | `packages/game-sdk` | Lifecycle types and an iframe adapter/reporting implementation; not proof that this is the active static-game launch flow. |
| Packaged games | `packages/games` | Additional game implementations; establish whether a module is used before choosing it as a template. |
| UI package | `packages/ui` | Inspect exports and actual consumers before adopting or changing it. |
| Archived material | `_backups_do_not_serve` | Historical reference only; never use as the default live implementation or ship into public assets. |

Important source anchors:

- [Project README](../README.md): project purpose and current web sign-in setup.
- [API game seed](../apps/api/prisma/seed.ts): registered slugs, launch paths, initial domains, and activity classification.
- [Prisma schema](../apps/api/prisma/schema.prisma): actual persisted fields and relations.
- [Student catalogue metadata](../apps/web/src/data/gamesCatalog.ts): titles, descriptions, skills, ages, and presentation metadata.
- [Student games page](../apps/web/src/components/StudentGamesPage.tsx): live launch selection, age groups, recommendations, and anonymous fallback catalogue.
- [Catalogue parity tests](../apps/web/src/data/gamesCatalog.test.ts): matching slug sets, existing entry paths, fallback tiers, and game/activity consistency.
- [Access policy](../apps/api/src/services/gameEntitlement.ts): tiers, database overrides, rotation, and access decisions.
- [Attempt and history routes](../apps/api/src/routes/games.ts): authenticated persistence and own-account reporting.
- [Static session helper](../apps/web/public/games-static/bhava-session.js): web/Android score submission, music, recommendations, and compatibility branches.
- [Static navigation helper](../apps/web/public/games-static/bhava-game-nav.js): universal Back/Home/report navigation and internal screen hooks.
- [SDK lifecycle types](../packages/game-sdk/src/types.ts) and [SDK reporting](../packages/game-sdk/src/reportSession.ts): contracts to evaluate, not blindly copy.

**Verified documentation conflict:** [the static-games migration README](../apps/web/public/games-static/README.md) describes an older `_shared/medhaa-bridge.js`, `medhaaSessionStart/End`, registry file, iframe, and subdomain workflow. The active static flow described below is different. Do not implement that older README's recipe without proving its dependencies and consumers exist and are active.

The database is the runtime catalogue. Editing a seed file does not automatically update an existing production row. Static files are not automatically discoverable merely because they are present in `public`.

## 3. Existing Game Families and Reusable Ideas

The following examples are registered in the seed and described in frontend metadata. Inspect each actual game's engine before reusing its mechanics or asserting a feature is implemented.

| Family | Examples | Useful design patterns |
| --- | --- | --- |
| Attention and inhibition | `focus-flash`, `focus-under-distraction`, `dharana-arena`, `visual-difference-detector` | Selective response, go/no-go, changing rules, visual discrimination, distraction management. |
| Memory | `bhava-smriti`, `memory-match-puzzle`, `memory-match-ultimate`, `memory-zoo-puzzle`, `neuroflash-memory`, `brain-garden` | Matching, sequence recall, progressively larger boards, themed worlds. |
| Logic, spatial, and numerical reasoning | `brain-quest`, `logic-game`, `mindscape-pro`, `mental-rotation-game`, `bhava-math-grid`, `math-blitz`, `hidden-maths`, `know-maths`, `number-garden-quest` | Constraint solving, mental models, spatial comparisons, arithmetic, contextual mathematics. |
| Engineering and systems | `bhava-build-device-engineer`, `build-your-car`, `bhava-tech-build-your-bike`, `drone-build-engineer`, `rocket-build-engineer`, `plane-builder`, `intelligent-machines`, `secret-of-silicon-game`, `bhava-space-academy` | Assemble, inspect, simulate, diagnose, repair, optimize, and reason about trade-offs. |
| Language and reading | `grammar-galaxy`, `grammar-pro`, `devanagari-game`, `bhava-tech-likhwell`, `telugu-script-game`, `medha-read-anybook-in-3hrs` | Script recognition, language practice, contextual grammar, reading and comprehension. |
| Life, civic, financial, and career learning | `life-strategist-starter`, `nagarikx-enhanced`, `finlife-india-quest-enhanced`, `career-adventure`, `ready-for-the-world`, `good-habits`, `day-hero-game`, `day-super-hero` | Branching decisions, planning, resource allocation, practical procedures, reflection. |
| Emotional and social learning | `soccomm-enhanced`, `heart-heroes`, `empathy-quest`, `calm-zone` | Perspective taking, communication, consequences, regulation, noncompetitive guided practice. |
| Environment, arts, and creativity | `planet-guardians`, `nadopaasana`, `imaginia-quest` | Systems consequences, listening and music practice, creative choices. |
| Check-ins and assessment activities | `bcs-lite-v3`, `iq-test-level-3`, `mindspark-iq`, `neuro-ascend-iq` | Keep assessment purpose, scoring interpretation, and practice separate. |

Good expansion paths add a missing competency or a deeper stage of understanding. Another memory skin is not automatically broader subject coverage. An engineering game should teach why a design works, not just whether the learner dragged the expected picture into a slot.

### Game, Activity, and Assessment Are Different

- **Game:** goals, rules, challenge, feedback, and replayable decisions.
- **Activity:** guided practice or exploration; competition, failure, and numerical scores may be inappropriate.
- **Assessment:** measurement with a defined interpretation and limitations; it needs evidence, consistency, and careful claims.

**Historical product decision:** My Medhaa (`bcs-lite-v3`) is an ongoing check-in/progress tool. The standalone one-time cognitive assessment is a separate product, not another game card. Do not merge their placement, payment, reminders, or results merely because both discuss cognition. Confirm current product requirements before changing either.

[BrainScoreNudge](../apps/web/src/components/BrainScoreNudge.tsx) currently prompts when no check-in exists or at least five days have passed. It describes an activity/capability profile, not a diagnosis. Do not assume all other reminders use this same cadence.

## 4. Covering Knowledge Systems Without False Completeness

**Proposed standard:** maintain a coverage matrix rather than promising to cover "all knowledge" in one game or release. Define the bounded curriculum, audience, language, and depth for each release. Completion means all approved matrix rows meet acceptance criteria, not that humanity's knowledge is finished.

Use three intersecting maps:

1. **Content:** what concepts or practices are learned.
2. **Ways of knowing:** how claims are formed, checked, interpreted, or contested.
3. **Learner capabilities:** what the learner can actually do afterward.

### Content Coverage Map

| Knowledge area | Example competencies | Suitable interactions | Coverage caution |
| --- | --- | --- | --- |
| Mathematics and statistics | Number sense, algebra, geometry, probability, interpreting data | Manipulatives, constraint puzzles, estimation, experiments, misleading-chart repair | Distinguish arithmetic speed from mathematical understanding. |
| Physical sciences | Motion, energy, materials, electricity, chemistry | Controlled experiments, predictions, circuit building, particle models | State model simplifications; verify units and conservation rules. |
| Life sciences and health literacy | Cells, ecosystems, bodies, hygiene, public health | Classification, ecosystem simulation, evidence interpretation | No diagnosis, treatment advice, unsafe experiments, or fear-based teaching. |
| Earth, environment, and space | Climate, weather, geology, water, biodiversity, astronomy | Map exploration, resource systems, orbital/seasonal models | Separate climate trends from individual weather events. |
| Engineering and making | Design constraints, mechanisms, testing, repair | Build-test-debug-optimize missions | Include trade-offs and consequences, not cosmetic assembly alone. |
| Computing and AI literacy | Algorithms, code, data, networks, security, model limitations | Debugging, visual programming, data classification, safe threat scenarios | Explain uncertainty and bias; do not present AI outputs as authority. |
| Languages and literacy | Listening, speaking, scripts, grammar, comprehension, composition | Dialogue, sentence construction, narration, revision, reading missions | Match language exposure and script knowledge; review localization. |
| History, geography, and society | Chronology, causes, maps, sources, social institutions | Timelines, map missions, source comparison, perspective reconstruction | Identify uncertainty and competing interpretations. |
| Civics, law, and public institutions | Rights, duties, procedures, participation, consumer protection | Practical scenarios, document choices, institutional pathways | Record jurisdiction and review date; avoid personal legal advice. |
| Economics, finance, and work | Budgets, interest, risk, markets, insurance, careers | Household simulations, trade games, resource allocation | Date assumptions and rates; no investment guarantees. |
| Emotional and social development | Empathy, self-regulation, boundaries, communication, cooperation | Branching conversations, collaborative goals, reflection | Respect disagreement; do not grade a child's worth or personality. |
| Ethics, philosophy, and reasoning | Argument, evidence, fairness, values, ambiguity | Dilemmas, argument maps, counterexamples, consequence comparison | More than one defensible answer may exist. |
| Arts, music, design, and creativity | Rhythm, listening, composition, visual design, storytelling | Creation tools, performance, remixing, critique | Use rubrics without pretending creativity has one correct answer. |
| Everyday, vocational, and safety knowledge | Planning, food, repair, first-response awareness, practical work | Sequencing, diagnosis, safe decision scenarios | Teach safe awareness, not hazardous unsupervised procedures. |
| Digital and media literacy | Search, source credibility, misinformation, privacy | Source investigation, claim checking, safe simulated feeds | No collection of children's real sensitive accounts or documents. |
| Local, indigenous, and traditional knowledge | Language traditions, ecological practices, crafts, oral histories | Contextual exploration, interviews with permission, craft systems | Attribute communities; avoid flattening diverse traditions. |
| Indian knowledge traditions | Logic and debate, mathematical history, literature, aesthetics, music, yoga philosophy | Argument games, historical methods, rhythm exploration, textual comparison | Identify school, period, source, and interpretation; distinguish cultural study from clinical claims. |
| Metacognition and learning skills | Planning, retrieval, self-explanation, confidence calibration | Predict-try-explain-reflect loops, spaced practice | Do not equate game time or points with general intelligence. |

This is an initial planning map, not an official existing Medhaa taxonomy. Add or split categories when curriculum requirements demand it. Do not invent database domain strings before checking catalogue grouping and display behavior.

### Ways of Knowing

- **Empirical:** observe, measure, predict, experiment, and revise.
- **Formal:** define, deduce, prove, and test counterexamples.
- **Historical and interpretive:** compare sources, context, evidence, and interpretations.
- **Practical and engineering:** test whether a method works under stated constraints.
- **Social and ethical:** compare interests, consequences, rights, and values.
- **Creative and aesthetic:** make, express, revise, and justify choices.
- **Traditional and experiential:** locate a practice in its community and history; distinguish testimony and experience from independently tested claims.

Respect traditions without labeling every traditional claim as scientifically established. Explain differing evidential standards without caricaturing a culture or belief system.

### Coverage Matrix Template

Maintain this in the planning artifact for the approved game series; do not assume such a registry already exists in the database.

| Field | Required meaning |
| --- | --- |
| Competency ID | Stable identifier for a specific observable capability. |
| Knowledge area and subtopic | Primary subject and narrower concept. |
| Prerequisites | What must be understood before this task is fair. |
| Learner profile | Age band, reading demand, language, accessibility needs. |
| Learning objective | An observable action, such as "diagnose a circuit break using test results." |
| Way of knowing | Evidence or reasoning process being practised. |
| Mechanic | What the learner does and why it teaches the objective. |
| Evidence of learning | Response, artifact, explanation, or transfer performance. |
| Depth | Recognize, explain, apply, diagnose, create, or transfer. |
| Sources and review | Provenance, subject reviewer, jurisdiction/date where relevant. |
| Implementation | Game slug and level/scenario IDs. |
| Status | Planned, prototype, content-reviewed, tested, released, or needs revision. |

A row is covered only when its interaction and feedback support the objective, factual content has been reviewed, and the target learner can access it. A topic name on a menu is not coverage.

## 5. Learning and Game Design Standards

**Proposed standard:** every brief includes the learner, the learning objective, a core loop, and a way to check transfer beyond memorizing the screen.

Use a loop such as **predict -> act -> observe -> explain -> adjust -> apply elsewhere**. Keep the first meaningful interaction close to launch. Let narrative provide context without delaying play behind long introductions.

Age groups in the student page are `5-9`, `10-13`, `14-17`, and `aspirants` (18+ in page descriptions). Individual catalogue age ranges still matter. Do not infer that an adult can only play exam drills or that a young learner can read dense technical explanations.

- For early learners, use small choice sets, concrete visuals, optional narration, short instructions, and gentle retries.
- For middle learners, introduce multi-step reasoning, simple models, explanations, and structured experimentation.
- For teens, introduce realistic constraints, ambiguity, competing goals, and evidence-based diagnosis.
- For adult/aspirant learners, support deeper practice and realistic problems without childish presentation.
- Adapt to demonstrated performance, not age alone. Language proficiency and motor demands are separate constraints.

### Content and Progression

- Teach prerequisites before testing dependent concepts.
- Introduce one meaningful difficulty change at a time: complexity, distractors, memory load, uncertainty, or speed.
- Offer untimed/practice modes where timing is not intrinsic to the skill.
- Make displayed round totals agree with the engine's real configuration.
- Use a deliberate content bank with stable IDs and explanations, not endless nearly identical generated questions.
- Separate spaced retrieval from accidental repetition. A no-repeat mode should state whether uniqueness applies to exact items, concepts, or immediate repeats.
- A finite bank cannot provide infinite unique sessions. Exhaust a shuffled bag before recycling; handle boundaries explicitly.
- Use deterministic seeds in tests for randomized boards and scenarios.
- Generate distractors from real misconceptions; explain the misconception without shaming the learner.
- Provide contextual hints in escalating steps; record hint use honestly.
- Make success reveal what worked and what could improve, not just confetti.
- Preserve progress where appropriate; define whether reload resumes, restarts, or confirms abandonment.

### Scoring and Feedback

- Publish a short score rubric in the game design artifact: inputs, weights, range, penalties, and edge cases.
- Prefer accuracy and understanding before speed unless reaction time is the explicit objective.
- Do not use score as a substitute for actual accuracy, hint counts, or duration.
- Keep game points separate from mastery estimates, rewards, cognitive profiles, and standardized assessments.
- Do not penalize opening accessibility controls, asking for instructions, or choosing a supported untimed mode.
- For creative or ethical tasks, allow defensible alternatives and show a rubric or consequences rather than fake objective certainty.
- For calm/regulation activities, a score may be unnecessary. Do not invent failure pressure merely to fit a game template.
- Do not claim a game cures ADHD, diagnoses a condition, measures clinical IQ, or guarantees reading speed or exam success. Retain careful nonclinical wording and obtain qualified review for assessment claims.

## 6. Implementation Patterns

### Choose the Owning Surface First

Use the nearest maintained game with a matching mechanic. Existing standalone games do not need to be converted to React to add a level. Conversely, a packaged/React game should follow its actual host contract, not import classic scripts indiscriminately.

[Device Engineer's README](../apps/web/public/games-static/bhava-build-device-engineer/README.md) documents a useful data-driven standalone structure: engine/state, UI, simulation, diagnostics, scoring, animation, storage, and JSON content banks. Its listed roadmap items are proposals, not guaranteed completed features. Its "no backend" statement describes the local game engine, not the platform's integrated score API.

For a new modular static game, a suitable starting structure is:

```text
apps/web/public/games-static/<slug>/
  index.html
  css/
    layout.css
    styles.css
  js/
    app.js
    engine.js
    ui.js
    scoring.js
    storage.js
  data/
    levels.json
    content.json
  assets/
```

Create only files justified by the game's complexity. Do not copy a dozen empty modules or duplicate shared platform scripts by habit.

Recommended ownership boundaries:

- Engine decides legal moves, rules, state transitions, and completion.
- UI renders state and dispatches actions; it does not secretly redefine rules.
- Content banks hold reviewed facts, scenarios, explanations, and stable IDs.
- Scoring computes from actual state and actions.
- Persistence validates versions and tolerates missing/corrupt saved data.
- Platform integration handles identity, navigation, reporting, and preferences separately from domain logic.

Reuse a proven library for established chess, physics, parsing, or other complex domain engines when appropriate. Educational simplifications must be documented and tested. For 3D, prefer the existing Three.js approach where relevant, resolve compatible modules, and avoid fragile cross-version CDN examples.

### State and Lifecycle

Define explicit states such as introduction, choosing level, playing, paused, results, and leaving. Define which actions are legal in each state.

- Keep one authoritative selected level/world and derive the UI from it.
- Close the previous result overlay before loading the next level.
- Reapply selection after rebuilding a dropdown or other control.
- Guard completion so rapid taps or multiple callbacks do not submit the same attempt repeatedly.
- Clear timers, animation frames, observers, and input listeners on reset, exit, and unmount.
- Decide what visibility changes do to timed tasks and audio.
- Avoid top-level global identifiers in multiple classic scripts; use modules or existing scoped patterns.
- Do not overwrite `window.BhavaNav` or `window.BhavaSession` with a game-local object.
- Treat localStorage as optional and user-controlled. Namespace save keys by game and version; do not put secrets there.

## 7. Registering and Launching a New Game

**Verified:** the active student page uses the selected game's `entryPath` when present and navigates to `/games-static/<entryPath>`. It retains fallback handling for anonymous metadata. Do not guess a filename solely from the slug.

Integration checklist:

1. Choose a unique stable lowercase hyphenated slug. Avoid renaming it casually; attempts and catalogue references depend on identity.
2. Create a real entry file under the live static directory, or implement the verified host path for a non-static game.
3. Register slug, title, domain, `entryPath`, and intended game/activity kind in the seed and frontend metadata.
4. Keep fallback catalogue sets aligned where required. Run the existing parity test rather than relying on manual inspection.
5. Set a valid access tier. The policy supports `assessment`, `permanent-free`, `rotating-free`, and `premium-only`; a valid database `Game.tier` overrides slug lists.
6. For list-based tiers, update the policy. Rotating games also need batch placement; merely setting a tier does not create a schedule.
7. Check the domain's display label, filters, age eligibility, and curated recommendations. Do not force language-specific games into recommendations without an appropriate preference/profile.
8. Add an exact-slug poster under `apps/web/public/game-previews`; current catalogue media uses JPEG posters and optional MP4 previews. Verify the actual media resolver before choosing extensions.
9. Integrate the currently loaded navigation/session helpers once each, using correct relative paths.
10. Check static session inference: `_inferCurrentGame()` currently uses its own `RECOMMENDATION_GAMES` data and path/title matching. A game added only to the API seed may launch but fail to resolve its score-save slug. Update the relevant current metadata or make a separately tested inference improvement.
11. Update an existing database through the approved admin catalogue flow or a deliberate migration/deployment process. Do not run the demo seed against production as an automatic publishing step.
12. Verify launch from the actual catalogue, not only a manually typed URL.

Case sensitivity matters on deployed systems even if a path works on Windows. Legacy entries such as `bhava_Tech_Likhwell.html` are evidence that slug and filename are not always the same. Use the explicit entry path.

`isFreeTier`, database tier overrides, hardcoded policy lists, and anonymous fallback sets are separate existing mechanisms. Do not assume changing one updates all others. Inspect [access tests](../apps/api/src/services/gameEntitlement.test.ts) and [access route tests](../apps/api/src/routes/gamesWithAccess.test.ts) when changing policy.

Access display is not equivalent to server-side authorization. Do not claim a static URL or a client-side gate securely enforces payment. Any change to entitlement enforcement requires its own authorized scope and backend tests.

## 8. Attempts, Identity, Reports, and Rewards

### Verified API Contract

The authenticated endpoint is `POST /api/games/:slug/attempts`. The current body validator requires:

```json
{
  "endTime": "2026-10-11T12:00:00.000Z",
  "durationMs": 45000,
  "score": 87,
  "accuracy": 0.92,
  "hintsUsed": 1,
  "completionStatus": "completed"
}
```

- `durationMs` is a positive integer.
- `score` is numeric; the static helper convention is 0-100, but the route does not enforce that range.
- `accuracy` is 0-1, not 0-100.
- `hintsUsed` is a nonnegative integer.
- Status is `completed`, `abandoned`, or `failed`.
- Use a valid ISO timestamp. The current validator accepts a string; that is not evidence of strict datetime validation.
- The caller supplies a Bearer token; the server resolves the caller's own `Student` profile.

**Identity rule:** `User.id` and `Student.id` are different. The API currently permits any authenticated role to record/view its own play and creates a minimal own Student profile when needed. Games must not select an arbitrary student's ID or assume the JWT's user ID is a Student foreign key.

The history endpoint is `GET /api/games/history`. Its summary reports completed attempts, average score, and best score; the count is not necessarily a count of unique game titles or mastered competencies. Do not relabel these fields as clinical IQ/EQ/SQ.

Completion rewards are awarded server-side, with an additional improvement reward when a previous completed best is exceeded. Do not mint platform coins in game-local storage or award them twice through two reporting paths.

### Existing Static Helper and Its Limitations

For the current web/Android static integration, games use `window.BhavaSession.end(score)`. Do not invent a `BhavaSession.start()` call: the inspected web branch does not expose one.

Current limitations are important:

- Duration starts when the helper loads, not necessarily when active play begins.
- Accuracy is approximated as `score / 100`, bounded to 0-1.
- Hint count is submitted as zero.
- Status is always submitted as `completed`.
- Missing token or unresolved game inference causes no attempt submission.
- The inspected fetch handler catches network exceptions but does not check HTTP success status.
- No reliable deduplication, identity-scoped retry queue, or refresh behavior is established for this branch.
- The recommendations panel can appear about 250 ms after `end()`.

Therefore, the helper is a compatibility path, not proof of full telemetry correctness. Do not tell a player "saved" merely because a request was initiated or the recommendations UI says so.

**Proposed improvement, requiring a separately scoped change:** a richer lifecycle adapter could accept measured duration, real accuracy, hints, status, and a stable attempt identifier. It should check HTTP errors, handle identity changes, and have server-backed idempotency before automatic retries. Do not implement it independently in every new game or submit through it and `BhavaSession.end()` simultaneously.

[The SDK reporter](../packages/game-sdk/src/reportSession.ts) has a separate environment convention and local queue implementation. Do not assume its retry behavior is reliable or wired into the active static flow. Validate network exceptions, non-2xx retries, identity ownership, and duplicate rewards before adopting it. `NEXT_PUBLIC_API_URL` in that file is not interchangeable with Vite's environment conventions.

Historical celebration fix: where `end()` triggers recommendations, call it from the celebration's close callback rather than immediately burying the win screen. Freeze the final score at completion and guard the callback against duplicate submission. Account for exit-before-dismissal if developing a richer reporting lifecycle.

## 9. Navigation, Sound, and Shared Scripts

**Historical convention to verify in the loaded helper:** the universal game navigation bar was standardized to the bottom at all viewport sizes. Reserve space for it, including safe-area insets. Do not resurrect obsolete fixed top padding intended for an older top-positioned bar.

The helper supports internal screen tracking for common conventions such as `.screen`/`.active` and `.level-section`/`.active-level`. Other games may opt in with `BhavaNav.trackScreens(selector, activeClass)`. Its `setNext`, `setNextEnabled`, and `clearNext` APIs are opt-in. Do not show a generic Next button that bypasses completion rules or duplicates an existing game control.

- Back should first respect internal game navigation, then leave the game when appropriate.
- Verify restored state as well as the visible CSS class. Router-owned renderers may need to handle `bhava:screen-restored`.
- Home should follow the game's actual launch context; a public standalone assessment can have different needs from the logged-in catalogue.
- Preserve required Capacitor hardware-back behavior when removing legacy menus.
- Confirm before destructive exit when an in-progress attempt would be lost.
- Avoid two independent Back/Home bars or overlapping menus.

Music preferences have historically been shared between the React site and static pages. Preserve the established on/off and volume behavior. Start audio after a user gesture, allow an obvious mute action, respect visibility changes, and never require sound to understand a task.

Shared filenames are not proof of shared content. Inspect HTML `script src` and CSS imports to determine which copy is actually loaded. Hash-compare copies when changing a genuinely duplicated helper. Most folder games have historically loaded the root navigation helper even when a local copy exists; exceptions exist.

Do not spread old Electron/cloud credentials or roll-number/class login flows into new web/Android games. Legacy compatibility code should remain isolated unless the task explicitly asks to migrate or remove it. Never copy client-visible tokens or secrets into documentation, examples, or a new game.

## 10. Responsive Design and Accessibility

**Proposed release standard:** the primary task must remain visible and operable on small phones, tablets, desktop, and Android WebView. Resizing a desktop screenshot is not sufficient evidence of touch behavior.

- Test at least 320/360/390 px phone widths, a tablet layout, and a desktop layout.
- Check both `scrollWidth` versus `clientWidth` and visible element bounds. An ancestor's `overflow:hidden` can conceal broken layout without producing a scrollbar.
- Use `minmax(0, 1fr)` and `min-width: 0` where nested grid/flex content must shrink.
- Avoid squeezing the main board into a `1fr` row between tall `auto` rows in a height-constrained mobile layout. Check the actual board height for collapse.
- Let tall stacked layouts scroll naturally. Do not hide critical controls or palette items behind restrictive max-heights.
- Keep the playable board's dimensions stable with responsive aspect ratios or explicit tracks.
- Allow translated text, part names, and instructions to wrap normally; do not split every word arbitrarily to disguise insufficient width.
- Scope game/page CSS to avoid collisions with other globally imported styles.
- Put overriding media rules after the base rules they override; inspect duplicate selectors and inline styles before adding `!important`.
- Use touch-friendly hit areas, ideally at least 44 by 44 CSS pixels, and visible focus states.
- Provide keyboard equivalents for drag/drop, such as selecting a part and choosing a slot. Drag-only is not accessible.
- Use real buttons, labels, accessible names, meaningful headings, and live feedback for state changes.
- Do not rely on color or emoji alone to communicate correctness or control meaning.
- Respect reduced motion; allow sound and animation to be disabled where appropriate.
- Ensure overlays, bottom navigation, music controls, reminders, and results do not cover each other or the primary task.
- Avoid rapid flashing, excessive motion, and surprise loud audio.

Use the existing icon library where available. Functional icons need accessible names/tooltips; decorative art does not replace a usable control. Match the game's subject and audience rather than making every game look like the same dashboard or marketing landing page.

## 11. Content Reliability, Localization, and Child Safety

**Proposed standard:** content should have provenance and review, even when generated by an agent.

- Store source references and review dates with the content planning record; distinguish primary sources, interpretation, and invented scenario details.
- Verify factual claims, answer keys, units, equations, and explanations independently of the generated answer.
- Use qualified review for legal, financial, health, psychological, cultural, and assessment-sensitive material.
- Date and localize laws, financial examples, public procedures, and region-specific institutions.
- Include culturally varied names, roles, and experiences without stereotyping competence or personality.
- For Hindi, Telugu, and other scripts, use reviewed language content and fonts with actual glyph support. Preserve intended Unicode; do not write literal escape text where real characters are required.
- Separate UI strings from content when localization warrants it. Test longer translations and right-to-left layouts if supported.
- Track asset licenses and attribution. Do not scrape copyrighted textbooks, protected question banks, or artwork into games.
- Do not require children to submit personal documents, phone numbers, precise locations, voice recordings, or photos for ordinary play.
- Use synthetic data for civic, banking, medical, and security scenarios.
- Preserve consent, parental supervision, account access controls, and existing privacy requirements. New data collection needs explicit approval and retention/access decisions.
- Never log access tokens, passwords, database URLs, signing secrets, or a child's identifying data.
- Avoid manipulative streaks, humiliation, endless pressure, and monetization that interrupts a task. Retain breaks and age-appropriate pacing.

Parent-managed child sessions are an existing platform capability. Verify which identity is active before report/save tests, and test returning to the parent account. Never let a pending attempt from one child be replayed under another person's token.

## 12. Known Failure Patterns and Discriminating Checks

These are historical lessons unless explicitly identified as current limitations above. Reproduce the reported issue first; do not apply every fix preemptively.

| Symptom | Likely mechanism | Cheapest useful check |
| --- | --- | --- |
| A game card opens blank/404 | Guessed path, wrong case, missing entry, or inactive catalogue row | Compare clicked URL with `entryPath`; request it from the actual catalogue. |
| Game launches but never saves | Slug absent from session inference, no token, or failing POST | Inspect resolved current game and the actual attempt request/response. |
| Save/report fails for a parent or admin | Role gate or profile-ID mismatch in the owning API | Exercise own-account POST/history with that role; inspect User-to-Student resolution. |
| Results appear saved but are absent | Non-2xx response ignored by compatibility fetch | Check HTTP status and then fetch history; a fulfilled fetch is not proof of success. |
| Wrongly locked games in logged-in preview | Anonymous fallback chosen from route alone | Check token-aware data loading and access API response. |
| New game breaks access listing | Unknown slug without a valid database tier or policy entry | Run policy/access tests with the new slug. |
| Next world seems to do nothing | Old win overlay still open or rebuilt selector resets selection | Inspect overlay visibility, engine world, and final selector value after transition. |
| Back immediately leaves the game | Internal screens do not create browser history | Test two internal transitions and Back; inspect helper hooks/state restoration. |
| Two nav bars overlap | Legacy menu or bespoke bar plus universal helper | Inspect loaded DOM and scripts, not only game-local CSS. |
| Music button does not mute | Divergent old helper toggles a settings panel instead | Compare loaded helper and verify audio `paused`/time after toggling. |
| Primary mobile board disappears | Height-constrained grid collapses the middle row | Measure the board's rendered height and ancestor row sizing. |
| Mobile content is clipped | Min-content width, hidden overflow, or late duplicate CSS | Check element bounds and winning CSS rules at the failing width. |
| CSS fix has no effect | Wrong stylesheet, dead duplicate, or global sibling selector | Verify the import and the browser's matched rules. |
| Identifier already declared | Same classic script loaded twice | Scan script URLs within that HTML; run JS syntax checks. |
| Syntax/export/OrbitControls errors | Wrong module format, incompatible CDN build, or blocked dependency | Inspect first page error and network failure; verify imports/module versions. |
| Phone card has no artwork | Only video exists or poster name/case differs from slug | Use a touch viewport and check exact poster URL; provide a real poster. |
| Game stops earlier than counter | Displayed total not updated for every mode | Compare engine configuration with visible counter for each mode. |
| Title/preview metadata is inconsistent | SEO injection duplicates title or references absent media | Check one title per page and fetch referenced assets. |
| Browser fix absent in installed Android | Device uses previously bundled web build | Identify installed version; rebuild/sync/install or release through Play. |
| Tests pass locally but production build fails | Build includes test imports without dev dependencies | Inspect production TS exclusions and reproduce relevant build conditions. |

Do not classify browser-extension content-script errors as game defects without a source/URL match. A successful dev build is not evidence that a game finishes, that a score persists, or that the store release contains the fix.

## 13. Validation and Release Gates

Use the smallest check that can disprove the current implementation, then broaden only for relevant risk. A documentation-only change does not require rebuilding Android.

### Focused Commands

From `apps/web`:

```powershell
npm test -- src/data/gamesCatalog.test.ts
npm run build
```

From `apps/api`, when access or backend behavior changes:

```powershell
npm test -- src/services/gameEntitlement.test.ts src/routes/gamesWithAccess.test.ts
npm run build
```

Run other affected tests as appropriate. Package-level `npm test` runs the respective Vitest suite. The root `npm test` is currently a placeholder that fails; do not report it as the repository test gate.

For standalone JavaScript, use `node --check <file>` where applicable, then test in a browser. A syntax check does not exercise DOM behavior, JSON loading, rendering, or ES module dependency resolution. Games loading JSON/modules need a local server rather than opening a file directly.

### Behavioral Acceptance

- Launch through the real catalogue with the intended title, poster, path, and access state.
- Reach the first task; exercise correct, incorrect, hint, retry, pause, reset, and completion paths that exist.
- Test level/world transitions and internal Back/Home; confirm no stale modal or mismatched selected state.
- Confirm displayed counters and timers match actual rules.
- Verify the scoring rubric with known examples and boundary cases.
- Confirm one completion produces one successful attempt and the correct own-account history result.
- Test anonymous behavior, an authenticated learner, and parent-managed child play when applicable; include other permitted roles for reporting changes.
- Test save failure/expired identity visibly; do not claim offline recovery or persistence without exercising it.
- Check page errors and meaningful failed requests, including assets and content banks.
- Capture mobile, tablet, and desktop screenshots; verify the board and controls are actually usable, not just present in markup.
- For 3D/canvas, check nonblank canvas pixels, framing, motion/interactions, and asset loading at mobile and desktop sizes.
- Test keyboard operation, reduced motion, mute, and non-color cues.
- Add focused regression tests for the actual defect or new rule. Reuse existing test files/helpers where practical.

Maintain a release record with exact commands, observed results, remaining limitations, and tested build/version. Do not quote old passing test counts as current evidence.

### Android Is a Separate Delivery Step

**Verified:** [Capacitor config](../apps/android/capacitor.config.ts) uses `webDir: '../web/dist'` and does not specify a live `server.url`. Installed Android contains a bundled web copy.

When an Android release is requested, the usual pipeline is:

1. Build the web app from `apps/web` with `npm run build`.
2. Sync from `apps/android` with `npx cap sync android`.
3. Build from `apps/android/android` with `.\gradlew.bat assembleRelease` for an installable APK, or `.\gradlew.bat bundleRelease` for the Play Store AAB.
4. Verify signing with the appropriate Android tooling for APKs; do not infer that a v2-signed APK is unsigned solely from a legacy JAR verifier.
5. Verify on a real device when relevant. An AAB is not directly installable like an APK.
6. Use a new versionCode for a new Play upload; confirm distribution/rollout separately from sideload testing.

Do not build, sign, upload, bump versions, uninstall an app, or wipe device data unless those operations are in scope. Signing secrets must be entered by the user outside chat. Web deployment alone does not update an already installed bundled app.

API/database changes have their own deployment. Current API `start` runs migrations before starting the server. Review migrations for data safety; do not run a demo seed as a substitute. On Windows, a running Prisma-consuming server can lock the query-engine DLL during generation; identify the specific process and coordinate before stopping it.

## 14. Suggested Agent Responsibilities

These are proposed roles for future agent creation, not existing configured agents or permission to launch delegates automatically.

| Role | Owns | Required handoff |
| --- | --- | --- |
| Curriculum and coverage planner | Objectives, prerequisites, coverage gaps, progression | Approved competency rows, audience, scope, and acceptance criteria. |
| Knowledge/content researcher | Facts, answer explanations, sources, cultural/jurisdictional context | Reviewed content bank and uncertainty/review notes. |
| Game systems designer | Mechanic, state machine, challenge balance, scoring | Core loop, rules, rubric, examples, and edge cases. |
| Implementation agent | Focused code/data changes in the owning game | Working slice, touched files, integration notes, focused test results. |
| Platform integration agent | Registration, entry paths, access, session reporting, recommendations | Catalogue parity and real launch/save/history evidence. |
| Responsive/accessibility reviewer | Touch, small screens, keyboard, layout, audio/motion | Viewport evidence and actionable defects. |
| QA/release reviewer | Regression checks, asset/network failures, packaging boundaries | Pass/fail record, unresolved risks, and exact build identity. |
| Subject/safety reviewer | Sensitive claims, learning validity, child safety, licenses | Approval or concrete required corrections before release. |

Keep work boundaries explicit. Two agents should not edit the same shared helper independently. Resolve a cross-cutting change through one owner with reviewed consumers. Content generation should not approve its own factual correctness merely by re-reading itself.

Agents must ask before expanding scope, changing an agreed mechanic, altering access/pricing, collecting new data, introducing a service, or affecting a separate app/release. Do not commit, push, deploy, or create branches unless requested.

## 15. Copyable Task Brief

```text
Task type: new game / extend game / fix defect / content review / integration
Owning game or surface:
Slug and exact entryPath:
Existing template and why it fits:
Learner age, prerequisites, language, and accessibility needs:
Knowledge area and competency IDs:
Observable learning objectives:
Way of knowing being practised:
Core loop and first meaningful interaction:
Rules, allowed actions, and completion conditions:
Content bank size, sources, review requirements, and repetition policy:
Levels, difficulty progression, practice/untimed options:
Scoring rubric and boundary examples:
Feedback, hints, reflection, and transfer task:
Save/resume/reset and attempt lifecycle:
Game/activity classification and intended access tier:
Platform integration and shared helper ownership:
Required assets, licenses, posters, and localization:
Supported viewports and input methods:
Safety/privacy constraints:
Non-goals and protected existing behavior:
Smallest initial implementation slice:
First falsifiable hypothesis and discriminating check:
Required unit/browser/device evidence:
Deployment target and whether release work is authorized:
Definition of done and reviewer:
```

## 16. Definition of Done and Agent Handoff

A game is ready only when the approved learning slice works, content is reviewed, the actual intended learner can use it, registration is consistent, and required persistence/release behavior has evidence.

Each agent's final handoff should state:

- What was implemented and which objectives it covers.
- Files changed and the owning entry point.
- Facts/content sources and review status.
- Exact tests and browser/device checks performed, with observed outcomes.
- Integration status: catalogue, access, inference, reporting, and assets.
- What remains approximate, unverified, deferred, or out of scope.
- Whether changes are local only, deployed to web/API, bundled into Android, or actually distributed.

Prefer one complete, reviewed learning slice over a wide menu of empty subjects. Expand coverage through a maintained competency matrix, deeper mechanics, and verified releases rather than increasing game count alone.