"use client";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CUSTOM_PLAN_INCLUDES } from "@/constants/pricing";

export default function CustomPricingSection() {
  return (
    <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Left */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-primary">Custom Pricing</p>
        <h2 className="text-3xl font-bold text-gray-900">Need a custom setup?</h2>
        <p className="text-sm leading-relaxed text-gray-500">
          If your team works across multiple markets, requires higher data volumes, or needs
          a tailored solution, we offer custom pricing built around your use case.
        </p>
        <Button
          as={Link}
          href="#"
          color="primary"
          radius="full"
          size="lg"
          endContent={<ArrowRight size={16} />}
          className="mt-2 w-fit font-semibold"
        >
          Contact Sales
        </Button>
      </div>

      {/* Right */}
      <div className="rounded-3xl border-2 border-default-200 shadow-md p-8">
        <h3 className="text-lg font-bold text-gray-900">Custom plans can include</h3>
        <ul className="mt-4 flex flex-col gap-3">
          {CUSTOM_PLAN_INCLUDES.map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
