import AudiencesSection from "@/components/sections/home/AudiencesSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqsSection from "@/components/sections/shared/FaqsSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HeroSection from "@/components/sections/home/HeroSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";
import ProblemsSection from "@/components/sections/home/ProblemsSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AudiencesSection />
      <TestimonialsSection />
      <FaqsSection />
      <CtaSection />
    </main>
  );
}
