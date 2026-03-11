import AllFeaturesSection from "@/components/sections/product/AllFeaturesSection";
import ProductHeroSection from "@/components/sections/product/ProductHeroSection";
import { PRODUCT_FEATURES } from "@/constants/product-features";

export const metadata = {
  title: "Product — Salespoint",
  description: "Discover the features and capabilities of Salespoint.",
};

export default function ProductPage() {
  const features = PRODUCT_FEATURES.map((f, i) => ({ id: i + 1, ...f }));

  return (
    <main>
      <ProductHeroSection />
      <AllFeaturesSection features={features} />
    </main>
  );
}
