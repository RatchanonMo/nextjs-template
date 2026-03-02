import Image from "next/image";

export default function AboutHeroSection({ imageSrc }: { imageSrc?: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
          Lorem ipsum dolor sit amet
          <br />
          consectetur adipiscing elit
        </h1>
        <p className="text-base text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </p>
      </div>

      {/* Hero media */}
      {imageSrc ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl">
          <Image src={imageSrc} alt="About hero" fill className="object-cover" priority />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-3xl bg-gray-200" />
      )}
    </section>
  );
}
