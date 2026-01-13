import { Button } from "@heroui/react";
import { useRealtime } from "@khaveeai/react";
import { Mic, MicOff } from "lucide-react";

export default function ToggleMenu() {
  const { isConnected, toggleMicrophone, isMicEnabled } = useRealtime();

  return (
    <div className="absolute flex justify-between items-center top-5 left-1/2 -translate-x-1/2 space-y-5 w-[calc(100%-40px)]">
      <div
        className={`size-4 ${isConnected ? "bg-green-500" : "bg-red-500"} rounded-full ring-2 ring-white`}
      />
      <Button
        isIconOnly
        size="lg"
        onPress={toggleMicrophone}
        className={`${isMicEnabled && "bg-white"}`}
        disableRipple
      >
        {isMicEnabled ? <Mic /> : <MicOff />}
      </Button>
    </div>
  );
}
