import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({
  role,
  children,
}: {
  role: string;
  children: JSX.Element;
}) {
  const { accessToken, user } = useAuth();

  if (!accessToken) return <Navigate to={`/login/${role}`} replace />;
  if (user && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
