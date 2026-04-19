export type LetterTone = "sweet" | "gratitude" | "care" | "memory";

export type DeliveryOption = "today" | "tonight" | "weekend";

export type Recipient = "นนท์" | "รัน";

export type Letter = {
  id: string;
  from: string;
  to: Recipient;
  title: string;
  message: string;
  tone: LetterTone;
  createdAt: string;
  delivery: DeliveryOption;
};

export type Suggestion = {
  id: string;
  title: string;
  starter: string;
  tone: LetterTone;
};
