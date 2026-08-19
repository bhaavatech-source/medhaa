import { useEffect, useState } from 'react';
import { GameCard, GameTier } from './GameCard';
import { BrainScoreNudge } from './BrainScoreNudge';
import { useGameGate } from '../pages/hooks/useGameGate';
import LoginPricingModal from './LoginPricingModal';
import '../styles/games-grid.css';
import '../styles/games-grid-enhanced.css';

interface GameWithAccess {
  slug: string;
  title: string;
  domain: string;
  ageLabel: string;
  skills: string[];
  kind: 'game' | 'activity';   // ADD THIS LINE
  tier: GameTier;
  access: { allowed: boolean; reason: string; daysSinceSignup: number };
}

interface GamesGridProps {
  apiUrl: string;
  domainFilter?: string[] | null;
  excludeDomains?: string[] | null;
}

export function GamesGrid({ apiUrl, domainFilter = null, excludeDomains = null }: GamesGridProps) {
  const [games, setGames] = useState<GameWithAccess[]>([]);
  const [lastCheckInAt, setLastCheckInAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { showGate, setShowGate, tryPlay } = useGameGate();

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('accessToken');
      const endpoint = token ? '/games-with-access/with-access' : '/games-with-access/public';

      const res = await fetch(`${apiUrl}${endpoint}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        console.error('Failed to load games:', res.status);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setGames(data.games ?? []);
      setLastCheckInAt(data.lastCheckInAt ?? null);
      setLoading(false);
    }
    load();
  }, [apiUrl]);

  const filteredGames = domainFilter
    ? games.filter((g) => domainFilter.includes(g.domain))
    : excludeDomains
    ? games.filter((g) => !excludeDomains.includes(g.domain))
    : games;

  const visibleGames = filteredGames.filter((g) => {
    if (g.tier === 'rotating-free') return g.access.allowed;
    return true;
  });

  const grouped = visibleGames.reduce<Record<string, GameWithAccess[]>>((acc, g) => {
    (acc[g.domain] ??= []).push(g);
    return acc;
  }, {});

  const folderBasedSlugs = new Set([
    'bhava-build-device-engineer',
    'bhava-smriti',
    'bhava-space-academy',
    'bhava-tech-build-your-bike',
    'brain-of-all-machines',
    'build-your-car',
    'devanagari-game',
    'drone-build-engineer',
    'focus-flash',
    'hidden-maths',
    'intelligent-machines',
    'know-maths',
    'life-strategist-starter',
    'nadopaasana',
    'plane-builder',
    'rocket-build-engineer',
    'secret-of-silicon-game',
  ]);

  function handlePlay(slug: string) {
    if (!tryPlay(slug)) return;
    const path = folderBasedSlugs.has(slug)
      ? `/games-static/${slug}/index.html`
      : `/games-static/${slug}.html`;
    window.location.href = path;
  }

  function openAssessment() {
    handlePlay('bcs-lite-v3');
  }

  if (loading) return <div className="games-grid-loading">Loading games…</div>;

  if ((domainFilter || excludeDomains) && visibleGames.length === 0) {
    return (
      <div className="games-grid-empty">
        No games found for this domain yet. More coming soon!
      </div>
    );
  }

  return (
    <div className="games-grid-wrap">
      <BrainScoreNudge lastCheckInAt={lastCheckInAt} onOpenAssessment={openAssessment} />

      {Object.entries(grouped).map(([domain, domainGames]) => (
        <section key={domain} className="domain-section">
          <h2 className="domain-title">{formatDomainLabel(domain)}</h2>
          <div className="games-grid">
            {domainGames.map((g) => (
              <GameCard key={g.slug} {...g} onPlay={handlePlay} apiUrl={apiUrl} />
            ))}
          </div>
        </section>
      ))}

      {showGate && <LoginPricingModal onClose={() => setShowGate(false)} />}
    </div>
  );
}

function formatDomainLabel(domain: string): string {
  const map: Record<string, string> = {
    'cognitive-assessment': 'IQ Assessment',
    'cognitive-focus': 'Focus & Attention',
    'cognitive-logic': 'Logic & Reasoning',
    'cognitive-math': 'Math Skills',
    'cognitive-memory': 'Memory',
    'emotional-intel': 'Emotional Intelligence',
    'stem-engineering': 'Engineering',
    environment: 'Science in Life',
    'life-skills': 'Life Skills',
    creativity: 'Creativity',
    music: 'Music',
    'language-english': 'English',
    'language-hindi': 'Hindi',
    'language-telugu': 'Telugu',
    career: 'Career Explorer',
    civics: 'Civics',
    finance: 'Financial Literacy',
    'digital-literacy': 'Digital Literacy',
  };
  return map[domain] ?? domain.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}