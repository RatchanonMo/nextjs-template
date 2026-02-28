import CustomPricingSection from "@/components/sections/pricing/CustomPricingSection";
import FaqsSection from "@/components/sections/shared/FaqsSection";
import PaymentSection from "@/components/sections/pricing/PaymentSection";
import PricingHeroSection from "@/components/sections/pricing/PricingHeroSection";
import PricingStructureSection from "@/components/sections/pricing/PricingStructureSection";
import CtaSection from "@/components/sections/shared/CtaSection";

export const metadata = {
  title: "Pricing — Salespoint",
  description: "Accessible pricing for every team.",
};

export default function PricingPage() {
  return (
    <main>
      <PricingHeroSection />
      <PricingStructureSection />
      <CustomPricingSection />
      <PaymentSection />
      <FaqsSection />
      <CtaSection />
    </main>
  );
}
