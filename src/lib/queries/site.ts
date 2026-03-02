import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { assetUrl } from "@/lib/asset-url";
import { SITE_ASSETS } from "@/constants/site";
import type { SiteAsset } from "@/types/directus";

function normalizeAsset(asset: SiteAsset): SiteAsset {
  return { ...asset, image: assetUrl(asset.image) };
}

/**
 * Returns a key→URL map so pages can pass specific images to sections.
 * Falls back to SITE_ASSETS (empty object) if Directus is unavailable.
 */
export async function getSiteAssets(): Promise<Record<string, string>> {
  try {
    const data = await directus.request(
      readItems("site_assets", { limit: -1, fields: ["*"] })
    );
    if (data?.length) {
      const result: Record<string, string> = {};
      for (const raw of data as SiteAsset[]) {
        const a = normalizeAsset(raw);
        if (a.key && a.image) result[a.key] = a.image;
      }
      return result;
    }
  } catch (e) {
    console.error("[getSiteAssets]", e);
  }
  return { ...SITE_ASSETS };
}
