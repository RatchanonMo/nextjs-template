import AudiencesSection from "@/components/sections/home/AudiencesSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import FaqsSection from "@/components/sections/shared/FaqsSection";
import FeaturesSection from "@/components/sections/home/FeaturesSection";
import HeroSection from "@/components/sections/home/HeroSection";
import HowItWorksSection from "@/components/sections/home/HowItWorksSection";
import ProblemsSection from "@/components/sections/home/ProblemsSection";
import TestimonialsSection from "@/components/sections/home/TestimonialsSection";
import {
  getAudiences,
  getFaqs,
  getFeatures,
  getProblems,
  getSteps,
  getTestimonials,
} from "@/lib/queries/home";

export default async function Home() {
  const [problems, features, steps, audiences, testimonials, faqs] =
    await Promise.all([
      getProblems(),
      getFeatures(),
      getSteps(),
      getAudiences(),
      getTestimonials(),
      getFaqs(),
    ]);

  return (
    <main>
      <HeroSection />
      <ProblemsSection problems={problems} />
      <FeaturesSection features={features} />
      <HowItWorksSection steps={steps} />
      <AudiencesSection audiences={audiences} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqsSection faqs={faqs} />
      <CtaSection />
    </main>
  );
}
