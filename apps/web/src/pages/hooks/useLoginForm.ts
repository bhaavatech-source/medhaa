import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL =
  import.meta.env.VITE_API_URL || 'https://medhaa-tni1.onrender.com/api';

export function useLoginForm(
  role: string,
  redirectTo: string
) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(
        'Please enter both email and password.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            'Invalid email or password.'
        );
        setLoading(false);
        return;
      }

      const payload = JSON.parse(
        atob(data.accessToken.split('.')[1])
      );

      login(
        {
          id: payload.id,
          email,
          role: payload.role,
        },
        data.accessToken
      );

      localStorage.setItem(
        'refreshToken',
        data.refreshToken
      );

      navigate(redirectTo);
    } catch {
      setError(
        'Login error. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
}
