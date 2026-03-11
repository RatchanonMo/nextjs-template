"use client";
import { PRICING_PLANS } from "@/constants/pricing";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function PricingPlansSection() {
  return (
    <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {PRICING_PLANS.map((plan) => (
        <div key={plan.name} className="relative flex flex-col">
          {plan.recommended ? (
            /* Gradient border wrapper for recommended card */
            <div className="rounded-2xl bg-gradient-to-b from-primary to-secondary p-[3px]">
              {/* Banner */}
              <div className="rounded-t-2xl bg-primary py-2 text-center text-xs font-semibold text-white">
                recommended plan
              </div>
              {/* Card body */}
              <div className="flex flex-col gap-4 rounded-b-2xl rounded-t-2xl bg-white p-5">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                  <p className="mt-0.5 text-2xl font-bold text-gray-900">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      {plan.currency}{plan.period}
                    </span>
                  </p>
                </div>
                <Button
                  as={Link}
                  href={plan.buttonHref}
                  radius="sm"
                  fullWidth
                  className="bg-gradient-to-r from-primary to-secondary font-semibold text-white"
                >
                  {plan.buttonLabel}
                </Button>
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Regular card */
            <div className="flex flex-1 flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5">
              <div>
                <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                <p className="mt-0.5 text-2xl font-bold text-gray-900">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-500">
                    {plan.currency}{plan.period}
                  </span>
                </p>
              </div>
              {plan.buttonVariant === "bordered" ? (
                <Button
                  as={Link}
                  href={plan.buttonHref}
                  variant="bordered"
                  color="primary"
                  radius="sm"
                  fullWidth
                  className="font-semibold"
                >
                  {plan.buttonLabel}
                </Button>
              ) : (
                <Button
                  as={Link}
                  href={plan.buttonHref}
                  color="primary"
                  radius="sm"
                  fullWidth
                  className="font-semibold"
                >
                  {plan.buttonLabel}
                </Button>
              )}
              <ul className="flex flex-col gap-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
