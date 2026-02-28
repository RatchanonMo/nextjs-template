"use client";

import { Button } from "@heroui/react";
import type { Step } from "@/types/directus";

export default function HowItWorksSection({ steps }: { steps: Step[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          From Target to Outreach.{" "}
          <span className="text-primary">Salepoint AI</span> Has You Covered
        </h2>
        <p className="mt-3 text-base text-gray-500">
          Turn your ideal customer profile into real conversations with the
          right decision-makers.
        </p>
      </div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col gap-4">
            {/* Image placeholder */}
            <div className="aspect-video w-full rounded-2xl bg-gray-200" />
            {/* Step badge */}
            <Button
              color="primary"
              radius="full"
              size="sm"
              className="w-fit font-semibold"
              disableRipple
            >
              {s.step}
            </Button>
            <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
            <p className="text-sm leading-relaxed text-gray-500">
              {s.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
