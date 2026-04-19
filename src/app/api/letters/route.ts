import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { DeliveryOption, LetterTone, Recipient } from "@/types/letters";
import { NextResponse } from "next/server";

type DbLetter = {
  id: string;
  sender: string;
  recipient: Recipient;
  title: string;
  message: string;
  tone: LetterTone;
  delivery: DeliveryOption;
  created_at: string;
};

type NewDbLetter = {
  sender: string;
  recipient: Recipient;
  title: string;
  message: string;
  tone: LetterTone;
  delivery: DeliveryOption;
};

const RECIPIENTS = new Set<Recipient>(["นนท์", "รัน"]);
const DELIVERIES = new Set<DeliveryOption>(["today", "tonight", "weekend"]);
const TONES = new Set<LetterTone>(["sweet", "gratitude", "care", "memory"]);

const resolveSender = (recipient: Recipient) =>
  recipient === "นนท์" ? "รัน" : "นนท์";

const normalizeSender = (sender: string | null | undefined, recipient: Recipient) => {
  if (sender === "นนท์" || sender === "รัน") {
    return sender;
  }

  return resolveSender(recipient);
};

const mapDbLetter = (row: DbLetter) => ({
  id: row.id,
  from: normalizeSender(row.sender, row.recipient),
  to: RECIPIENTS.has(row.recipient) ? row.recipient : "รัน",
  title: row.title,
  message: row.message,
  tone: TONES.has(row.tone) ? row.tone : "sweet",
  delivery: DELIVERIES.has(row.delivery) ? row.delivery : "today",
  createdAt: row.created_at,
});

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("letters")
      .select("id, sender, recipient, title, message, tone, delivery, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      letters: (data ?? []).map((row) => mapDbLetter(row)),
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      recipient?: Recipient;
      title?: string;
      message?: string;
      tone?: LetterTone;
      delivery?: DeliveryOption;
    };

    const recipient = body.recipient;
    const title = body.title?.trim();
    const message = body.message?.trim();
    const tone = body.tone;
    const delivery = body.delivery;

    if (!recipient || !RECIPIENTS.has(recipient) || !title || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const normalizedTone: LetterTone = TONES.has(tone as LetterTone)
      ? (tone as LetterTone)
      : "sweet";
    const normalizedDelivery: DeliveryOption = DELIVERIES.has(
      delivery as DeliveryOption,
    )
      ? (delivery as DeliveryOption)
      : "today";
    const newLetter: NewDbLetter = {
      sender: resolveSender(recipient),
      recipient,
      title,
      message,
      tone: normalizedTone,
      delivery: normalizedDelivery,
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("letters")
      .insert(newLetter)
      .select("id, sender, recipient, title, message, tone, delivery, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ letter: mapDbLetter(data) });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
