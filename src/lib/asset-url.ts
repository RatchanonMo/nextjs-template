const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN ?? "";
const tokenParam = DIRECTUS_TOKEN ? `?access_token=${DIRECTUS_TOKEN}` : "";

export function assetUrl(uuid: string | null | undefined): string | null {
  if (!uuid) return null;
  if (uuid.startsWith("http")) return uuid;
  return `${DIRECTUS_URL}/assets/${uuid}${tokenParam}`;
}
