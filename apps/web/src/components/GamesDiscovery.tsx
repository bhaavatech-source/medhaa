// GamesDiscovery.tsx
// Additive new page — does NOT modify GamesGrid.tsx, GameCard.tsx, or any
// backend route. Fetches the same games-with-access data independently and
// renders ONE featured game per domain (big attractive card with icon,
// tagline, a real "what you do" description, and skill badges pulled from
// the marketing catalog), instead of a long list. After a child clicks
// Play, similar (same-domain, not-yet-played) games appear as a small
// recommendation row. Featured picks rotate via gameExposure so repeats
// are avoided across visits.
//
// Aug 2026 revision: cards now surface `description` (the vivid, accurate
// "what you actually do" copy) and all of `skillsBuilt` as badges, instead
// of just a one-line tagline + a single "Also builds" tag.

import { useEffect, useState } from 'react';
import { GameTier } from './GameCard';
import { getCatalogEntry } from '../data/gamesCatalog';
import { pickFeaturedPerDomain, getSimilarGames, markSeen, markPlayed } from '../services/gameExposure';
import '../styles/games-discovery.css';

interface GameWithAccess {
  slug: string;
  title: string;
  domain: string;
  ageLabel: string;
  skills: string[];
  tier: GameTier;
  access: { allowed: boolean; reason: string; daysSinceSignup: number };
}

const folderBasedSlugs = new Set([
  'bhava-build-device-engineer', 'bhava-smriti', 'bhava-space-academy',
  'bhava-tech-build-your-bike', 'brain-of-all-machines', 'build-your-car',
  'devanagari-game', 'drone-build-engineer', 'focus-flash', 'hidden-maths',
  'intelligent-machines', 'know-maths', 'life-strategist-starter',
  'nadopaasana', 'plane-builder', 'rocket-build-engineer', 'secret-of-silicon-game',
]);

function playPath(slug: string) {
  return folderBasedSlugs.has(slug)
    ? `/games-static/${slug}/index.html`
    : `/games-static/${slug}.html`;
}

function domainLabel(domain: string): string {
  const map: Record<string, string> = {
    'cognitive-assessment': 'IQ Assessment', 'cognitive-focus': 'Focus & Attention',
    'cognitive-logic': 'Logic & Reasoning', 'cognitive-math': 'Math Skills',
    'cognitive-memory': 'Memory', 'emotional-intel': 'Emotional Intelligence',
    'stem-engineering': 'Engineering', environment: 'Science in Life',
    'life-skills': 'Life Skills', creativity: 'Creativity', music: 'Music',
    'language-english': 'English', 'language-hindi': 'Hindi', 'language-telugu': 'Telugu',
    career: 'Career Explorer', civics: 'Civics', finance: 'Financial Literacy',
    'digital-literacy': 'Digital Literacy',
  };
  return map[domain] ?? domain.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GamesDiscovery({ apiUrl }: { apiUrl: string }) {
  const [games, setGames] = useState<GameWithAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [playedSlug, setPlayedSlug] = useState<string | null>(null);
  const [featured, setFeatured] = useState<GameWithAccess[]>([]);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('accessToken');
      const endpoint = token ? '/games-with-access/with-access' : '/games-with-access/public';
      const res = await fetch(`${apiUrl}${endpoint}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { setLoading(false); return; }
      const data = await res.json();
      const allGames: GameWithAccess[] = data.games ?? [];
      const visible = allGames.filter((g) => (g.tier === 'rotating-free' ? g.access.allowed : true));
      const picks = pickFeaturedPerDomain(visible);
      picks.forEach((g: GameWithAccess) => markSeen(g.slug));
      setGames(visible);
      setFeatured(picks);
      setLoading(false);
    }
    load();
  }, [apiUrl]);

  function handlePlay(slug: string) {
    markPlayed(slug);
    setPlayedSlug(slug);
    window.open(playPath(slug), '_blank');
  }

  if (loading) return <div className="discovery-loading">Loading today's games…</div>;
  if (featured.length === 0) return <div className="discovery-empty">No games available yet. Check back soon!</div>;

  return (
    <div className="discovery-page">
      <h1 className="discovery-title">Pick a game to play today</h1>
      <p className="discovery-subtitle">One fresh pick per skill area — new games rotate in as you play</p>

      <div className="discovery-grid">
        {featured.map((g) => {
          const cat = getCatalogEntry(g.slug);
          const locked = !g.access.allowed;
          const color = cat?.color ?? '#7c3aed';
          const skills = cat?.skillsBuilt ?? (cat?.secondary ? [cat.secondary] : []);

          return (
            <div key={g.slug} className="discovery-card" style={{ borderColor: color }}>
              <span className="discovery-domain-label" style={{ backgroundColor: color }}>
                {domainLabel(g.domain)}
              </span>

              <div className="discovery-emoji" aria-hidden="true">{cat?.emoji ?? '🎮'}</div>

              <h2 className="discovery-card-title">{cat?.title ?? g.title}</h2>
              <p className="discovery-card-tagline">{cat?.tagline ?? 'A fun way to build new skills.'}</p>

              <p className="discovery-card-description">
                {cat?.description ?? 'A fun way to build new skills — jump in and see what you can do.'}
              </p>

              {skills.length > 0 && (
                <div className="discovery-skill-badges">
                  {skills.map((skill) => (
                    <span key={skill} className="discovery-skill-badge" style={{ borderColor: color }}>
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <button
                type="button"
                className={locked ? 'discovery-play-btn locked' : 'discovery-play-btn'}
                style={!locked ? { backgroundColor: color } : undefined}
                onClick={() => handlePlay(g.slug)}
                disabled={locked}
              >
                {locked ? 'Locked' : 'Play Now'}
              </button>

              {playedSlug && (
                <RecommendedRow
                  allGames={games}
                  currentSlug={playedSlug}
                  domain={g.domain}
                  visibleFor={playedSlug}
                  onPlay={handlePlay}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecommendedRow({
  allGames, currentSlug, domain, visibleFor, onPlay,
}: {
  allGames: GameWithAccess[]; currentSlug: string; domain: string;
  visibleFor: string; onPlay: (slug: string) => void;
}) {
  if (currentSlug !== visibleFor) return null;
  const similar = getSimilarGames(allGames, currentSlug, domain);
  if (similar.length === 0) return null;

  return (
    <div className="discovery-recommended-row">
      <p className="discovery-recommended-label">You might also like</p>
      <div className="discovery-recommended-list">
        {similar.map((g: GameWithAccess) => {
          const cat = getCatalogEntry(g.slug);
          return (
            <button
              key={g.slug}
              type="button"
              className="discovery-recommended-item"
              onClick={() => onPlay(g.slug)}
              title={cat?.description}
            >
              <span className="discovery-recommended-emoji">{cat?.emoji ?? '🎮'}</span>
              <span className="discovery-recommended-title">{cat?.title ?? g.title}</span>
              {cat?.tagline && <span className="discovery-recommended-tagline">{cat.tagline}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
