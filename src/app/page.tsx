"use client";
import { Button, Modal, ModalBody, ModalContent } from "@heroui/react";
import { useEffect, useState } from "react";
import LetterComposer from "../components/letters/LetterComposer";
import LetterInbox from "../components/letters/LetterInbox";
import { useStore } from "@/stores/useStore";

export default function Home() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const fetchLetters = useStore((state) => state.fetchLetters);

  useEffect(() => {
    void fetchLetters();
  }, [fetchLetters]);

  return (
    <div className="min-h-dvh bg-primary px-4 pb-8 pt-5 sm:px-6 sm:pt-8">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <LetterInbox recipient="นนท์" />
        <LetterInbox recipient="รัน" />

        <Button
          className="font-semibold bg-primary-400 max-w-max mx-auto mt-10"
          size="lg"
          color="primary"
          radius="full"
          onPress={() => setIsComposerOpen(true)}
        >
          เขียนจดหมาย
        </Button>
      </main>

      <Modal
        backdrop="blur"
        isOpen={isComposerOpen}
        placement="bottom"
        scrollBehavior="inside"
        size="xl"
        onOpenChange={setIsComposerOpen}
        classNames={{
          backdrop: "bg-slate-500/30",
        }}
        hideCloseButton
      >
        <ModalContent className="shadow-none bg-transparent">
          <ModalBody className="p-3">
            <LetterComposer onClose={() => setIsComposerOpen(false)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
