import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { getCurrentUser, logout as logoutFn, type User } from "~/lib/auth";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("complyos_token");
    if (!token) {
      navigate({ to: "/login" });
      return;
    }
    getCurrentUser({ data: { token } }).then((u) => {
      if (!u) {
        localStorage.removeItem("complyos_token");
        navigate({ to: "/login" });
        return;
      }
      setUser(u);
      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    const token = localStorage.getItem("complyos_token");
    if (token) {
      await logoutFn({ data: { token } });
      localStorage.removeItem("complyos_token");
    }
    navigate({ to: "/login" });
  }, [navigate]);

  return { user, loading, handleLogout };
}
