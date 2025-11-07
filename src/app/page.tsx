"use client";
import AppLayout from "@/components/AppLayout";
import ChatBox from "@/components/ChatBox";
import VRMViewer from "@/components/VRMViewer";
import { useState } from "react";

export default function Home() {
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
      <ChatBox
        onTypingChange={handleTypingChange}
        onNewMessage={handleNewMessage}
      />
    </AppLayout>
  );
}
