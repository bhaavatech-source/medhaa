import { useState } from 'react';
import { UpgradeModal } from './UpgradeModal';

export type GameTier = 'assessment' | 'permanent-free' | 'rotating-free' | 'premium-only';

interface GameCardProps {
  slug: string;
  title: string;
  domain: string;
  ageLabel: string;
  skills: string[];
  tier: GameTier;
  access: { allowed: boolean; reason: string; daysSinceSignup: number };
  onPlay: (slug: string) => void;
  apiUrl: string;
}

const ROTATING_FREE_UNLOCK_DAY = 31;
const PREMIUM_TRIAL_DAYS = 10;




function getBadge(tier: GameTier, access: GameCardProps['access']) {
  if (tier === 'assessment') return { label: 'Always Free', color: 'badge-assessment' };
  if (tier === 'permanent-free') return { label: 'Free', color: 'badge-free' };
  if (tier === 'rotating-free') {
    if (access.allowed) return { label: 'Unlocked', color: 'badge-unlocked' };
    return { label: `Unlocks in ${ROTATING_FREE_UNLOCK_DAY - access.daysSinceSignup}d`, color: 'badge-locked' };
  }
  if (access.allowed && access.daysSinceSignup < PREMIUM_TRIAL_DAYS) {
    return { label: `Trial: ${PREMIUM_TRIAL_DAYS - access.daysSinceSignup}d left`, color: 'badge-trial' };
  }
  if (access.allowed) return { label: 'Premium', color: 'badge-premium-active' };
  return { label: 'Premium Only', color: 'badge-premium-locked' };
}



export function GameCard({ slug, title, domain, ageLabel, skills, tier, access, onPlay, apiUrl }: GameCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const badge = getBadge(tier, access);

  function handleLockedClick() {
    if (tier === 'premium-only') setShowUpgrade(true);
  }

  return (
    <>
      <div className={`game-card ${!access.allowed ? 'game-card-locked' : ''}`} data-domain={domain}>
        <div className="game-card-banner">
          <span className={`tier-badge ${badge.color}`}>{badge.label}</span>
          {!access.allowed && <div className="lock-overlay" aria-hidden="true">🔒</div>}
        </div>

        <div className="game-card-body">
          <h3 className="game-card-title">{title}</h3>
          <p className="game-card-age">{ageLabel}</p>
          <div className="game-card-skills">
            {skills.map((s) => <span className="skill-chip" key={s}>{s}</span>)}
          </div>
        </div>

        <div className="game-card-footer">
          {access.allowed ? (
            <button className="btn-play" onClick={() => onPlay(slug)}>Play Now</button>
          ) : (
            <button className="btn-locked" onClick={handleLockedClick} title={access.reason}>
              {tier === 'rotating-free' ? 'Coming Soon' : 'Upgrade to Play'}
            </button>
          )}
        </div>
      </div>

      {showUpgrade && (
        <UpgradeModal apiUrl={apiUrl} gameTitle={title} onClose={() => setShowUpgrade(false)} />
      )}
    </>
  );
}