export type GameTier = 'assessment' | 'permanent-free' | 'rotating-free' | 'premium-only';

export const ASSESSMENT_TOOLS = [
  'bcs-lite-v3',
];

export const PERMANENT_FREE_GAMES = [
  'bhava-build-device-engineer',
  'bhava-smriti',
  'build-your-car',
  'focus-flash',
  'life-strategist-starter',
  'dharana-arena',
  'nagarikx-enhanced',
  'planet-guardians',
  'soccomm-enhanced',
  'neuroflash-memory',
  'calm-zone',
  'good-habits',                          // NEW
  'medha-read-anybook-in-3hrs',           // NEW
];

export const ROTATING_FREE_BATCHES: string[][] = [
  ['bhava-tech-likhwell', 'brain-garden', 'brain-quest', 'day-hero-game', 'day-super-hero', 'iq-test-level-3'],
  ['logic-game', 'math-blitz-example', 'math-blitz', 'memory-match-puzzle', 'memory-match-ultimate', 'memory-zoo-puzzle'],
  ['mindscape-pro', 'mindspark-iq', 'neurospark', 'percentile-game'],
];

export const ROTATING_FREE_GAMES = ROTATING_FREE_BATCHES.flat();

const ROTATING_FREE_UNLOCK_START_DAY = 31;
const ROTATING_FREE_BATCH_LENGTH_DAYS = 7;

function getActiveBatchIndex(daysSinceSignup: number): number {
  if (daysSinceSignup < ROTATING_FREE_UNLOCK_START_DAY) return -1;
  const daysIntoRotation = daysSinceSignup - ROTATING_FREE_UNLOCK_START_DAY;
  const weeksElapsed = Math.floor(daysIntoRotation / ROTATING_FREE_BATCH_LENGTH_DAYS);
  return weeksElapsed % ROTATING_FREE_BATCHES.length;
}

function getRotatingFreeStatus(slug: string, daysSinceSignup: number): { allowed: boolean; reason: string } {
  const gameBatchIndex = ROTATING_FREE_BATCHES.findIndex((batch) => batch.includes(slug));
  if (gameBatchIndex === -1) {
    return { allowed: false, reason: 'not scheduled' };
  }

  const activeBatchIndex = getActiveBatchIndex(daysSinceSignup);

  if (activeBatchIndex === -1) {
    return { allowed: false, reason: `unlocks on day ${ROTATING_FREE_UNLOCK_START_DAY}` };
  }

  if (gameBatchIndex === activeBatchIndex) {
    return { allowed: true, reason: `this week's rotation (batch ${activeBatchIndex + 1})` };
  }

  return { allowed: false, reason: `locked — plays in a future rotation (batch ${gameBatchIndex + 1})` };
}

export const PREMIUM_ONLY_GAMES = [
  'nadopaasana',
  'career-adventure',
  'finlife-india-quest-enhanced',
  'focus-under-distraction',
  'motorcycle-one-workshop',
  'neuro-ascend-iq',
  'number-garden-quest',
  'take-test',
  'telugu-script-game',
  'bhava-math-grid',
  'bhava-space-academy',
  'drone-build-engineer',
  'hidden-maths',
  'intelligent-machines',
  'rocket-build-engineer',
  'plane-builder',
  'secret-of-silicon-game',
  'devanagari-game',
  'ready-for-the-world',
  'google-search-lab-deep-v2',
  'grammar-galaxy',
  'grammar-pro',
  'heart-heroes',
  'imaginia-quest',
  'bhava-tech-build-your-bike',   // NEW
  'know-maths',                   // NEW
  'empathy-quest',                // NEW
   'mental-rotation-game',          // ADD
  'visual-difference-detector',    // ADD
  'empathy-conversation',          // ADD
  'hidden-science',                // ADD
  'logic-grid-puzzle',             // ADD

];

const PREMIUM_TRIAL_DAYS = 10;
const ROTATING_FREE_UNLOCK_DAY = 31;

export function getGameTier(slug: string): GameTier {
  if (ASSESSMENT_TOOLS.includes(slug)) return 'assessment';
  if (PERMANENT_FREE_GAMES.includes(slug)) return 'permanent-free';
  if (ROTATING_FREE_GAMES.includes(slug)) return 'rotating-free';
  if (PREMIUM_ONLY_GAMES.includes(slug)) return 'premium-only';
  throw new Error(`Unknown game slug: ${slug}. Add it to gameEntitlement.ts before deploying.`);
}

interface CheckGameAccessInput {
  gameSlug: string;
  accountCreatedAt: Date;
  isSubscribed: boolean;
}

interface CheckGameAccessResult {
  tier: GameTier;
  allowed: boolean;
  reason: string;
  daysSinceSignup: number;
}

export function checkGameAccess({
  gameSlug,
  accountCreatedAt,
  isSubscribed,
}: CheckGameAccessInput): CheckGameAccessResult {
  const tier = getGameTier(gameSlug);
  const daysSinceSignup = Math.floor(
    (Date.now() - accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (tier === 'assessment') {
    return { tier, allowed: true, reason: 'assessment tool', daysSinceSignup };
  }

  if (tier === 'permanent-free') {
    return { tier, allowed: true, reason: 'permanent free game', daysSinceSignup };
  }

  if (tier === 'rotating-free') {
  const status = getRotatingFreeStatus(gameSlug, daysSinceSignup);
  return { tier, allowed: status.allowed, reason: status.reason, daysSinceSignup };
}

  if (tier === 'premium-only') {
    if (isSubscribed) {
      return { tier, allowed: true, reason: 'premium subscriber', daysSinceSignup };
    }
    if (daysSinceSignup <= PREMIUM_TRIAL_DAYS) {
      return {
        tier,
        allowed: true,
        reason: `trial: ${PREMIUM_TRIAL_DAYS - daysSinceSignup}d left`,
        daysSinceSignup,
      };
    }
    return { tier, allowed: false, reason: 'premium subscription required', daysSinceSignup };
  }

  return { tier, allowed: false, reason: 'unknown tier', daysSinceSignup };
}