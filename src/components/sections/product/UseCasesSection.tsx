"use client";

import { useRef, useState } from "react";
import { USE_CASES } from "@/constants/use-cases";

export default function UseCasesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Use Cases
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Desktop 3-col grid */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {USE_CASES.map((uc, i) => (
          <UseCaseCard key={i} {...uc} />
        ))}
      </div>

      {/* Mobile carousel */}
      <MobileCarousel />
    </section>
  );
}

function MobileCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  };

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
    setActiveIndex(index);
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {USE_CASES.map((uc, i) => (
          <div key={i} className="w-[85vw] shrink-0 snap-center">
            <UseCaseCard {...uc} />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {USE_CASES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-200 ${
              i === activeIndex ? "w-6 bg-primary" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function UseCaseCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gray-50 p-6">
      {/* Icon placeholder */}
      <div className="h-12 w-12 rounded-full bg-primary-200" />
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
  );
}
