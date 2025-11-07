"use client";

import { HeroUIProvider } from "@heroui/react";
import { OpenAIRealtimeProvider } from "@khaveeai/providers-openai-realtime";
import { KhaveeProvider } from "@khaveeai/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const realtime = new OpenAIRealtimeProvider({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
    instructions:
      "พูดสุภาพและเป็นมิตร ช่วยเหลือผู้ใช้ในทุกคำถาม",
  });
  return (
    <HeroUIProvider>
      <KhaveeProvider
        config={{
          realtime: realtime,
        }}
      >
        {children}
      </KhaveeProvider>
    </HeroUIProvider>
  );
}
