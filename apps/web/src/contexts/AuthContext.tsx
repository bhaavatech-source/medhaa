import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface ParentReturnSession {
  user: AuthUser;
  accessToken: string;
  childName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  parentReturnSession: ParentReturnSession | null;
  enterAsChild: (childUser: AuthUser, childToken: string, childName: string) => void;
  exitChildSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const PARENT_RETURN_KEY = 'medhaa_parent_return_session';

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

function readParentReturnSession(): ParentReturnSession | null {
  try {
    const raw = sessionStorage.getItem(PARENT_RETURN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initialToken = localStorage.getItem('accessToken');
  const [user, setUser] = useState<AuthUser | null>(decodeUserFromToken(initialToken));
  const [accessToken, setAccessToken] = useState<string | null>(initialToken);
  const [parentReturnSession, setParentReturnSession] = useState<ParentReturnSession | null>(readParentReturnSession);

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
    sessionStorage.removeItem(PARENT_RETURN_KEY);
    setParentReturnSession(null);
  };

  // Parent starts a supervised "play as child" session: stash the parent's
  // own token so the exit banner can restore it, then switch to the child.
  const enterAsChild = (childUser: AuthUser, childToken: string, childName: string) => {
    if (user && accessToken && user.role === 'parent') {
      const returnSession: ParentReturnSession = { user, accessToken, childName };
      sessionStorage.setItem(PARENT_RETURN_KEY, JSON.stringify(returnSession));
      setParentReturnSession(returnSession);
    }
    login(childUser, childToken);
  };

  const exitChildSession = () => {
    const stored = readParentReturnSession();
    if (stored) {
      login(stored.user, stored.accessToken);
    }
    sessionStorage.removeItem(PARENT_RETURN_KEY);
    setParentReturnSession(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, parentReturnSession, enterAsChild, exitChildSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
