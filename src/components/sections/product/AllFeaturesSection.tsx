"use client";
import type { ProductFeature } from "@/types/directus";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function AllFeaturesSection({
  features: rawFeatures,
}: {
  features: ProductFeature[];
}) {
  const features = rawFeatures.map((f) => ({
    ...f,
    capacities:
      typeof f.capacities === "string"
        ? JSON.parse(f.capacities)
        : f.capacities,
  }));

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <h2 className="mb-10 text-4xl font-bold text-gray-900">All Features</h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col gap-8 py-12 md:flex-row md:items-center md:gap-16"
          >
            {/* Screenshot with purple gradient border */}
            {feature.image ? (
              <Image
                src={feature.image}
                alt={feature.name}
                width={700}
                height={320}
              />
            ) : (
              <div className="w-full shrink-0 rounded-2xl bg-gray-200 md:w-96 aspect-4/3" />
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {feature.name}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>

              <ul className="flex flex-col gap-2">
                {(feature.capacities as string[]).map((cap, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                    {cap}
                  </li>
                ))}
              </ul>

              <div className="mt-2 w-fit rounded-xl bg-gradient-to-r from-primary to-secondary p-0.5">
                <Button
                  as={Link}
                  href={feature.buttonHref}
                  variant="light"
                  className="bg-white rounded-xl font-medium text-gray-900 hover:bg-white/90"
                >
                  {feature.buttonLabel}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
