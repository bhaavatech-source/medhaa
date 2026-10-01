import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GAMES_CATALOG } from './gamesCatalog';

const seedSource = readFileSync(
  resolve(process.cwd(), '../../apps/api/prisma/seed.ts'),
  'utf8',
);
const studentGamesSource = readFileSync(
  resolve(process.cwd(), 'src/components/StudentGamesPage.tsx'),
  'utf8',
);
const prismaSchemaSource = readFileSync(
  resolve(process.cwd(), '../../apps/api/prisma/schema.prisma'),
  'utf8',
);
const gamesData = seedSource.match(/const gamesData = \[([\s\S]*?)\n  \];/)?.[1] ?? '';
const seededRows = gamesData.split(/\r?\n/).flatMap((line) => {
  const slug = line.match(/slug:\s*'([^']+)'/)?.[1];
  const entryPath = line.match(/entryPath:\s*'([^']+)'/)?.[1];
  const isFreeTier = line.match(/isFreeTier:\s*(true|false)/)?.[1] === 'true';
  return slug && entryPath ? [{ slug, entryPath, isFreeTier }] : [];
});
const activitySet = seedSource.match(/const ACTIVITY_SLUGS = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? '';
const seededActivities = new Set([...activitySet.matchAll(/'([^']+)'/g)].map((match) => match[1]));

function slugsFromLines(source: string) {
  return source.split(/\r?\n/).flatMap((line) => {
    const slug = line.match(/slug:\s*'([^']+)'/)?.[1];
    return slug ? [slug] : [];
  });
}

function fallbackSlugs(name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = studentGamesSource.match(
    new RegExp(`const ${escapedName} = new Set\\(\\[([\\s\\S]*?)\\]\\);`),
  )?.[1] ?? '';
  return [...block.matchAll(/'([^']+)'/g)].map((match) => match[1]);
}

describe('game catalog parity', () => {
  it('keeps frontend games and entry paths aligned with the API seed', () => {
    const seedSlugs = seededRows.map((row) => row.slug).sort();
    const catalogSlugs = Object.keys(GAMES_CATALOG).sort();
    const staticGamesRoot = resolve(process.cwd(), 'public/games-static');

    expect(catalogSlugs).toEqual(seedSlugs);
    expect(seededRows.filter((row) => !existsSync(resolve(staticGamesRoot, row.entryPath))).map((row) => row.slug)).toEqual([]);
    expect(new Set(seedSlugs).size).toBe(seedSlugs.length);
  });

  it('keeps anonymous fallback access tiers aligned with the seed', () => {
    const permanentFreeSlugs = seededRows.filter((row) => row.isFreeTier).map((row) => row.slug);
    const rotatingFreeData = gamesData.split('// Rotating Free')[1]?.split('// Premium Only')[0] ?? '';
    const rotatingFreeSlugs = slugsFromLines(rotatingFreeData);

    expect(fallbackSlugs('FALLBACK_PERMANENT_FREE_SLUGS').sort()).toEqual(permanentFreeSlugs.sort());
    expect(fallbackSlugs('FALLBACK_ROTATING_SLUGS').sort()).toEqual(rotatingFreeSlugs.sort());
  });

  it('keeps game/activity labels aligned with the Prisma kind column and seed', () => {
    const gameModel = prismaSchemaSource.match(/model Game \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(gameModel).toMatch(/\bkind\s+String\s+@default\("game"\)/);
    expect([...seededActivities].filter((slug) => !seededRows.some((game) => game.slug === slug))).toEqual([]);

    for (const game of seededRows) {
      expect(GAMES_CATALOG[game.slug].kind ?? 'game').toBe(
        seededActivities.has(game.slug) ? 'activity' : 'game',
      );
    }
  });
});