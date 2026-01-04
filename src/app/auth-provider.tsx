import { useEffect } from "react";
import { useAuthStore } from "@/stores/authSlice";
import { refreshToken } from "@/lib/auth";

type Props = {
  children: React.ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshToken();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setLoading]);

  return <>{children}</>;
}
