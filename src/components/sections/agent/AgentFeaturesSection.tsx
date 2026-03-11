const FEATURES = [
  {
    id: 1,
    title: "Local Business Intel",
    description:
      "Uncover businesses of every size in any area, from local independents to regional chains.",
    image: "/images/agent/local-business.svg",
    size: "large",
  },
  {
    id: 2,
    title: "Agentic Search Agent",
    description:
      "Our AI agent actively browses and searches the web to qualify prospects that match your criteria.",
    image: "/images/agent/agentic-search.svg",
    size: "large",
  },
  {
    id: 3,
    title: "ICP Enrichment",
    description:
      "Describe your ICP and our AI will prospect, qualify, and enrich matching businesses for you.",
    image: "/images/agent/icp-enrichment.svg",
    size: "small",
  },
  {
    id: 4,
    title: "Agent Skill",
    description:
      "Purpose-built AI skills for sales research, from reading websites to extracting accurate info.",
    image: "/images/footer/agent.svg",
    size: "small",
  },
  {
    id: 5,
    title: "Data Freshness",
    description:
      "Every data point is researched in real time so your prospect list stays accurate and current.",
    image: "/images/agent/data-freshness.svg",
    size: "small",
  },
];

export default function AgentFeaturesSection() {
  return (
    <section className="relative px-6 py-20 overflow-hidden">
      {/* Radial purple glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[600px] w-[700px] rounded-full bg-purple-700 opacity-20 blur-[120px]" />
      </div>
      {/* Header */}
      <h2 className="relative z-10 text-center text-3xl font-bold text-white md:text-4xl">
        AI Agent that tailored for
        <br />
        <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Prospecting
        </span>{" "}
        and{" "}
        <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Enrichment.
        </span>
      </h2>

      {/* Bento grid */}
      <div className="relative z-10 mx-auto mt-12 max-w-4xl flex flex-col gap-4">
        {/* Row 1 — 2 large cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FEATURES.filter((f) => f.size === "large").map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-black p-5 border-2 border-primary"
            >
              <div className="relative h-36 w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2 — 3 small cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.filter((f) => f.size === "small").map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col gap-4 overflow-hidden rounded-2xl bg-black p-5 border-2 border-primary"
            >
              <div className="relative h-24 w-full overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
