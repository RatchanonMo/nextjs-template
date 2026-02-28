import { FEATURES } from "@/constants/features";

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          What <span className="text-primary">Salepoint AI</span> Does
        </h2>
        <p className="mt-3 text-base text-gray-500">
          One platform to make sales prospecting smarter with AI.
        </p>
      </div>

      {/* Feature cards */}
      <div className="flex flex-col gap-4">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className={`${feature.bg} rounded-2xl px-8 py-8`}
          >
            <h3 className={`text-xl font-bold ${feature.text}`}>
              {feature.title}
            </h3>
            <p
              className={`mt-3 max-w-sm text-sm leading-relaxed ${feature.subText}`}
            >
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Tagline */}
      <p className="mt-16 text-center text-xl text-gray-700 md:text-2xl">
        Built from real sales{" "}
        <span className="font-bold text-primary">Experience</span>, not theory.
      </p>
    </section>
  );
}
