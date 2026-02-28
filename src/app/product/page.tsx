import AllFeaturesSection from "@/components/sections/product/AllFeaturesSection";
import ProductHeroSection from "@/components/sections/product/ProductHeroSection";
import UseCasesSection from "@/components/sections/product/UseCasesSection";
import CtaSection from "@/components/sections/shared/CtaSection";

export const metadata = {
  title: "Product — Salespoint",
  description: "Discover the features and capabilities of Salespoint.",
};

export default function ProductPage() {
  return (
    <main>
      <ProductHeroSection />
      <AllFeaturesSection />
      <UseCasesSection />
      <CtaSection />
    </main>
  );
}
