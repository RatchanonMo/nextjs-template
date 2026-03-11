import AboutHeroSection from "@/components/sections/about/AboutHeroSection";
import AboutStatsSection from "@/components/sections/about/AboutStatsSection";
import PartnersSection from "@/components/sections/about/PartnersSection";
import QuoteSection from "@/components/sections/about/QuoteSection";
import StayConnectedSection from "@/components/sections/about/StayConnectedSection";
import TeamSection from "@/components/sections/about/TeamSection";
import VisionMissionSection from "@/components/sections/about/VisionMissionSection";
import { TEAM_MEMBERS } from "@/constants/team";
import { PARTNERS } from "@/constants/partners";
import { ABOUT_STATS, SOCIAL_LINKS } from "@/constants/about";

export const metadata = {
  title: "About — Salespoint",
  description: "Learn about the vision, mission, and team behind Salespoint.",
};

export default function AboutPage() {
  const members = TEAM_MEMBERS.map((m) => ({ ...m, photo: null }));
  const partners = PARTNERS;
  const stats = ABOUT_STATS.map((s) => ({ ...s, icon: null }));
  const socialLinks = SOCIAL_LINKS;

  return (
    <main>
      <AboutHeroSection />
      <VisionMissionSection />
      <TeamSection members={members} />
      <PartnersSection partners={partners} />
      <QuoteSection />
      <AboutStatsSection stats={stats} />
      <StayConnectedSection socialLinks={socialLinks} />
    </main>
  );
}
