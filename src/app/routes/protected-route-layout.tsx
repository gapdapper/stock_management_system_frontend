import { refreshToken } from "@/lib/auth";
import { useAuthStore } from "@/stores/authSlice";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router";

function ProtectedRouteLayout() {
  const { isAuthenticated, loading, setLoading } = useAuthStore();
  useEffect(() => {
    (async () => {
      try {
        await refreshToken();
      } catch {
        console.log('No valid session');
      } finally {
        setLoading(false);
      }
    })();
  }, [setLoading]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        {/* <Loader size={60} className="animate-spin" /> */}
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
};

export default ProtectedRouteLayout;