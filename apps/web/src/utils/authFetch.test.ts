import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authFetch } from './authFetch';

describe('authFetch', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('attaches the stored access token as a Bearer header', async () => {
    localStorage.setItem('accessToken', 'token-123');
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await authFetch('/api/games/history');

    const [, options] = fetchMock.mock.calls[0];
    expect((options.headers as Record<string, string>).Authorization).toBe('Bearer token-123');
  });

  it('retries once with a refreshed token after a 401', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.setItem('refreshToken', 'refresh-token');

    const fetchMock = vi
      .fn()
      // first call: the original request, which is unauthorized
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      // second call: the refresh request, returns a new access token
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'new-token' }), { status: 200 }))
      // third call: the retried original request, now succeeds
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    const res = await authFetch('/api/games/history');

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(res.status).toBe(200);
    expect(localStorage.getItem('accessToken')).toBe('new-token');
  });

  it('clears stored tokens when the refresh request itself fails', async () => {
    localStorage.setItem('accessToken', 'expired-token');
    localStorage.setItem('refreshToken', 'bad-refresh-token');

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);

    await authFetch('/api/games/history');

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
  });
});
