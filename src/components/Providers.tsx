"use client";

import { MODEL_INSTRUCTION } from "@/config/instruction";
import { useOrderStore } from "@/libs/useOrderStore";
import { HeroUIProvider } from "@heroui/react";
import { OpenAIRealtimeProvider } from "@khaveeai/providers-openai-realtime";
import { KhaveeProvider } from "@khaveeai/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const { openModal } = useOrderStore();

  const realtime = new OpenAIRealtimeProvider({
    useProxy: true,
    proxyEndpoint: "/api/negotiate",
    apiKey: process.env.OPENAI_API_KEY || "",
    instructions: MODEL_INSTRUCTION,
    voice: "sage",
    speed: 4,
    tools: [
      {
        name: "confirm_order",
        description:
          "เปิด modal ยืนยันการสั่งซื้อเมื่อลูกค้าตัดสินใจเลือกเมนูแล้ว",
        parameters: {
          item: {
            type: "string",
            description: "ชื่อเมนูที่ลูกค้าเลือก เช่น เอสเพรสโซ, คาปูชิโน่, ลาเต้, อเมริกาโน่",
            required: true,
          },
        },
        execute: async (args: { item: string }) => {
          console.log("📦 Opening order confirmation for:", args.item);
          openModal(args.item);
          return {
            success: true,
            message: `เปิด modal ยืนยันการสั่ง ${args.item} แล้ว`,
          };
        },
      },
    ],
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
