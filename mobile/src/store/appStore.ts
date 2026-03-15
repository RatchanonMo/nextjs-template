import { create } from "zustand";

interface AppState {
  isOnline: boolean;
  pendingQueueCount: number;
  queueHydrated: boolean;
  setOnline: (isOnline: boolean) => void;
  setPendingQueueCount: (count: number) => void;
  setQueueHydrated: (hydrated: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOnline: true,
  pendingQueueCount: 0,
  queueHydrated: false,
  setOnline: (isOnline) => set({ isOnline }),
  setPendingQueueCount: (pendingQueueCount) => set({ pendingQueueCount }),
  setQueueHydrated: (queueHydrated) => set({ queueHydrated }),
}));
