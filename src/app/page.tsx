"use client";
import { useStore } from "@/stores/useStore";
import { Button } from "@heroui/react";

export default function Home() {
  const { count, inc } = useStore();
  return (
    <div>
      <Button color="primary" onPress={inc}>Increment</Button>
      <p>Count: {count}</p>
    </div>
  );
}
