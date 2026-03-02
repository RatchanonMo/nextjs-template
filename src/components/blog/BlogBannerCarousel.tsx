"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@heroui/react";
import Link from "next/link";
import type { BlogBanner } from "@/types/directus";

export default function BlogBannerCarousel({
  banners,
}: {
  banners: BlogBanner[];
}) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");

  const goTo = useCallback(
    (index: number, dir: "left" | "right" = "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 350);
    },
    [animating]
  );

  const next = useCallback(
    () => goTo((current + 1) % banners.length, "right"),
    [goTo, current, banners.length]
  );
  const prev = () =>
    goTo((current - 1 + banners.length) % banners.length, "left");

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, banners.length]);

  if (!banners.length) return null;

  const banner = banners[current];

  const slideClass = animating
    ? direction === "right"
      ? "translate-x-4 opacity-0"
      : "-translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <div className="relative w-full overflow-hidden bg-gray-900">
      {/* Background */}
      <div className="absolute inset-0">
        {banner.image ? (
          <Image
            key={banner.id}
            src={banner.image}
            alt={banner.title}
            fill
            className="object-cover opacity-40"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-primary/5" />
        )}
      </div>

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex min-h-72 max-w-6xl flex-col justify-center gap-4 px-6 py-16 transition-all duration-300 ease-out md:min-h-[400px] md:py-24 ${slideClass}`}
      >
        <h2 className="text-3xl font-bold text-white md:text-5xl">
          {banner.title}
        </h2>
        <p className="max-w-xl text-base text-white/80">{banner.subtitle}</p>
        {banner.link_href && (
          <Button
            as={Link}
            href={banner.link_href}
            color="primary"
            radius="full"
            className="mt-2 w-fit font-semibold"
          >
            {banner.link_label || "Learn more"}
          </Button>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "right" : "left")}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {banners.length > 1 && (
        <>
          <Button
            isIconOnly
            onPress={prev}
            aria-label="Previous slide"
            radius="full"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
          >
            ‹
          </Button>
          <Button
            isIconOnly
            onPress={next}
            aria-label="Next slide"
            radius="full"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/40"
          >
            ›
          </Button>
        </>
      )}
    </div>
  );
}
