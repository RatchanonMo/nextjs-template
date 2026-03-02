import Image from "next/image";
import type { Audience } from "@/types/directus";

export default function AudiencesSection({ audiences }: { audiences: Audience[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Built for{" "}
          <span className="text-primary">Modern Revenue Teams</span>
        </h2>
        <p className="mt-3 text-base text-gray-500">
          Salepoint AI is designed for teams who need to find the right people,
          faster and smarter.
        </p>
      </div>

      {/* Cards grid: 3 cols on desktop, first 3 then 2 centered */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {audiences.slice(0, 3).map((audience) => (
          <AudienceCard key={audience.title} {...audience} />
        ))}
        {/* Last 2 centered */}
        <div className="md:col-span-3 grid grid-cols-1 gap-4 md:grid-cols-2 md:mx-auto md:w-2/3">
          {audiences.slice(3).map((audience) => (
            <AudienceCard key={audience.title} {...audience} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AudienceCard({
  title,
  points: rawPoints,
  icon,
}: {
  title: string;
  points: string[] | string;
  icon: string | null;
}) {
  const points: string[] = typeof rawPoints === "string" ? JSON.parse(rawPoints) : rawPoints;
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 shadow-sm">
      {icon ? (
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image src={icon} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary-200" />
      )}
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      <ul className="flex flex-col gap-2">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-400" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
