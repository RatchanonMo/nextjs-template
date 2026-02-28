import { PARTNERS } from "@/constants/partners";

export default function PartnersSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-16">
        {/* Left text */}
        <div className="flex flex-col gap-4 md:max-w-xs">
          <h2 className="text-2xl font-bold text-gray-900">Partners</h2>
          <p className="leading-relaxed text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        {/* Right logo grid */}
        <div className="grid flex-1 grid-cols-4 gap-3">
          {PARTNERS.map((partner) => (
            <div
              key={partner.id}
              className="h-12 rounded-lg bg-gray-200"
              aria-label={partner.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
