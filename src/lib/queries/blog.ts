import { readItems } from "@directus/sdk";
import directus from "@/lib/directus";
import { assetUrl } from "@/lib/asset-url";
import { BLOG_BANNERS, BLOG_POSTS } from "@/constants/blog";
import type { BlogBanner, BlogPost } from "@/types/directus";

function normalize(post: BlogPost): BlogPost {
  return {
    ...post,
    tags: typeof post.tags === "string" ? JSON.parse(post.tags) : post.tags ?? [],
    cover_image: assetUrl(post.cover_image),
  };
}

function normalizeBanner(banner: BlogBanner): BlogBanner {
  return { ...banner, image: assetUrl(banner.image) };
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
  } catch (e) {
    console.error("[getBlogPosts]", e);
  }
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
  } catch (e) {
    console.error("[getBlogPost]", e);
  }
  return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getBlogBanners(): Promise<BlogBanner[]> {
  try {
    const data = await directus.request(
      readItems("blog_banners", {
        filter: { status: { _eq: "published" } },
        sort: ["sort"],
        limit: -1,
        fields: ["*"],
      })
    );
    if (data?.length) return (data as BlogBanner[]).map(normalizeBanner);
  } catch (e) {
    console.error("[getBlogBanners]", e);
  }
  return BLOG_BANNERS;
}
