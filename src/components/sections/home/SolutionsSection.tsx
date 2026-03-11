"use client";

import { useState } from "react";

const INDUSTRIES = [
  {
    label: "Restaurant",
    query: "Restaurant in Bangkok that is actively posting on Social Media",
  },
  {
    label: "Dentist",
    query: "Dentist clinic in Bangkok that is actively posting on Social Media",
  },
  {
    label: "Marketing Agency",
    query: "Marketing Agency in Bangkok that is actively posting on Social Media",
  },
  {
    label: "OEM",
    query: "OEM manufacturer in Bangkok that is actively posting on Social Media",
  },
];

const HIGHLIGHTED = "actively posting on Social Media";

export default function SolutionsSection() {
  const [active, setActive] = useState(0);

  const query = INDUSTRIES[active].query;
  const highlightIndex = query.indexOf(HIGHLIGHTED);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      {/* Header */}
      <h2 className="text-center text-3xl font-bold text-gray-900 md:text-4xl">
        Solutions for B2B biz in every industry.
      </h2>

      {/* Industry tabs */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {INDUSTRIES.map((industry, i) => (
          i === active ? (
            <div key={industry.label} className="rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
              <button
                onClick={() => setActive(i)}
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-gray-900"
              >
                {industry.label}
              </button>
            </div>
          ) : (
            <button
              key={industry.label}
              onClick={() => setActive(i)}
              className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors"
            >
              {industry.label}
            </button>
          )
        ))}
      </div>

      {/* Query demo cards */}
      <div className="mt-10 mx-auto max-w-2xl flex flex-col gap-3">
        {/* Active card — glowing gradient border */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-40 blur-md" />
          <div className="relative rounded-2xl bg-gradient-to-r from-primary to-secondary p-1">
            <div className="rounded-2xl bg-white px-6 py-5">
              <p className="text-base font-semibold text-gray-800">
                {query.slice(0, highlightIndex)}
                <span className="font-semibold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
                  {HIGHLIGHTED}
                </span>
                {query.slice(highlightIndex + HIGHLIGHTED.length)}
              </p>
            </div>
          </div>
        </div>

        {/* Ghost / faded duplicate for depth */}
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-5 opacity-40">
          <p className="text-base text-gray-400">{query}</p>
        </div>
      </div>
    </section>
  );
}
