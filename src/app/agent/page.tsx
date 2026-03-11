import AgentFeaturesSection from "@/components/sections/agent/AgentFeaturesSection";
import AgentHeroSection from "@/components/sections/agent/AgentHeroSection";

export const metadata = {
  title: "Agent — Salespoint",
  description: "Your AI personnel that prospects and qualifies leads for you.",
};

export default function AgentPage() {
  return (
    <main className="bg-black">
      <div className="mx-auto max-w-4xl">
        <AgentHeroSection />
        <AgentFeaturesSection />
      </div>
    </main>
  );
}
