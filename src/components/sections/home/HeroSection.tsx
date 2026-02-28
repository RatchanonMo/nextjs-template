"use client";

import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-12 md:flex-row md:gap-16 md:py-20">
      {/* Text content */}
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
          Stop guessing
          <br />
          Let <span className="text-primary">AI</span> tell you who to
          <br />
          contact
        </h1>

        <p className="max-w-md text-base text-gray-500">
          Salepoint AI helps you discover real decision-makers and contact
          insights faster, with less guesswork
        </p>

        <Button
          as={Link}
          href="#"
          color="primary"
          radius="full"
          size="lg"
          className="max-w-max font-semibold"
          endContent={<ArrowRight size={16} />}
        >
          Get Started
        </Button>

        <div className="flex flex-wrap items-center justify-between gap-6 md:flex-col md:items-start">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-500">Trusted by</span>
            <div className="flex items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="aspect-4/3 w-full flex-1 rounded-2xl bg-gray-200 md:max-w-lg" />
    </section>
  );
}
