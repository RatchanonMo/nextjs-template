import Image from "next/image";
import type { AboutStat } from "@/types/directus";

export default function AboutStatsSection({ stats }: { stats: AboutStat[] }) {
  return (
    <section className="bg-primary px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {stats.map((stat, index) => {
          const isEven = index % 2 === 1;
          return (
            <div
              key={stat.id}
              className={`flex items-center gap-5 ${isEven ? "flex-row-reverse md:flex-row" : "flex-row"}`}
            >
              {stat.icon ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                  <Image src={stat.icon} alt={stat.description} fill className="object-cover" />
                </div>
              ) : (
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-primary-200 opacity-60" />
              )}
              <div className={`flex flex-col gap-1 ${isEven ? "items-end text-right md:items-start md:text-left" : "items-start"}`}>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/70">{stat.description}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
