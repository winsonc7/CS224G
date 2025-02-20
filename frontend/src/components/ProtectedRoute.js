import { Navigate } from 'react-router-dom';
import { useAuth } from './Authentication/AuthContext';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You might want to create a proper loading component
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}