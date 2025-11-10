"use client";
import AppLayout from "@/components/AppLayout";
import ChatBox from "@/components/ChatBox";
import VRMViewer from "@/components/VRMViewer";

export default function Home() {
  return (
    <AppLayout>
      <VRMViewer />
      <ChatBox />
    </AppLayout>
  );
}
