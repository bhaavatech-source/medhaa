// apps/api/src/registry/gameRegistry.seed.ts
// Registers all existing Bhava Tech games into MEDHAA's unified Game table.
// Each entry maps a legacy game (built independently) to the shared
// GameSession contract so it plugs into gamification, reports, and
// entitlements without modification to its internal logic.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Domain groups mirror Bhava Tech's existing catalog. Add new rows here
// as more games are migrated — never hardcode game lists elsewhere.
export const LEGACY_GAME_CATALOG = [
  // Cognitive / Math domain
  { slug: 'math-blitz', title: 'Math Blitz', domain: 'cognitive-math', isFreeTier: true },
  { slug: 'logic-grid', title: 'Logic Grid', domain: 'cognitive-logic', isFreeTier: true },
  { slug: 'memory-match', title: 'Memory Match', domain: 'cognitive-memory', isFreeTier: true },
  { slug: 'number-ninja', title: 'Number Ninja', domain: 'cognitive-math', isFreeTier: true },
  { slug: 'pattern-quest', title: 'Pattern Quest', domain: 'cognitive-logic', isFreeTier: false },
  { slug: 'speed-sums', title: 'Speed Sums', domain: 'cognitive-math', isFreeTier: false },
  { slug: 'shape-sorter', title: 'Shape Sorter', domain: 'cognitive-spatial', isFreeTier: true },
  { slug: 'sudoku-junior', title: 'Sudoku Junior', domain: 'cognitive-logic', isFreeTier: false },

  // Language / Devanagari domain
  { slug: 'devanagari-learning', title: 'Devanagari Learning', domain: 'language-hindi', isFreeTier: true },
  { slug: 'akshar-match', title: 'Akshar Match', domain: 'language-hindi', isFreeTier: false },
  { slug: 'shabd-builder', title: 'Shabd Builder', domain: 'language-hindi', isFreeTier: false },
  { slug: 'vocab-voyage', title: 'Vocab Voyage', domain: 'language-english', isFreeTier: true },
  { slug: 'grammar-guardian', title: 'Grammar Guardian', domain: 'language-english', isFreeTier: false },

  // Civics / NagarikX domain
  { slug: 'nagarikx', title: 'NagarikX', domain: 'civics', isFreeTier: false },
  { slug: 'constitution-quest', title: 'Constitution Quest', domain: 'civics', isFreeTier: false },
  { slug: 'rights-runner', title: 'Rights Runner', domain: 'civics', isFreeTier: false },

  // Finance domain
  { slug: 'finance-blitz', title: 'Finance Blitz', domain: 'finance', isFreeTier: false },
  { slug: 'budget-builder', title: 'Budget Builder', domain: 'finance', isFreeTier: false },
  { slug: 'savings-sprint', title: 'Savings Sprint', domain: 'finance', isFreeTier: true },
  { slug: 'investment-island', title: 'Investment Island', domain: 'finance', isFreeTier: false },

  // Emotional intelligence domain
  { slug: 'emotion-explorer', title: 'Emotion Explorer', domain: 'emotional-intel', isFreeTier: true },
  { slug: 'empathy-quest', title: 'Empathy Quest', domain: 'emotional-intel', isFreeTier: false },
  { slug: 'mood-mirror', title: 'Mood Mirror', domain: 'emotional-intel', isFreeTier: true },
  { slug: 'conflict-resolver', title: 'Conflict Resolver', domain: 'emotional-intel', isFreeTier: false },

  // Add remaining ~20 titles from Bhava Tech catalog following this exact
  // pattern — slug (kebab-case, unique), title, domain, isFreeTier.
  // Placeholder rows removed intentionally; populate with real catalog data
  // before running the seed script in production.
] as const;

export async function seedGameRegistry(): Promise<void> {
  for (const entry of LEGACY_GAME_CATALOG) {
    await prisma.game.upsert({
      where: { slug: entry.slug },
      update: { title: entry.title, domain: entry.domain, isFreeTier: entry.isFreeTier },
      create: entry,
    });
  }
  console.log(`Seeded ${LEGACY_GAME_CATALOG.length} games into registry.`);
}

if (require.main === module) {
  seedGameRegistry()
    .then(() => prisma.$disconnect())
    .catch((err) => {
      console.error(err);
      prisma.$disconnect();
      process.exit(1);
    });
}
