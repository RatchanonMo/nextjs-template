import AboutHeroSection from "@/components/sections/about/AboutHeroSection";
import AboutStatsSection from "@/components/sections/about/AboutStatsSection";
import PartnersSection from "@/components/sections/about/PartnersSection";
import QuoteSection from "@/components/sections/about/QuoteSection";
import StayConnectedSection from "@/components/sections/about/StayConnectedSection";
import TeamSection from "@/components/sections/about/TeamSection";
import VisionMissionSection from "@/components/sections/about/VisionMissionSection";

export const metadata = {
  title: "About — Salespoint",
  description: "Learn about the vision, mission, and team behind Salespoint.",
};

export default function AboutPage() {
  return (
    <main>
      <AboutHeroSection />
      <VisionMissionSection />
      <TeamSection />
      <PartnersSection />
      <QuoteSection />
      <AboutStatsSection />
      <StayConnectedSection />
    </main>
  );
}
