import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import medhaaIcon from '../assets/logo/medhaa-icon.svg';

const API_URL = 'http://localhost:4000/api';

export function useSignupForm(role: string, redirectTo: string) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraData, setExtraData] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName: name,
          role: role.toUpperCase(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = typeof data.error === 'string'
          ? data.error
          : 'Please check your details and try again.';
        setError(msg);
        setLoading(false);
        return;
      }

      const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
      login({ id: payload.id, email, role: payload.role }, data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      setMessage('Account created successfully! Redirecting...');
      setTimeout(() => navigate(redirectTo), 1500);
    } catch (err) {
      setError('Signup error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return {
    name, setName, email, setEmail, password, setPassword,
    extraData, setExtraData, error, message, loading, handleSubmit,
  };
}