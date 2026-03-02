import AboutHeroSection from "@/components/sections/about/AboutHeroSection";
import AboutStatsSection from "@/components/sections/about/AboutStatsSection";
import PartnersSection from "@/components/sections/about/PartnersSection";
import QuoteSection from "@/components/sections/about/QuoteSection";
import StayConnectedSection from "@/components/sections/about/StayConnectedSection";
import TeamSection from "@/components/sections/about/TeamSection";
import VisionMissionSection from "@/components/sections/about/VisionMissionSection";
import {
  getAboutStats,
  getPartners,
  getSocialLinks,
  getTeamMembers,
} from "@/lib/queries/about";
import { getSiteAssets } from "@/lib/queries/site";

export const metadata = {
  title: "About — Salespoint",
  description: "Learn about the vision, mission, and team behind Salespoint.",
};

export default async function AboutPage() {
  const [members, partners, stats, socialLinks, assets] = await Promise.all([
    getTeamMembers(),
    getPartners(),
    getAboutStats(),
    getSocialLinks(),
    getSiteAssets(),
  ]);

  return (
    <main>
      <AboutHeroSection imageSrc={assets["about_hero"]} />
      <VisionMissionSection />
      <TeamSection members={members} />
      <PartnersSection partners={partners} />
      <QuoteSection />
      <AboutStatsSection stats={stats} />
      <StayConnectedSection socialLinks={socialLinks} />
    </main>
  );
}
