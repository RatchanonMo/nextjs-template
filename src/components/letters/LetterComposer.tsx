"use client";

import { useStore } from "@/stores/useStore";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  Input,
} from "@heroui/react";
import { useMemo } from "react";

const recipients = ["นนท์", "รัน"] as const;

type LetterComposerProps = {
  onClose?: () => void;
};

export default function LetterComposer({ onClose }: LetterComposerProps) {
  const draftMessage = useStore((state) => state.draftMessage);
  const selectedRecipient = useStore((state) => state.selectedRecipient);
  const setDraftTitle = useStore((state) => state.setDraftTitle);
  const setDraftMessage = useStore((state) => state.setDraftMessage);
  const setRecipient = useStore((state) => state.setRecipient);
  const sendLetter = useStore((state) => state.sendLetter);

  const canSend = useMemo(
    () => draftMessage.trim().length > 0,
    [draftMessage],
  );

  return (
    <Card
      className="overflow-hidden rounded-[2.5rem] shadow-[0_10px_0_0_rgba(0,0,0,0.07)]"
      shadow="none"
    >
      <CardBody className="gap-5 p-5 pb-4 sm:p-7 sm:pb-5">
        <div className="flex items-start justify-between">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary-100 text-[1.75rem] sm:h-20 sm:w-20 sm:text-[2rem]">
            💌
          </div>

          <div className="flex items-center gap-2">
            <Button
              isIconOnly
              className="bg-default-100 text-default-500"
              radius="full"
              variant="flat"
              onPress={onClose}
            >
              ✕
            </Button>
          </div>
        </div>

        <div className="pt-1 sm:pt-3">
          <div className="mb-4 flex items-center gap-2">
            <p className="text-sm font-medium text-default-500">ส่งถึง</p>
            {recipients.map((recipient) => (
              <Chip
                key={recipient}
                className="cursor-pointer"
                color="primary"
                variant={selectedRecipient === recipient ? "solid" : "flat"}
                onClick={() => setRecipient(recipient)}
              >
                {recipient}
              </Chip>
            ))}
          </div>

          <Input
            aria-label="ข้อความจดหมาย"
            classNames={{
              base: "max-w-full",
              input:
                "text-xl font-semibold text-default-700 placeholder:text-default-300",
              inputWrapper:
                "border-none bg-transparent px-0 shadow-none data-[hover=true]:bg-transparent group-data-[focus=true]:bg-transparent",
              innerWrapper:
                "before:mr-3 before:block before:h-12 before:w-1 before:rounded-full before:bg-primary-400",
            }}
            color="primary"
            placeholder="พิมพ์ข้อความของคุณ..."
            radius="none"
            value={draftMessage}
            variant="flat"
            onValueChange={setDraftMessage}
          />
        </div>
      </CardBody>

      <CardFooter className="border-t border-default-200/80 bg-default-50/70 px-5 py-4 sm:px-7">
        <div className="flex w-full items-center justify-end gap-3">
          <Button
            className="h-12 min-w-32 px-8 font-semibold"
            color="primary"
            isDisabled={!canSend}
            radius="full"
            onPress={() => {
              const shortTitle = draftMessage.trim().slice(0, 28) || "ข้อความรัก";

              setDraftTitle(shortTitle);
              sendLetter();
              onClose?.();
            }}
          >
            ส่งถึง {selectedRecipient}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
