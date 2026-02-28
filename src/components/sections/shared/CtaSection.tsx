"use client";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="bg-primary-200 px-6 py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Ready to make sales easier with AI?
        </h2>
        <p className="text-base text-gray-600">
          See how Salespoint AI can help you find better leads and close faster
        </p>
        <Button
          as={Link}
          href="#"
          radius="full"
          size="lg"
          className="bg-gray-900 font-semibold text-white hover:bg-gray-700"
          endContent={<ArrowRight size={16} />}
        >
          Get Started Now
        </Button>
      </div>
    </section>
  );
}
