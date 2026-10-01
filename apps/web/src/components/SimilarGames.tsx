import { getCatalogEntry } from '../data/gamesCatalog';
import { GameCard, GameTier } from './GameCard';
import { getSimilarGames } from '../services/gameExposure';
import '../styles/similar-games.css';

export interface SimilarGame {
  slug: string;
  title: string;
  domain: string;
  ageLabel: string;
  skills: string[];
  tier: GameTier;
  access: { allowed: boolean; reason: string; daysSinceSignup: number };
  kind?: 'game' | 'activity';
}

interface SimilarGamesProps {
  games: SimilarGame[];
  currentSlug: string;
  onPlay: (slug: string) => void;
  apiUrl: string;
  excludeSlugs?: Set<string>;
  accessPending?: boolean;
}

export function SimilarGames({ games, currentSlug, onPlay, apiUrl, excludeSlugs, accessPending }: SimilarGamesProps) {
  const current = games.find((game) => game.slug === currentSlug);
  if (!current) return null;

  const suggestions = getSimilarGames(games.filter((game) => !excludeSlugs?.has(game.slug)), currentSlug, current.domain);

  if (!suggestions.length) return null;

  return (
    <section className="similar-games" aria-labelledby="similar-games-title">
      <div className="similar-games__heading">
        <div>
          <span className="similar-games__kicker">KEEP EXPLORING</span>
          <h2 id="similar-games-title">More like {current.title}</h2>
          <p>Try another {current.kind ?? 'game'} that practises the same kind of thinking.</p>
        </div>
      </div>
      <div className="games-grid similar-games__grid">
        {suggestions.map((game) => {
          const catalog = getCatalogEntry(game.slug);
          return (
            <GameCard
              key={game.slug}
              {...game}
              emoji={catalog?.emoji}
              kind={game.kind ?? catalog?.kind ?? 'game'}
              onPlay={onPlay}
              apiUrl={apiUrl}
              accessPending={accessPending}
            />
          );
        })}
      </div>
    </section>
  );
}