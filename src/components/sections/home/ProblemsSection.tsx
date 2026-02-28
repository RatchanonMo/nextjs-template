import type { Problem } from "@/types/directus";

export default function ProblemsSection({ problems }: { problems: Problem[] }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Problems We Solve</h2>
        <p className="mt-2 text-base text-gray-500">
          Sales is hard, not because of selling but because of finding the right
          people.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-12 gap-y-10">
        {problems.map((problem) => (
          <div key={problem.label} className="flex flex-col gap-3">
            <div className="h-12 w-12 rounded-full bg-primary-100" />
            <p className="text-base font-medium text-gray-800">
              {problem.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
