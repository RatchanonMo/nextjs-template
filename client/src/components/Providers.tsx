"use client";

import { HeroUIProvider } from "@heroui/react";
import AuthGate from "@/components/AuthGate";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider disableRipple>
      <AuthGate>{children}</AuthGate>
    </HeroUIProvider>
  );
}
