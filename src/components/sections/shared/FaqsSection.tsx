"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import type { Faq } from "@/types/directus";

export default function FaqsSection({ faqs }: { faqs: Faq[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-8 text-3xl font-bold text-gray-900 md:text-4xl">
        FAQs
      </h2>

      <Accordion
        variant="light"
        itemClasses={{
          base: "border-b border-gray-200 py-1",
          title: "text-base font-semibold text-gray-900",
          content: "text-sm text-gray-600 pb-4",
          trigger: "py-4",
          indicator: "text-gray-500",
        }}
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            title={faq.question}
            aria-label={faq.question}
          >
            {faq.answer}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
