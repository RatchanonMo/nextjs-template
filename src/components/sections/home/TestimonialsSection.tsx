import Image from "next/image";

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: { quote: string; author: string; avatar?: string }[];
}) {
  return (
    <section className="px-6 pb-32 pt-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          Our users love it!
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="flex flex-col justify-between gap-6 rounded-2xl border-2 border-gray-200 bg-white p-6"
            >
              <p className="text-base leading-relaxed text-gray-800">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author pill — bottom right, gradient border */}
              <div className="flex justify-end">
                <div className="rounded-full bg-gradient-to-r from-primary to-secondary p-0.5">
                  <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5">
                    {t.avatar ? (
                      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md">
                        <Image src={t.avatar} alt={t.author} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-purple-100" />
                    )}
                    <span className="text-sm font-semibold text-gray-900">{t.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
