"use client";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function ProductHeroSection() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:gap-12 md:py-64">
      {/* Text */}
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl max-w-2xl">
          Research done.
          Leads enriched.
          Pipeline ready.
        </h1>
        <p className="max-w-sm text-base text-gray-500">
          Offload all your prospecting work to Salespoint AI Agent and just
          reach out and close the deals.
        </p>
        <Button
          as={Link}
          href="#"
          color="primary"
          radius="lg"
          size="lg"
          className="w-fit font-semibold bg-linear-to-r from-primary to-secondary"
        >
          Get Started
        </Button>
      </div>

      {/* Hero screenshot with purple glow border */}
      <div className="absolute right-0 flex-1 ">
        <Image
          src="/images/product/hero.svg"
          alt="Salespoint dashboard"
          width={700}
          height={720}
          priority
        />
      </div>
    </section>
  );
}
