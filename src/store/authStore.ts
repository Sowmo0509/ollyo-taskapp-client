import { AuthState, User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token: string, user: User) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
