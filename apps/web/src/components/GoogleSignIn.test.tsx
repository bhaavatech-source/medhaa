import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleSignIn } from './GoogleSignIn';

const mocks = vi.hoisted(() => ({
  initialize: vi.fn(),
  renderButton: vi.fn(),
  login: vi.fn(),
  navigate: vi.fn(),
  platform: 'web' as 'web' | 'android',
  socialInitialize: vi.fn(),
  socialLogin: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({ useAuth: () => ({ login: mocks.login }) }));
vi.mock('react-router-dom', () => ({ useNavigate: () => mocks.navigate }));
vi.mock('../utils/apiConfig', () => ({ API_URL: 'http://localhost/api' }));
vi.mock('@capacitor/core', () => ({ Capacitor: {
  isNativePlatform: () => mocks.platform === 'android',
  getPlatform: () => mocks.platform,
} }));
vi.mock('@capgo/capacitor-social-login', () => ({ SocialLogin: {
  initialize: mocks.socialInitialize,
  login: mocks.socialLogin,
} }));

describe('GoogleSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.platform = 'web';
    localStorage.clear();
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', 'test-client');
    Object.defineProperty(window, 'google', {
      configurable: true,
      value: { accounts: { id: { initialize: mocks.initialize, renderButton: mocks.renderButton } } },
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete (window as Window & { google?: unknown }).google;
  });

  it('exchanges a Google credential for the existing Medhā session', async () => {
    const accessToken = `header.${btoa(JSON.stringify({ id: 'student-1', email: 'student@example.com', role: 'student' }))}.signature`;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true, json: async () => ({ accessToken, refreshToken: 'refresh-token' }),
    } as Response);
    render(<GoogleSignIn role="student" redirectTo="/student/preview" />);

    expect(mocks.initialize).toHaveBeenCalledWith(expect.objectContaining({ client_id: 'test-client' }));
    expect(mocks.renderButton).toHaveBeenCalled();
    const callback = mocks.initialize.mock.calls[0][0].callback;
    await act(async () => { callback({ credential: 'google-id-token' }); });

    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/student/preview'));
    expect(fetchMock).toHaveBeenCalledWith('http://localhost/api/auth/google', expect.objectContaining({
      method: 'POST', body: JSON.stringify({ credential: 'google-id-token', role: 'student' }),
    }));
    expect(mocks.login).toHaveBeenCalledWith({ id: 'student-1', email: 'student@example.com', role: 'student' }, accessToken);
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
  });

  it('shows a disabled Google option when no client ID is configured', () => {
    vi.stubEnv('VITE_GOOGLE_CLIENT_ID', '');
    render(<GoogleSignIn role="parent" redirectTo="/parent-dashboard" />);
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
    expect(mocks.initialize).not.toHaveBeenCalled();
  });

  it('shows an unavailable state if the Google SDK cannot load', async () => {
    delete (window as Window & { google?: unknown }).google;
    render(<GoogleSignIn role="student" redirectTo="/student/preview" />);
    const script = document.getElementById('medhaa-google-identity-script');
    expect(script).toBeTruthy();
    act(() => { script!.dispatchEvent(new Event('error')); });
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled();
    expect(document.getElementById('medhaa-google-identity-script')).toBeNull();
  });

  it('uses native Google sign-in on Android and exchanges its ID token with the API', async () => {
    mocks.platform = 'android';
    mocks.socialInitialize.mockResolvedValue(undefined);
    mocks.socialLogin.mockResolvedValue({ result: { idToken: 'native-google-id-token' } });
    const accessToken = `header.${btoa(JSON.stringify({ id: 'parent-1', email: 'parent@example.com', role: 'parent' }))}.signature`;
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true, json: async () => ({ accessToken, refreshToken: 'refresh-token' }),
    } as Response);
    render(<GoogleSignIn role="parent" redirectTo="/parent-dashboard" />);

    await waitFor(() => expect(mocks.socialInitialize).toHaveBeenCalledWith({
      google: { webClientId: 'test-client', mode: 'online' },
    }));
    const button = await screen.findByRole('button', { name: 'Continue with Google' });
    await waitFor(() => expect(button).toBeEnabled());
    expect(mocks.initialize).not.toHaveBeenCalled();

    fireEvent.click(button);
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith('/parent-dashboard'));
    expect(mocks.socialLogin).toHaveBeenCalledWith({
      provider: 'google', options: { scopes: ['email', 'profile'] },
    });
    expect(fetchMock).toHaveBeenCalledWith('http://localhost/api/auth/google', expect.objectContaining({
      body: JSON.stringify({ credential: 'native-google-id-token', role: 'parent' }),
    }));
  });
});