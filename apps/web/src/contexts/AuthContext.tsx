import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeUserFromToken(token: string | null): AuthUser | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Fetch email from payload if it exists, otherwise check localStorage
    const savedEmail = localStorage.getItem('userEmail') || '';
    return { id: payload.id, email: payload.email || savedEmail, role: payload.role };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialToken = localStorage.getItem('accessToken');
  const [user, setUser] = useState<AuthUser | null>(decodeUserFromToken(initialToken));
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);

  const login = (u: AuthUser, token: string) => {
    setUser(u);
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userEmail', u.email); // Persist the email
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userEmail'); // Clean up the email
    localStorage.removeItem('bhava_web_user');
    localStorage.removeItem('bhava_web_plays');
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
