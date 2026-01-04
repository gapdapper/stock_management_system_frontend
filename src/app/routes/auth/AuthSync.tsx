import { getMe } from "@/features/auth/api/me";
import { useAuthStore } from "@/stores/authSlice";
import { useEffect } from "react";

function AuthSync() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearToken = useAuthStore((s) => s.clearToken);

  useEffect(() => {
    if (!token || user) return;

    const syncProfile = async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        clearToken();
      }
    };

    syncProfile();
  }, [token, user, setUser, clearToken]);

  return null;
}

export default AuthSync;
