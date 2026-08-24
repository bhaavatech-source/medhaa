// gameExposure.ts
// Additive helper — tracks which games a student has already "seen" as the
// featured game and which they've "played", so the Discovery page can rotate
// in fresh games instead of repeating the same ones. Uses localStorage only.
// Does not touch any existing file or backend logic.

const SEEN_KEY = 'medhaa-seen-games';
const PLAYED_KEY = 'medhaa-played-games';

function readSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export function markSeen(slug: string) {
  const set = readSet(SEEN_KEY);
  set.add(slug);
  writeSet(SEEN_KEY, set);
}

export function markPlayed(slug: string) {
  const set = readSet(PLAYED_KEY);
  set.add(slug);
  writeSet(PLAYED_KEY, set);
}

export function getSeenSlugs(): Set<string> {
  return readSet(SEEN_KEY);
}

export function getPlayedSlugs(): Set<string> {
  return readSet(PLAYED_KEY);
}

// Picks one game per domain the student hasn't already seen as "featured".
// Randomized among unseen games each visit; falls back to the full domain
// pool once everything has been shown, so the page never breaks.
export function pickFeaturedPerDomain<T extends { slug: string; domain: string }>(
  games: T[]
): T[] {
  const seen = getSeenSlugs();
  const byDomain: Record<string, T[]> = {};
  games.forEach((g) => {
    (byDomain[g.domain] ??= []).push(g);
  });

  const featured: T[] = [];
  Object.values(byDomain).forEach((domainGames) => {
    const unseen = domainGames.filter((g) => !seen.has(g.slug));
    const pool = unseen.length > 0 ? unseen : domainGames;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) featured.push(pick);
  });
  return featured;
}

// Similar games = same domain, excluding the given slug and anything already
// played, capped to a small row so it never turns into another long list.
export function getSimilarGames<T extends { slug: string; domain: string }>(
  allGames: T[],
  currentSlug: string,
  domain: string,
  limit = 4
): T[] {
  const played = getPlayedSlugs();
  return allGames
    .filter((g) => g.domain === domain && g.slug !== currentSlug && !played.has(g.slug))
    .slice(0, limit);
}
