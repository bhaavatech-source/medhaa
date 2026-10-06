import { fireEvent, render, screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { GameCard } from './GameCard';

vi.mock('./UpgradeModal', () => ({ UpgradeModal: () => null }));

beforeAll(() => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
});

const game = {
  slug: 'ready-for-the-world', title: 'Ready for the World', domain: 'life-skills',
  ageLabel: '11-17', skills: ['Self-Discipline'], tier: 'premium-only' as const,
  onPlay: vi.fn(), apiUrl: '/api',
};

describe('GameCard access labels', () => {
  it('shows the actual remaining subscription trial even after the tenth account day', () => {
    const trialEndsAt = new Date(Date.now() + 3 * 86400000).toISOString();
    render(<GameCard {...game} access={{ allowed: true, reason: 'premium subscriber', daysSinceSignup: 12, trialEndsAt }} />);
    expect(screen.getByText('Trial · 3d')).toBeInTheDocument();
  });

  it('does not label a paid subscriber as a trial', () => {
    render(<GameCard {...game} access={{ allowed: true, reason: 'premium subscriber', daysSinceSignup: 2, trialEndsAt: null }} />);
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.queryByText(/Trial/)).not.toBeInTheDocument();
  });

  it('lets an entitled premium subscriber play without an upgrade prompt', () => {
    const onPlay = vi.fn();
    render(<GameCard {...game} onPlay={onPlay} access={{ allowed: true, reason: 'premium subscriber', daysSinceSignup: 20 }} />);

    fireEvent.click(screen.getByRole('button', { name: /Play Now/ }));

    expect(onPlay).toHaveBeenCalledWith(game.slug);
    expect(screen.queryByRole('button', { name: /Upgrade to play/ })).not.toBeInTheDocument();
  });

  it('keeps the access badge below the preview image', () => {
    const { container } = render(<GameCard {...game} access={{ allowed: true, reason: 'premium subscriber', daysSinceSignup: 20 }} />);
    const badge = screen.getByText('Premium');
    expect(container.querySelector('.game-card-banner')).not.toContainElement(badge);
    expect(container.querySelector('.game-card-body')).toContainElement(badge);
  });

  it('loads a desktop preview video only while the card is hovered', () => {
    vi.stubGlobal('matchMedia', () => ({
      matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const { container } = render(<GameCard {...game} access={{ allowed: true, reason: 'premium subscriber', daysSinceSignup: 20 }} />);
    const preview = container.querySelector('.game-card-banner')!;
    expect(preview.querySelector('img')).toBeInTheDocument();
    expect(preview.querySelector('video')).not.toBeInTheDocument();
    fireEvent.mouseEnter(preview);
    expect(preview.querySelector('video')).toHaveAttribute('preload', 'none');
    fireEvent.mouseLeave(preview);
    expect(preview.querySelector('video')).not.toBeInTheDocument();
  });

  it('does not offer a premium upgrade while access is still being checked', () => {
    render(<GameCard {...game} access={{ allowed: false, reason: 'Premium game', daysSinceSignup: 20 }} accessPending />);
    expect(screen.getByRole('button', { name: 'Checking access…' })).toBeDisabled();
    expect(screen.queryByRole('button', { name: /Upgrade/ })).not.toBeInTheDocument();
  });
});