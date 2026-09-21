import { API_URL } from './apiConfig';

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return null;
  }

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.accessToken;
}

export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('accessToken');

  const withAuth = (t: string | null): RequestInit => ({
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });

  let res = await fetch(url, withAuth(token));

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (token) {
      res = await fetch(url, withAuth(token));
    }
  }

  return res;
}
