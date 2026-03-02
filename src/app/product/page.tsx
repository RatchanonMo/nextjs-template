import AllFeaturesSection from "@/components/sections/product/AllFeaturesSection";
import ProductHeroSection from "@/components/sections/product/ProductHeroSection";
import UseCasesSection from "@/components/sections/product/UseCasesSection";
import CtaSection from "@/components/sections/shared/CtaSection";
import { getProductFeatures, getUseCases } from "@/lib/queries/product";
import { getSiteAssets } from "@/lib/queries/site";

export const metadata = {
  title: "Product — Salespoint",
  description: "Discover the features and capabilities of Salespoint.",
};

export default async function ProductPage() {
  const [features, useCases, assets] = await Promise.all([
    getProductFeatures(),
    getUseCases(),
    getSiteAssets(),
  ]);

  return (
    <main>
      <ProductHeroSection imageSrc={assets["product_hero"]} />
      <AllFeaturesSection features={features} />
      <UseCasesSection useCases={useCases} />
      <CtaSection />
    </main>
  );
}
