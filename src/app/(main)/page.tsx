import AgentSection from "@/components/sections/home/AgentSection";
import HeroSection from "@/components/sections/home/HeroSection";
import ProblemsSection from "@/components/sections/home/ProblemsSection";
import SolutionsSection from "@/components/sections/home/SolutionsSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import { TESTIMONIALS } from "@/constants/testimonials";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ProblemsSection />
      <AgentSection />
      <SolutionsSection />
      <TestimonialsSection testimonials={TESTIMONIALS} />
    </main>
  );
}
