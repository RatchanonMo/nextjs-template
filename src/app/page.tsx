"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import VRMViewer from "@/components/VRMViewer";
import ChatBox from "@/components/ChatBox";

export default function page() {
  const [vrmMessage, setVrmMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleMessage = (message: string) => {
    setVrmMessage(message);
  };

  const handleTypingChange = (typing: boolean) => {
    setIsTyping(typing);
  };

  const handleNewMessage = (message: string) => {
    setVrmMessage(message);
  };

  return (
    <AppLayout>
      <VRMViewer onMessage={handleMessage} isTyping={isTyping} />
      <ChatBox onTypingChange={handleTypingChange} onNewMessage={handleNewMessage} />
    </AppLayout>
  );
}
