"use client";
import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ProductHeroSection() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:flex-row md:items-center md:gap-16 md:py-20">
      {/* Text */}
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
          Understand Local Businesses
          <br className="hidden md:block" /> Before You Act
        </h1>
        <p className="max-w-md text-base text-gray-500">
          Salepoint AI provides structured local business intelligence built on
          Google business data and AI analysis.
        </p>
        <Button
          as={Link}
          href="#"
          color="primary"
          radius="full"
          size="lg"
          className="max-w-max font-semibold"
          endContent={<ArrowRight size={16} />}
        >
          Explore the Product
        </Button>
      </div>

      {/* Image placeholder */}
      <div className="aspect-4/3 w-full flex-1 rounded-2xl bg-gray-200 md:max-w-lg" />
    </section>
  );
}
