"use client";
import AppLayout from "@/components/AppLayout";
import ChatBox from "@/components/ChatBox";
import MenuBox from "@/components/MenuBox";
import OrderModal from "@/components/OrderModal";
import ToggleMenu from "@/components/ToggleMenu";
import VRMViewer from "@/components/VRMViewer";

export default function Home() {
  return (
    <AppLayout>
      <VRMViewer />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 space-y-5 w-[calc(100%-40px)]">
        <ChatBox />
        <MenuBox />
      </div>
      <ToggleMenu />
      <OrderModal />
    </AppLayout>
  );
}
