type Store = {
  draftTitle: string;
  draftMessage: string;
  selectedDelivery: import("@/types/letters").DeliveryOption;
  selectedRecipient: import("@/types/letters").Recipient;
  isLoadingLetters: boolean;
  letters: import("@/types/letters").Letter[];
  suggestions: import("@/types/letters").Suggestion[];
  setDraftTitle: (title: string) => void;
  setDraftMessage: (message: string) => void;
  setDelivery: (delivery: import("@/types/letters").DeliveryOption) => void;
  setRecipient: (recipient: import("@/types/letters").Recipient) => void;
  fetchLetters: () => Promise<void>;
  applySuggestion: (id: string) => void;
  sendLetter: () => Promise<void>;
};
