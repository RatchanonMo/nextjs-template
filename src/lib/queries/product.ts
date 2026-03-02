import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { assetUrl } from "@/lib/asset-url";
import { PRODUCT_FEATURES } from "@/constants/product-features";
import { USE_CASES } from "@/constants/use-cases";
import type { ProductFeature, UseCase } from "@/types/directus";

export async function getProductFeatures(): Promise<ProductFeature[]> {
  try {
    const data = await directus.request(
      readItems("product_features", { limit: -1, sort: ["id"] })
    );
    if (data?.length)
      return (data as ProductFeature[]).map((f) => ({
        ...f,
        capacities: typeof f.capacities === "string" ? JSON.parse(f.capacities) : f.capacities ?? [],
        image: assetUrl(f.image),
      }));
  } catch {}
  return PRODUCT_FEATURES.map((f, i) => ({ id: i + 1, ...f, image: null }));
}

export async function getUseCases(): Promise<UseCase[]> {
  try {
    const data = await directus.request(
      readItems("use_cases", { limit: -1, sort: ["id"] })
    );
    if (data?.length)
      return (data as UseCase[]).map((u) => ({ ...u, icon: assetUrl(u.icon) }));
  } catch {}
  return USE_CASES.map((u, i) => ({ id: i + 1, ...u, icon: null }));
}
