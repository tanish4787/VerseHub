import { useEffect } from "react";
import useAuthStore from "../stores/auth.store";
import { getMe } from "../services/auth.service";

export default function useAuthHydration() {
  const { token, loginSuccess, logout } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    const hydrate = async () => {
      try {
        const res = await getMe();
        loginSuccess({ user: res.data, token });
      } catch (err) {
        console.error(err);
        logout();
      }
    };

    hydrate();
  }, [token]);
}
