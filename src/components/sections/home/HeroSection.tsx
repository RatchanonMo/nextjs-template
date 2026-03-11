"use client";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl flex flex-col items-center gap-10 px-6 py-16 text-center md:py-24">
      {/* Text */}
      <div className="flex flex-col items-center gap-5 mb-20">
        <h1 className="text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
          Qualify your prospects
          <br />
          in a few clicks
        </h1>
        <p className="max-w-md text-base text-gray-500">
          Offload all of you prospect qualifying and data researching to our
          Salespoint AI Agent.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            as={Link}
            href="#"
            color="primary"
            radius="md"
            size="lg"
            className="font-semibold bg-linear-to-r from-primary to-secondary"
          >
            Get Started
          </Button>
          {/* Outlined gradient border button */}
          <div className="rounded-xl bg-gradient-to-r from-primary to-secondary p-0.5">
            <Button
              as={Link}
              href="#"
              variant="light"
              size="lg"
              className="bg-white rounded-xl font-semibold text-primary"
            >
              request demo
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard screenshot in purple gradient frame */}
      <div className="w-full">
        <Image
          src="/images/home/hero.svg"
          alt="Salespoint dashboard"
          width={1200}
          height={750}
          className="w-full object-cover object-top"
          priority
        />
      </div>
    </section>
  );
}
