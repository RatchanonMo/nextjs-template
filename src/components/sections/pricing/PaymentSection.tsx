"use client";

import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PaymentMethod } from "@/types/directus";

export default function PaymentSection({ methods }: { methods: PaymentMethod[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
        {/* Left */}
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Flexible payment and billing options
          </h2>
          <p className="text-base text-gray-500">
            We support multiple payment methods to fit how your business
            operates.
          </p>
          <p className="break-all text-sm text-gray-400">
            wordplaceforsupportwordplaceforsupportwordplaceforsupportwordplaceforsupportwordplaceforsupportwordplaceforsupportwordplaceforsupport
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-1 flex-col gap-6">
          {/* Payment method icons */}
          <div className="flex gap-3">
            {methods.map((m) => (
              m.icon ? (
                <div key={m.id} className="relative h-10 w-16 overflow-hidden rounded-md">
                  <Image src={m.icon} alt={m.method} fill className="object-contain" />
                </div>
              ) : (
                <div key={m.id} className="h-10 w-16 rounded-md bg-gray-200" />
              )
            ))}
          </div>

          {/* Payment method list */}
          <ul className="flex flex-col gap-2">
            {methods.map((m) => (
              <li key={m.id} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="h-2 w-2 shrink-0 rounded-full bg-green-400" />
                {m.method}
              </li>
            ))}
          </ul>

          <Button
            as={Link}
            href="#"
            color="primary"
            radius="full"
            className="max-w-max font-semibold"
            endContent={<ArrowRight size={16} />}
          >
            Contact Support 24/7
          </Button>
        </div>
      </div>
    </section>
  );
}
