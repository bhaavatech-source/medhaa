// src/pages/hooks/useLoginForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

export function useLoginForm(role: 'student' | 'parent' | 'teacher' | 'school' | 'admin', redirectTo: string) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'login', role, email, password })
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      login(data.user, data.token);
      navigate(redirectTo);
    } catch (err) {
      setError('Login error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, error, loading, handleSubmit };
}