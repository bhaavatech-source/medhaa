import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { AppUsageTelemetry } from './AppUsageTelemetry';

const mockFetch = vi.fn();

function renderTelemetry() {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <AppUsageTelemetry />
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe('AppUsageTelemetry', () => {
  beforeEach(() => {
    localStorage.clear();
    const payload = btoa(JSON.stringify({ id: 'parent-id', email: 'parent@example.com', role: 'parent' }));
    localStorage.setItem('accessToken', `header.${payload}.signature`);
    mockFetch.mockReset().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', mockFetch);
    Object.defineProperty(window, 'Capacitor', {
      configurable: true,
      value: { isNativePlatform: () => true, getPlatform: () => 'android' },
    });
  });

  it('waits for guardian opt-in and sends only the aggregate first-open event', async () => {
    renderTelemetry();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Allow statistics' }));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    const payloads = mockFetch.mock.calls.map(([, request]) => JSON.parse(request.body));
    expect(payloads[0]).toEqual({ type: 'first_open' });
    expect(payloads[1]).toMatchObject({ type: 'foreground_start' });
    expect(payloads[1].liveSessionId).toMatch(/^[0-9a-f-]{36}$/i);
    expect(Object.keys(payloads[1]).sort()).toEqual(['liveSessionId', 'type']);
  });

  it('sends a foreground heartbeat while an opted-in app remains open', async () => {
    vi.useFakeTimers();
    try {
      renderTelemetry();
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByRole('button', { name: 'Allow statistics' }));
      expect(mockFetch).toHaveBeenCalledTimes(2);

      await act(async () => {
        vi.advanceTimersByTime(30_000);
        await Promise.resolve();
      });

      expect(mockFetch).toHaveBeenCalledTimes(3);
      const heartbeat = JSON.parse(mockFetch.mock.calls[2][1].body);
      expect(heartbeat).toMatchObject({ type: 'foreground_heartbeat', seconds: 30 });
      expect(heartbeat.liveSessionId).toBe(JSON.parse(mockFetch.mock.calls[1][1].body).liveSessionId);
    } finally {
      vi.useRealTimers();
    }
  });

  it('sends no telemetry when the guardian declines', () => {
    renderTelemetry();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    document.dispatchEvent(new Event('visibilitychange'));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not prompt or track in a normal browser', () => {
    Object.defineProperty(window, 'Capacitor', {
      configurable: true,
      value: { isNativePlatform: () => false, getPlatform: () => 'web' },
    });
    renderTelemetry();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('does not ask a student account to grant analytics permission', () => {
    const payload = btoa(JSON.stringify({ id: 'student-id', email: 'student@example.com', role: 'student' }));
    localStorage.setItem('accessToken', `header.${payload}.signature`);
    renderTelemetry();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});