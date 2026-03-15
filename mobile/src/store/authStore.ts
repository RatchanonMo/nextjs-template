import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthTokens, User } from "../types/auth";

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  hydrated: boolean;
  setAuth: (payload: { user: User; tokens: AuthTokens }) => void;
  clearAuth: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      hydrated: false,
      setAuth: ({ user, tokens }) => set({ user, tokens }),
      clearAuth: () => set({ user: null, tokens: null }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: "rn-auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ user: state.user, tokens: state.tokens }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export const getAccessToken = (): string | null => {
  return useAuthStore.getState().tokens?.accessToken ?? null;
};
