import CustomPricingSection from "@/components/sections/pricing/CustomPricingSection";
import PricingHeroSection from "@/components/sections/pricing/PricingHeroSection";
import PricingPlansSection from "@/components/sections/pricing/PricingPlansSection";
import UsageCalculatorSection from "@/components/sections/pricing/UsageCalculatorSection";
import FaqsSection from "@/components/sections/shared/FaqsSection";
import { FAQS } from "@/constants/faqs";

export const metadata = {
  title: "Pricing — Salespoint",
  description: "Accessible pricing for every team.",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <PricingHeroSection />
      <PricingPlansSection />
      <CustomPricingSection />
      <UsageCalculatorSection />
      <FaqsSection faqs={FAQS} />
    </main>
  );
}
