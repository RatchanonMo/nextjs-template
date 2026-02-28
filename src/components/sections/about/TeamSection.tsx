import { TEAM_MEMBERS } from "@/constants/team";

export default function TeamSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 md:py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-gray-900">
        Our Team
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.id} className="flex flex-col gap-3">
            {/* Photo placeholder */}
            <div className="aspect-square w-full rounded-2xl bg-gray-200" />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-900">{member.name}</span>
              <span className="text-sm text-gray-500">{member.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
