"use client";

import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingHeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
        Accessible Pricing for Every Team
      </h1>
      <p className="mt-3 max-w-xl text-base text-gray-500">
        Choose a pricing plan that fits your workflow, data needs, and growth
        stage. Start small, scale confidently, and only pay for what you use.
      </p>

      {/* Plan cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Self-serve */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-video md:aspect-auto md:min-h-64">
          <div className="absolute bottom-4 left-4">
            <Button
              as={Link}
              href="#pricing-structure"
              variant="flat"
              radius="full"
              size="sm"
              className="bg-white font-semibold text-gray-900 shadow-sm"
              endContent={<ArrowRight size={14} />}
            >
              View Plan
            </Button>
          </div>
        </div>

        {/* Enterprise */}
        <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-video md:aspect-auto md:min-h-64">
          <div className="absolute bottom-4 right-4">
            <Button
              as={Link}
              href="#"
              color="primary"
              radius="full"
              size="sm"
              className="font-semibold"
              endContent={<ArrowRight size={14} />}
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
