import { create } from "zustand";

type OrderStore = {
  isModalOpen: boolean;
  selectedItem: string;
  openModal: (item: string) => void;
  closeModal: () => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  isModalOpen: false,
  selectedItem: "",
  openModal: (item) => set({ isModalOpen: true, selectedItem: item }),
  closeModal: () => set({ isModalOpen: false, selectedItem: "" }),
}));
