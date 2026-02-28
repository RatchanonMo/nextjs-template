import AllFeaturesSection from "@/components/sections/product/AllFeaturesSection";
import ProductHeroSection from "@/components/sections/product/ProductHeroSection";
import UseCasesSection from "@/components/sections/product/UseCasesSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import { getProductFeatures, getUseCases } from "@/lib/queries/product";

export const metadata = {
  title: "Product — Salespoint",
  description: "Discover the features and capabilities of Salespoint.",
};

export default async function ProductPage() {
  const [features, useCases] = await Promise.all([
    getProductFeatures(),
    getUseCases(),
  ]);

  return (
    <main>
      <ProductHeroSection />
      <AllFeaturesSection features={features} />
      <UseCasesSection useCases={useCases} />
      <CtaSection />
    </main>
  );
}
