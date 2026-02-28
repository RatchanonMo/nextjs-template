import { createDirectus, rest, staticToken } from "@directus/sdk";
import type { DirectusSchema } from "@/types/directus";

const directus = createDirectus<DirectusSchema>(
  process.env.DIRECTUS_URL ?? "http://localhost:8055"
)
  .with(rest())
  .with(staticToken(process.env.DIRECTUS_TOKEN ?? ""));

export default directus;
