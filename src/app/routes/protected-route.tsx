import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '@/stores/authSlice';

export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
