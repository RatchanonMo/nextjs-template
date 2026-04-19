import { DeliveryOption, LetterTone, Recipient } from "@/types/letters";

export type Database = {
  public: {
    Tables: {
      letters: {
        Row: {
          id: string;
          sender: string;
          recipient: Recipient;
          title: string;
          message: string;
          tone: LetterTone;
          delivery: DeliveryOption;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender?: string;
          recipient: Recipient;
          title: string;
          message: string;
          tone?: LetterTone;
          delivery?: DeliveryOption;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender?: string;
          recipient?: Recipient;
          title?: string;
          message?: string;
          tone?: LetterTone;
          delivery?: DeliveryOption;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
