import CustomPricingSection from "@/components/sections/pricing/CustomPricingSection";
import FaqsSection from "@/components/sections/shared/FaqsSection";
import PaymentSection from "@/components/sections/pricing/PaymentSection";
import PricingHeroSection from "@/components/sections/pricing/PricingHeroSection";
import PricingStructureSection from "@/components/sections/pricing/PricingStructureSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import {
  getCustomPlanIncludes,
  getPaymentMethods,
  getPricingPlans,
} from "@/lib/queries/pricing";
import { getFaqs } from "@/lib/queries/home";

export const metadata = {
  title: "Pricing — Salespoint",
  description: "Accessible pricing for every team.",
};

export default async function PricingPage() {
  const [plans, includes, methods, faqs] = await Promise.all([
    getPricingPlans(),
    getCustomPlanIncludes(),
    getPaymentMethods(),
    getFaqs(),
  ]);

  return (
    <main>
      <PricingHeroSection />
      <PricingStructureSection plans={plans} />
      <CustomPricingSection includes={includes} />
      <PaymentSection methods={methods} />
      <FaqsSection faqs={faqs} />
      <CtaSection />
    </main>
  );
}
