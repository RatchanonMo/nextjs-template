import Image from "next/image";

const FEATURES = [
  {
    title: "Prospecting",
    description: "Finding business in targeted industry from each channel 1 by 1",
    image: "/images/home/prospecting.png",
  },
  {
    title: "Qualifying",
    description: "Mining for data on the internet that might signify the qualification.",
    image: "/images/home/qualifying.png",
  },
  {
    title: "Preparing",
    description: "Preparing tons of behavioral information for a better outreach.",
    image: "/images/home/preparing.png",
  },
];

export default function ProblemsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      {/* Stat headline */}
      <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
        Your sales team spends{" "}
        <span className="text-secondary">40% of</span>
        <br />
        <span className="text-primary">their time</span> researching, not closing.
      </h2>

      {/* Feature cards */}
      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col items-center gap-4 text-center">
            <div className="relative size-64">
              <Image src={f.image} alt={f.title} fill className="object-contain" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{f.title}</h3>
            <p className="text-lg">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
