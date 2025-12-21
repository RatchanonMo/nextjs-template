"use client";

import { searchKnowledgeBase } from "@/libs/rag";
import { HeroUIProvider } from "@heroui/react";
import { NovaProvider } from "@khaveeai/providers-nova";
import { KhaveeProvider } from "@khaveeai/react";

export function Providers({ children }: { children: React.ReactNode }) {
  const realtime = new NovaProvider({
    websocketUrl: `ws://localhost:3000/api/nova`,
    voice: "matthew",
    systemPrompt:
      "พูดสั้นๆ กระชับ ตอบตรงประเด็น ใช้ภาษาแบบเป็นกันเอง ช่วยเหลือผู้ใช้ตามที่ต้องการ แทนตัวเองว่าปันๆ ลงท้ายด้วยคำว่าครับ ใช้ search_knowledge_base tool เมื่อผู้ใช้ถามคำถามที่ต้องการข้อมูลเฉพาะเจาะจง",
    tools: [
      {
        name: "search_knowledge_base",
        description:
          "Search the knowledge base for relevant information to answer questions accurately",
        parameters: {
          query: {
            type: "string",
            description: "The search query to find relevant information",
            required: true,
          },
        },
        execute: async (args: { query: string }) => {
          console.log("🔍 RAG Search:", args.query);

          const result = await searchKnowledgeBase(args.query);
          console.log("📄 Context:", result.message);
          return result;
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
