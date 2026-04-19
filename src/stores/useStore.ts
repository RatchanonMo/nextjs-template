import { DeliveryOption, Letter, Recipient, Suggestion } from "@/types/letters";
import { create } from "zustand";

const suggestions: Suggestion[] = [
  {
    id: "s-1",
    title: "สวัสดีตอนเช้า",
    starter: "ตื่นมาแล้วคิดถึงเธอเป็นคนแรก เพราะว่า...",
    tone: "sweet",
  },
  {
    id: "s-2",
    title: "จดหมายขอบคุณ",
    starter: "วันนี้ฉันรู้สึกโชคดีมาก เพราะเธอ...",
    tone: "gratitude",
  },
  {
    id: "s-3",
    title: "เปิดอ่านเวลาที่เหนื่อย",
    starter: "หายใจลึก ๆ นะ ฉันเชื่อในตัวเธอเสมอ เพราะ...",
    tone: "care",
  },
];

const starterLetters: Letter[] = [];

type ApiLetter = {
  id: string;
  from: string;
  to: Recipient;
  title: string;
  message: string;
  tone: Letter["tone"];
  delivery: DeliveryOption;
  createdAt: string;
};

const toDisplayLetter = (letter: ApiLetter): Letter => ({
  ...letter,
  createdAt: new Date(letter.createdAt).toLocaleString("th-TH", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }),
});

export const useStore = create<Store>()((set, get) => ({
  draftTitle: "",
  draftMessage: "",
  selectedDelivery: "today",
  selectedRecipient: "รัน",
  isLoadingLetters: false,
  letters: starterLetters,
  suggestions,
  setDraftTitle: (title) => set({ draftTitle: title }),
  setDraftMessage: (message) => set({ draftMessage: message }),
  setDelivery: (delivery) => set({ selectedDelivery: delivery }),
  setRecipient: (recipient) => set({ selectedRecipient: recipient }),
  fetchLetters: async () => {
    set({ isLoadingLetters: true });

    try {
      const response = await fetch("/api/letters", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("โหลดจดหมายไม่สำเร็จ");
      }

      const payload = (await response.json()) as { letters: ApiLetter[] };
      set({ letters: payload.letters.map(toDisplayLetter) });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoadingLetters: false });
    }
  },
  applySuggestion: (id) => {
    const item = get().suggestions.find((entry) => entry.id === id);

    if (!item) {
      return;
    }

    set({
      draftTitle: item.title,
      draftMessage: item.starter,
    });
  },
  sendLetter: async () => {
    const { draftMessage, draftTitle, selectedDelivery, selectedRecipient } =
      get();

    if (!draftTitle.trim() || !draftMessage.trim()) {
      return;
    }

    try {
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: draftTitle.trim(),
          message: draftMessage.trim(),
          recipient: selectedRecipient,
          delivery: selectedDelivery,
          tone: "sweet",
        }),
      });

      if (!response.ok) {
        throw new Error("ส่งจดหมายไม่สำเร็จ");
      }

      const payload = (await response.json()) as { letter: ApiLetter };

      set((state) => ({
        letters: [toDisplayLetter(payload.letter), ...state.letters],
        draftTitle: "",
        draftMessage: "",
        selectedDelivery: "today",
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));
