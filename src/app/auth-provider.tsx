import { useEffect } from "react";
import { useAuthStore } from "@/stores/authSlice";
import { refreshToken, setProfile } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await refreshToken();
        if (token) {
          await setProfile();
        }
      } finally {
        console.log("Auth initialization complete");
        setLoading(false);
      }
    };

    initAuth();
  }, [setLoading]);

  return <>{children}</>;
}
