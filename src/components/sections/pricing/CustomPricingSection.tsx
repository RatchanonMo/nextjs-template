"use client";

import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CustomPricingSection({ includes }: { includes: string[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-sm font-semibold text-primary">Custom Pricing</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Need a custom setup?
          </h2>
          <p className="text-base text-gray-500">
            If your team works across multiple markets, requires higher data
            volumes, or needs a tailored solution, we offer custom pricing built
            around your use case.
          </p>
          <Button
            as={Link}
            href="#"
            color="primary"
            radius="full"
            className="max-w-max font-semibold"
            endContent={<ArrowRight size={16} />}
          >
            Contact Sales
          </Button>
        </div>

        {/* Right */}
        <div className="flex-1 rounded-2xl border border-gray-200 p-6">
          <h3 className="mb-4 text-base font-bold text-gray-900">
            Custom plans can include
          </h3>
          <ul className="flex flex-col gap-3">
            {includes.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
