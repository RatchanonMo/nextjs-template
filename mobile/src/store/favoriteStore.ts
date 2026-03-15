import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteState {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (id) => get().favorites.includes(id),
      toggle: (id) => {
        const { favorites } = get();
        const next = favorites.includes(id)
          ? favorites.filter((f) => f !== id)
          : [...favorites, id];
        set({ favorites: next });
      },
    }),
    {
      name: "rn-favorites",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ favorites: state.favorites }),
    }
  )
);
