import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GAMES_CATALOG, getGameDisplayTitle } from './gamesCatalog';

const gameRoot = resolve(process.cwd(), 'public/games-static/devanagari-game');
const html = readFileSync(resolve(gameRoot, 'index.html'), 'utf8');

describe('Devanagari production integration', () => {
  it('serves built assets rather than a Vite source project', () => {
    expect(html).not.toContain('/src/main.tsx');
    const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)];
    expect(assets.length).toBeGreaterThanOrEqual(2);
    for (const [, asset] of assets) {
      expect(existsSync(resolve(gameRoot, asset))).toBe(true);
    }
    for (const name of ['src', 'node_modules', 'package.json', 'vite.config.ts']) {
      expect(existsSync(resolve(gameRoot, name))).toBe(false);
    }
  });

  it('loads the shared platform helpers once and keeps phone portrait support', () => {
    for (const name of ['bhava-session.js', 'bhava-game-nav.js']) {
      expect(html.split(`src="../${name}"`)).toHaveLength(2);
      expect(existsSync(resolve(gameRoot, '..', name))).toBe(true);
    }
    expect(html).not.toContain('bhava-universal-nav');
    expect(html).toContain('data-bhava-mobile="off"');
    expect(html).not.toContain('responsivevoice.org');
    expect(JSON.parse(readFileSync(resolve(gameRoot, 'audio/manifest.json'), 'utf8')).items).toBeTypeOf('object');
  });

  it('describes the expanded game without changing its slug or domain', () => {
    const game = GAMES_CATALOG['devanagari-game'];
    expect(game.slug).toBe('devanagari-game');
    expect(game.title).toBe('Akṣarābhyāsaḥ');
    expect(html).toContain('data-bhava-game="Akṣarābhyāsaḥ"');
    expect(html).toContain('अक्षराभ्यासः · Akṣarābhyāsaḥ');
    expect(game.domain).toBe('language-hindi');
    expect([game.ageMin, game.ageMax]).toEqual([6, 17]);
    expect(game.skillsBuilt).toContain('Handwriting & Stroke Order');
  });

  it('publishes the updated Sankhyāḥ page and vocalic L sign', () => {
    const script = [...html.matchAll(/src="(\.\/assets\/[^"]+\.js)"/g)][0]?.[1];
    if (!script) throw new Error('Missing production game script.');

    const bundle = readFileSync(resolve(gameRoot, script), 'utf8');
    expect(bundle).toContain('संख्याः');
    expect(bundle).toContain('Large numbers');
    expect(bundle).toContain('क + ॢ = कॢ');
    expect(bundle).not.toContain('स्थानमूल्यम्');
    expect(bundle).not.toContain('संख्यालेखनाभ्यासः');
  });

  it('uses the IAST name for legacy API titles without renaming other games', () => {
    expect(getGameDisplayTitle('devanagari-game', 'Devanagari Game')).toBe('Akṣarābhyāsaḥ');
    expect(getGameDisplayTitle('devanagari-game', 'Devanagari')).toBe('Akṣarābhyāsaḥ');
    expect(getGameDisplayTitle('grammar-galaxy', 'Grammar Galaxy')).toBe('Grammar Galaxy');
    const seed = readFileSync(resolve(process.cwd(), '../api/prisma/seed.ts'), 'utf8');
    expect(seed).toContain("slug: 'devanagari-game', title: 'Akṣarābhyāsaḥ'");
  });
});
