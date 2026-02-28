import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { BLOG_POSTS } from "@/constants/blog";
import type { BlogPost } from "@/types/directus";

function normalize(post: BlogPost): BlogPost {
  const DIRECTUS_URL = process.env.DIRECTUS_URL ?? "http://localhost:8055";
  const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN ?? "";
  const cover = post.cover_image;
  const tokenParam = DIRECTUS_TOKEN ? `?access_token=${DIRECTUS_TOKEN}` : "";
  return {
    ...post,
    tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags ?? [],
    cover_image:
      cover && !cover.startsWith("http")
        ? `${DIRECTUS_URL}/assets/${cover}${tokenParam}`
        : cover ?? null,
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await directus.request(
      readItems("blog_posts", {
        limit: -1,
        sort: ["-published_at"],
        fields: ["*"],
      })
    );
    if (data?.length) return (data as BlogPost[]).map(normalize);
  } catch {}
  return BLOG_POSTS;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await directus.request(
      readItems("blog_posts", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: ["*"],
      })
    );
    if (data?.length) return normalize(data[0] as BlogPost);
  } catch {}
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}
