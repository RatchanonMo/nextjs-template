"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ANIMATED_QUERY = "actively posting on Social Media";

export default function AgentSection() {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      i++;
      setDisplayed(ANIMATED_QUERY.slice(0, i));
      if (i >= ANIMATED_QUERY.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-black max-w-7xl mx-auto rounded-4xl">
      <div className="mx-auto flex flex-col items-center text-center gap-8  px-32 py-20">
        <Image
          src="/images/home/agent.svg"
          alt="Salespoint Agent"
          width={2000}
          height={2000}
          className="object-contain"
        />

        {/* "Salespoint Agent" pill */}
        <div className="rounded-full bg-linear-to-r from-primary to-secondary p-[1.5px]">
          <span className="flex rounded-full bg-black px-5 py-2 text-white">
            Salespoint Agent
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl font-bold text-white md:text-4xl max-w-xl">
          You AI personnel that prospect and qualify leads for you.
        </h2>

        {/* Animated search input */}
        <div className="relative w-full max-w-lg">
          {/* Glow */}
          <div className="absolute inset-0 rounded-xl bg-linear-to-r from-primary to-secondary opacity-50 blur-xl" />
          {/* Border shell */}
          <div className="relative rounded-xl bg-linear-to-r from-primary to-secondary p-[1.5px]">
            <div className="rounded-xl bg-white px-6 py-3 text-left">
              <p className="text-sm font-bold md:text-base">
                Clinic in Bangkok that is{" "}
                <span className="font-semibold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {displayed}
                  <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
