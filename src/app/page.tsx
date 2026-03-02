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
import { getSiteAssets } from "@/lib/queries/site";

export default async function Home() {
  const [problems, features, steps, audiences, testimonials, faqs, assets] =
    await Promise.all([
      getProblems(),
      getFeatures(),
      getSteps(),
      getAudiences(),
      getTestimonials(),
      getFaqs(),
      getSiteAssets(),
    ]);

  return (
    <main>
      <HeroSection
        imageSrc={assets["home_hero"]}
        avatarSrcs={
          ["hero_avatar_1", "hero_avatar_2", "hero_avatar_3", "hero_avatar_4", "hero_avatar_5"]
            .map((k) => assets[k])
            .filter((v): v is string => Boolean(v))
        }
      />
      <ProblemsSection problems={problems} />
      <FeaturesSection features={features} />
      <HowItWorksSection
        steps={steps}
        stepImages={[assets["home_step_1"], assets["home_step_2"], assets["home_step_3"]]}
      />
      <AudiencesSection audiences={audiences} />
      <TestimonialsSection testimonials={testimonials} />
      <FaqsSection faqs={faqs} />
      <CtaSection />
    </main>
  );
}
