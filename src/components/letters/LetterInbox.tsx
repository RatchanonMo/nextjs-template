"use client";

import { useStore } from "@/stores/useStore";
import { Recipient } from "@/types/letters";
import { Avatar, Button, Card, CardBody, Chip } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";

const toneLabelMap: Record<string, string> = {
  sweet: "หวาน",
  gratitude: "ขอบคุณ",
  care: "ห่วงใย",
  memory: "ความทรงจำ",
};

type LetterInboxProps = {
  recipient: Recipient;
};

export default function LetterInbox({ recipient }: LetterInboxProps) {
  const allLetters = useStore((state) => state.letters);
  const letters = useMemo(
    () => allLetters.filter((letter) => letter.to === recipient),
    [allLetters, recipient],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (activeIndex >= letters.length && letters.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, letters.length]);

  const featured = letters[activeIndex];

  const deliveryLabel = useMemo(() => {
    if (!featured) {
      return "วันนี้";
    }

    const labelMap: Record<string, string> = {
      today: "วันนี้",
      tonight: "คืนนี้",
      weekend: "สุดสัปดาห์นี้",
    };

    return labelMap[featured.delivery] ?? featured.delivery;
  }, [featured]);

  const goPrevious = () => {
    setDirection("left");
    setAnimationKey((prev) => prev + 1);
    setActiveIndex((prev) => (prev - 1 + letters.length) % letters.length);
  };

  const goNext = () => {
    setDirection("right");
    setAnimationKey((prev) => prev + 1);
    setActiveIndex((prev) => (prev + 1) % letters.length);
  };

  const tiltClass = recipient === "นนท์" ? "rotate-2" : "-rotate-2";

  return (
    <section className="space-y-3 pb-1">
      <div className="relative mx-auto w-full max-w-xl pt-6">
        <div className="absolute inset-x-4 -bottom-3 h-24 rounded-4xl bg-white/40" />

        {!featured ? (
          <Card className={`relative z-10 ${tiltClass} rounded-[2.8rem] border border-primary-100/70 bg-white px-3 py-2 shadow-xl shadow-primary-900/15 sm:px-5`}>
            <CardBody className="space-y-4 p-8 text-center sm:p-10">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-2xl">💌</div>
              <p className="text-xl font-semibold text-default-700">ยังไม่มีจดหมายถึง {recipient}</p>
              <p className="text-sm text-default-500">เริ่มส่งข้อความแรกเพื่อให้กล่องจดหมายนี้มีชีวิตขึ้นมา</p>
              <Chip className="mx-auto" color="primary" variant="flat">
                รอข้อความใหม่
              </Chip>
            </CardBody>
          </Card>
        ) : (
          <Card className={`relative z-10 overflow-visible ${tiltClass} rounded-[2.8rem] border border-primary-100/70 bg-white px-3 py-2 shadow-xl shadow-primary-900/15 sm:px-5`}>
            <CardBody
              key={animationKey}
              className={`relative overflow-visible space-y-6 p-5 sm:p-7 ${direction === "right" ? "letter-enter-right" : "letter-enter-left"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    className={`h-12 w-12 border-2 border-primary-100 ${featured.from === "นนท์" ? "bg-black" : "bg-primary-400"}`}
                    color="primary"
                    name={featured.from}
                    src="/images/avatar.png"
                  />
                  <div>
                    <p className="text-base font-semibold text-default-800">
                      {featured.from}
                    </p>
                    {/* <p className="text-sm text-default-500">คนพิเศษของฉัน</p> */}
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-2 text-center sm:py-3">
                <p className="text-[2.05rem] font-semibold leading-tight tracking-tight text-default-900 sm:text-[2.8rem]">
                  {featured.message}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <Chip color="primary" size="sm" variant="flat">
                  {toneLabelMap[featured.tone] ?? "จดหมาย"}
                </Chip>
                <Chip color="primary" size="sm" variant="flat">
                  {featured.createdAt}
                </Chip>
                <Chip color="primary" size="sm" variant="flat">
                  {deliveryLabel}
                </Chip>
              </div>

              <Button
                isIconOnly
                aria-label="จดหมายก่อนหน้า"
                className="absolute bottom-3 left-3 z-20 h-11 w-11 rounded-full bg-white text-xl text-default-400 shadow-md sm:-left-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                radius="full"
                variant="flat"
                onPress={goPrevious}
              >
                ←
              </Button>
              <Button
                isIconOnly
                aria-label="จดหมายถัดไป"
                className="absolute bottom-3 right-3 z-20 h-12 w-12 rounded-full bg-primary text-2xl text-primary-foreground shadow-md sm:-right-12 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2"
                radius="full"
                variant="solid"
                onPress={goNext}
              >
                →
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </section>
  );
}
