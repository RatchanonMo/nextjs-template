"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const ANIMATED_QUERY = "actively posting on Social Media";

export default function AgentHeroSection() {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(ANIMATED_QUERY.slice(0, i));
      if (i >= ANIMATED_QUERY.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex flex-col items-center gap-8 px-6 py-20 text-center">
      {/* Icon with circuit lines */}
      <div className="relative flex items-center justify-center w-full">
        {/* Circuit SVG */}
        <Image
          src="/images/home/agent.svg"
          alt="Salespoint Agent"
          width={600}
          height={600}
        />
      </div>

      {/* "Salespoint Agent" pill */}
      <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1.5px]">
        <span className="flex rounded-full bg-black px-5 py-1.5 text-sm text-white">
          Salespoint Agent
        </span>
      </div>

      {/* Headline */}
      <h1 className="max-w-xl text-3xl font-bold text-white md:text-4xl">
        You AI personnel that prospect and qualify leads for you.
      </h1>

      {/* Animated search input */}
      <div className="relative w-full max-w-lg">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-40 blur-md" />
        <div className="relative rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1.5px]">
          <div className="rounded-full bg-white px-6 py-3 text-left">
            <p className="text-sm text-gray-800 md:text-base">
              Clinic in Bangkok that is{" "}
              <span className="font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {displayed}
                <span className="inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle" />
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          as={Link}
          href="#"
          color="primary"
          radius="full"
          size="lg"
          className="font-semibold"
        >
          Get Started
        </Button>
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[1.5px]">
          <Button
            as={Link}
            href="#"
            variant="light"
            radius="full"
            size="lg"
            className="bg-black font-semibold text-white hover:bg-black/80"
          >
            request demo
          </Button>
        </div>
      </div>
    </section>
  );
}
