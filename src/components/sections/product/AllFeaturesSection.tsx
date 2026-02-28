"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { PRODUCT_FEATURES } from "@/constants/product-features";

export default function AllFeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-3xl font-bold text-gray-900">All Features</h2>

      <div className="flex flex-col divide-y divide-gray-100">
        {PRODUCT_FEATURES.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col gap-8 py-10 md:flex-row md:items-center md:gap-12"
          >
            {/* Image placeholder */}
            <div className="aspect-4/3 w-full shrink-0 rounded-2xl bg-gray-200 md:w-80" />

            {/* Content */}
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {feature.capacities.map((cap, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                    {cap}
                  </li>
                ))}
              </ul>

              <Button
                as={Link}
                href={feature.buttonHref}
                variant="flat"
                radius="lg"
                className="mt-2 w-full bg-gray-100 font-medium text-gray-900 hover:bg-gray-200"
              >
                {feature.buttonLabel}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
