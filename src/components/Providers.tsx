"use client";

import { HeroUIProvider } from "@heroui/react";
import { KhaveeProvider } from "@khaveeai/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <KhaveeProvider>{children}</KhaveeProvider>
    </HeroUIProvider>
  );
}
