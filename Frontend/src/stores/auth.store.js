import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,

  loginStart: () => set({ loading: true, error: null }),

  loginSuccess: ({ user, token }) => {
    localStorage.setItem("token", token);
    set({
      user,
      token,
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  },

  loginFailure: (error) => set({ loading: false, error }),

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));

export default useAuthStore;
