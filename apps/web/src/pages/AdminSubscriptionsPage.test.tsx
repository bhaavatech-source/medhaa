import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminSubscriptionsPage from './AdminSubscriptionsPage';

const mocks = vi.hoisted(() => ({ authFetch: vi.fn() }));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));
vi.mock('../utils/authFetch', () => ({ authFetch: mocks.authFetch }));

describe('Admin free lifetime subscription form', () => {
  beforeEach(() => {
    mocks.authFetch.mockReset();
    mocks.authFetch.mockResolvedValue({ ok: true, json: async () => ({ subscriptions: [] }) });
  });

  it('grants lifetime access to a registered recipient and reloads subscriptions', async () => {
    render(<AdminSubscriptionsPage />);
    await screen.findByText('No subscriptions match this filter.');
    mocks.authFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Free lifetime subscription granted.' }) });
    fireEvent.change(screen.getByLabelText('Give an existing account a free lifetime subscription'), { target: { value: 'recipient@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Grant free lifetime access' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Free lifetime subscription granted.');
    expect(mocks.authFetch).toHaveBeenCalledWith(expect.stringContaining('/subscriptions/grant-free'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recipient@example.com' }),
    });
    await waitFor(() => expect(mocks.authFetch).toHaveBeenCalledTimes(3));
  });

  it('shows the server error rather than claiming a successful grant', async () => {
    render(<AdminSubscriptionsPage />);
    await screen.findByText('No subscriptions match this filter.');
    mocks.authFetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'No account found for this email.' }) });
    fireEvent.change(screen.getByLabelText('Give an existing account a free lifetime subscription'), { target: { value: 'missing@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Grant free lifetime access' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('No account found for this email.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
