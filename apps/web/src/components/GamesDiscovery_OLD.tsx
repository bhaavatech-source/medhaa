// GamesDiscovery.tsx
// Additive new page — does NOT modify GamesGrid.tsx, GameCard.tsx, or any
// backend route. Fetches the same games-with-access data independently and
// renders ONE featured game per domain (big attractive card with image-style
// icon + real tagline from the marketing catalog), instead of a long list.
// After a child clicks Play, similar (same-domain, not-yet-played) games
// appear as a small recommendation row. Featured picks rotate via
// gameExposure so repeats are avoided across visits.

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

  if (loading) return <div className="gd-loading">Loading todays games…</div>;
  if (featured.length === 0) return <div className="gd-empty">No games available yet. Check back soon!</div>;

  return (
    <div className="gd-wrap">
      <div className="gd-header">
        <h1 className="gd-title">Pick a game to play today</h1>
        <p className="gd-subtitle">One fresh pick per skill area — new games rotate in as you play</p>
      </div>

      <div className="gd-featured-grid">
        {featured.map((g) => {
          const cat = getCatalogEntry(g.slug);
          const locked = !g.access.allowed;
          const color = cat?.color ?? '#7c3aed';
          return (
            <div key={g.slug} className={`gd-card ${locked ? 'gd-locked' : ''}`}>
              <div className="gd-card-band" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
                <span className="gd-domain-tag">{domainLabel(g.domain)}</span>
                <div className="gd-cover-shapes">
                  <span className="gd-shape gd-shape-1" />
                  <span className="gd-shape gd-shape-2" />
                  <span className="gd-shape gd-shape-3" />
                </div>
                <div className="gd-emoji-wrap">
                  <span className="gd-emoji">{cat?.emoji ?? '🎮'}</span>
                </div>
              </div>
              <div className="gd-card-body">
                <h3 className="gd-card-title">{cat?.title ?? g.title}</h3>
                <p className="gd-card-tagline">{cat?.tagline ?? 'A fun way to build new skills.'}</p>
                {cat?.secondary && <span className="gd-card-chip">Also builds {cat.secondary}</span>}
                <button
                  className="gd-play-btn"
                  style={{ background: color }}
                  disabled={locked}
                  onClick={() => handlePlay(g.slug)}
                >
                  {locked ? 'Locked' : 'Play Now'}
                </button>
              </div>

              {playedSlug && (
                <RecommendedRow
                  allGames={games}
                  currentSlug={playedSlug}
                  domain={g.domain}
                  visibleFor={g.slug}
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
    <div className="gd-reco-row">
      <p className="gd-reco-label">You might also like</p>
      <div className="gd-reco-list">
        {similar.map((g: GameWithAccess) => {
          const cat = getCatalogEntry(g.slug);
          return (
            <button key={g.slug} className="gd-reco-chip" onClick={() => onPlay(g.slug)}>
              {cat?.title ?? g.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}