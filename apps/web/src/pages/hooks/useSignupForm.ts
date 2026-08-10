// src/pages/hooks/useSignupForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

export function useSignupForm(role: 'student' | 'parent' | 'teacher' | 'school', loginRedirect: string) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraData, setExtraData] = useState<Record<string, any>>({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'signup', role, name, email, password, extraData })
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setMessage(data.message || 'Signup received! Awaiting approval.');
      setTimeout(() => navigate(loginRedirect), 3000);
    } catch (err) {
      setError('Signup error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return { name, setName, email, setEmail, password, setPassword, extraData, setExtraData, error, message, loading, handleSubmit };
}