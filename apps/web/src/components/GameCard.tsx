import { useEffect, useState } from 'react';
import { UpgradeModal } from './UpgradeModal';

export type GameTier =
  | 'assessment'
  | 'permanent-free'
  | 'rotating-free'
  | 'premium-only';

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
  emoji?: string;
  kind?: 'game' | 'activity';
}

const ROTATING_FREE_UNLOCK_DAY = 31;
const PREMIUM_TRIAL_DAYS = 10;

function displayGameTitle(title: string) {
  return title.replace(/bh[aā]va/gi, 'Medhā');
}

function getBadge(tier: GameTier, access: GameCardProps['access']) {
  if (tier === 'assessment') {
    return { label: 'Assessment', color: 'badge-assessment' };
  }

  if (tier === 'permanent-free') {
    return { label: 'Free', color: 'badge-free' };
  }

  if (tier === 'rotating-free') {
    if (access.allowed) {
      return { label: 'Unlocked', color: 'badge-unlocked' };
    }

    const days = Math.max(
      0,
      ROTATING_FREE_UNLOCK_DAY - access.daysSinceSignup,
    );

    return {
      label: days === 1 ? 'Unlocks tomorrow' : `Unlocks in ${days}d`,
      color: 'badge-locked',
    };
  }

  if (access.allowed && access.daysSinceSignup < PREMIUM_TRIAL_DAYS) {
    return {
      label: `Trial · ${PREMIUM_TRIAL_DAYS - access.daysSinceSignup}d`,
      color: 'badge-trial',
    };
  }

  if (access.allowed) {
    return { label: 'Premium', color: 'badge-premium-active' };
  }

  return { label: 'Premium', color: 'badge-premium-locked' };
}

function GameCardMedia({
  slug,
  emoji,
}: {
  slug: string;
  emoji?: string;
}) {
  const [videoFailed, setVideoFailed] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [pointerPreview, setPointerPreview] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setPointerPreview(media.matches);

    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  if (videoFailed || !pointerPreview) {
    if (imageFailed) {
      return (
        <div className="game-card-emoji" aria-hidden="true">
          <span>{emoji ?? '🎮'}</span>
        </div>
      );
    }

    return (
      <>
        <img
          className="game-card-image"
          src={`/game-previews/${slug}.png`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setImageFailed(true)}
        />
        <span className="game-card-preview-mark" aria-hidden="true">
          <span>↗</span>
          Preview
        </span>
      </>
    );
  }

  return (
    <>
      <video
        className="game-card-video"
        src={`/game-previews/${slug}.mp4`}
        poster={`/game-previews/${slug}.png`}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setVideoFailed(true)}
        aria-hidden="true"
      />
      <span className="game-card-preview-mark" aria-hidden="true">
        <span>▶</span>
        Preview
      </span>
    </>
  );
}

export function GameCard({
  slug,
  title,
  domain,
  ageLabel,
  skills,
  tier,
  access,
  onPlay,
  apiUrl,
  emoji,
  kind = 'game',
}: GameCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const badge = getBadge(tier, access);
  const displayTitle = displayGameTitle(title);
const playLabel = kind === 'activity' ? 'Start Now' : 'Play Now';
  const visibleSkills = skills.slice(0, 3);

  function handleLockedClick() {
    if (tier === 'premium-only') {
      setShowUpgrade(true);
    }
  }

  return (
    <>
      <article
        className={`game-card ${!access.allowed ? 'game-card-locked' : ''}`}
        data-domain={domain}
      >
        <div className="game-card-banner">
          <GameCardMedia slug={slug} emoji={emoji} />

          <span className={`tier-badge ${badge.color}`}>
            {badge.label}
          </span>

          {!access.allowed && (
            <div className="lock-overlay" aria-hidden="true">
              <span className="lock-icon">🔒</span>
              <span className="lock-copy">
                {tier === 'premium-only' ? 'Premium game' : 'Not unlocked yet'}
              </span>
            </div>
          )}
        </div>

        <div className="game-card-body">
          <div className="game-card-domain">
            {domain.replace(/-/g, ' ')}
          </div>

          <h3 className="game-card-title">{displayTitle}</h3>

          <div className="game-card-meta">
            <span>{ageLabel}</span>
            <span className="meta-dot" aria-hidden="true">•</span>
            <span>{kind === 'activity' ? 'Activity' : 'Game'}</span>
          </div>

          {visibleSkills.length > 0 && (
            <div className="game-card-learning">
              <span className="learning-label">Builds</span>
              <div className="game-card-skills">
                {visibleSkills.map((skill) => (
                  <span className="skill-chip" key={skill}>
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="skill-chip skill-chip-more">
                    +{skills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="game-card-footer">
          {access.allowed ? (
            <button
              type="button"
              className="btn-play"
              onClick={() => onPlay(slug)}
            >
              <span>{playLabel}</span>
              <span className="btn-play-arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-locked"
              onClick={handleLockedClick}
              title={access.reason}
              disabled={tier === 'rotating-free'}
            >
              <span>
                {tier === 'rotating-free'
                  ? 'Available later'
                  : 'Upgrade to play'}
              </span>
              <span aria-hidden="true">
                {tier === 'rotating-free' ? '◷' : '→'}
              </span>
            </button>
          )}
        </div>
      </article>

      {showUpgrade && (
        <UpgradeModal
          apiUrl={apiUrl}
          gameTitle={title}
          onClose={() => setShowUpgrade(false)}
        />
      )}
    </>
  );
}
