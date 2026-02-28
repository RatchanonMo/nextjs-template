"use client";

import { Button } from "@heroui/react";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { PRICING_PLANS } from "@/constants/pricing";

export default function PricingStructureSection() {
  return (
    <section id="pricing-structure" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Pricing Structure
        </h2>
        <p className="mt-2 text-base text-gray-500">Pricing Structure</p>
      </div>

      {/* Desktop: 3 cards */}
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.name}
            className="flex flex-col gap-4 rounded-2xl border border-gray-200 p-6"
          >
            <div>
              <p className="text-base font-semibold text-gray-900">
                {plan.name}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {plan.price}
                <span className="text-base font-normal text-gray-500">
                  {plan.currency}
                  {plan.period}
                </span>
              </p>
            </div>

            <Button
              as={Link}
              href={plan.buttonHref}
              color="primary"
              variant={plan.buttonVariant}
              radius="lg"
              className="w-full font-semibold"
            >
              {plan.buttonLabel}
            </Button>

            <ul className="flex flex-col gap-2">
              {plan.benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  {b.included ? (
                    <Check size={14} className="shrink-0 text-green-500" />
                  ) : (
                    <X size={14} className="shrink-0 text-red-400" />
                  )}
                  {b.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Mobile: comparison table */}
      <div className="overflow-x-auto md:hidden">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="py-3 text-left font-semibold text-gray-700">
                Benefits
              </th>
              {PRICING_PLANS.map((plan) => (
                <th key={plan.name} className="px-2 py-3 text-center">
                  <p className="font-bold text-primary">{plan.name}</p>
                  <p className="text-xs font-normal text-gray-500">
                    {plan.price}
                    {plan.currency}
                    {plan.period}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICING_PLANS[0].benefits.map((_, rowIdx) => (
              <tr key={rowIdx} className="border-t border-gray-100">
                <td className="py-3 text-gray-700">
                  {PRICING_PLANS[0].benefits[rowIdx].label}
                </td>
                {PRICING_PLANS.map((plan) => (
                  <td key={plan.name} className="px-2 py-3 text-center">
                    {plan.benefits[rowIdx].included ? (
                      <Check size={14} className="mx-auto text-green-500" />
                    ) : (
                      <X size={14} className="mx-auto text-red-400" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-gray-100">
              <td />
              {PRICING_PLANS.map((plan) => (
                <td key={plan.name} className="px-2 py-4 text-center">
                  <Button
                    as={Link}
                    href={plan.buttonHref}
                    color="primary"
                    variant={plan.buttonVariant}
                    radius="lg"
                    size="sm"
                    className="w-full font-semibold"
                  >
                    {plan.buttonLabel}
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
