import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsPage } from './SettingsPage';

const mocks = vi.hoisted(() => ({ authFetch: vi.fn() }));
vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ user: { id: 'student-1', role: 'student', email: 'student@example.com' }, logout: vi.fn() }) }));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));
vi.mock('../utils/authFetch', () => ({ authFetch: mocks.authFetch }));

describe('Settings subscription details', () => {
  beforeEach(() => mocks.authFetch.mockReset());

  it('shows paid subscription details for a student', async () => {
    mocks.authFetch.mockResolvedValue({ ok: true, json: async () => ({ subscription: {
      plan: 'MONTHLY_1', status: 'ACTIVE', amount: 14900,
      currentPeriodEnd: '2026-11-01T00:00:00Z', trialEndsAt: null, transactionRef: '1235632456',
    } }) });
    render(<SettingsPage />);
    expect(await screen.findByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('₹149')).toBeInTheDocument();
    expect(screen.getByText('1235632456')).toBeInTheDocument();
    expect(mocks.authFetch).toHaveBeenCalledWith(expect.stringContaining('/subscriptions/me'));
  });

  it('does not claim the account is free when the subscription request fails', async () => {
    mocks.authFetch.mockResolvedValue({ ok: false, status: 503 });
    render(<SettingsPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load subscription details');
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    expect(screen.queryByText('Free Tier')).not.toBeInTheDocument();
  });
});