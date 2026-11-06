import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const target = resolve(root, '..', '..', 'apps', 'web', 'public', 'games-static', 'devanagari-game');
const html = readFileSync(resolve(dist, 'index.html'), 'utf8');

if (html.includes('/src/main.tsx') || !html.includes('./assets/')) {
  throw new Error('Build the production game before publishing.');
}
for (const path of ['../bhava-session.js', '../bhava-game-nav.js']) {
  if (!html.includes(path) || !existsSync(resolve(target, path))) {
    throw new Error(`Missing Medhaa integration: ${path}`);
  }
}
for (const match of html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)) {
  if (!existsSync(resolve(dist, match[1]))) {
    throw new Error(`Missing production asset: ${match[1]}`);
  }
}

mkdirSync(target, { recursive: true });
// Replace only generated directories; preserve the host's responsive helpers.
for (const name of ['assets', 'audio']) {
  rmSync(resolve(target, name), { recursive: true, force: true });
}
for (const entry of readdirSync(dist)) {
  cpSync(resolve(dist, entry), resolve(target, entry), { recursive: true });
}
console.log(`Published Devanagari to ${target}`);
