"use client";

import { useRef, useState } from "react";
import type { Testimonial } from "@/types/directus";

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
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
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Trusted by teams building growth
        </h2>
        <p className="mt-3 text-base text-gray-500">
          Turn your ideal customer profile into real conversations with the
          right decision-makers.
        </p>
      </div>

      {/* Desktop grid */}
      <div className="hidden gap-4 md:grid md:grid-cols-2">
        {testimonials.map((t) => (
          <TestimonialCard key={t.author} {...t} />
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="w-full shrink-0 snap-center"
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {testimonials.map((_, i) => (
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
    </section>
  );
}

function TestimonialCard({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-gray-100 p-8 shadow-sm">
      {/* Quote mark */}
      <span className="text-4xl font-bold leading-none text-primary-200">
        &rdquo;
      </span>
      <p className="text-base leading-relaxed text-gray-700">{quote}</p>
      <p className="text-sm font-semibold text-gray-900">
        <span className="mr-2 text-gray-400">&mdash;</span>
        {author}
      </p>
    </div>
  );
}
