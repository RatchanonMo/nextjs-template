import Image from "next/image";
import Link from "next/link";
import { getBlogBanners, getBlogPosts } from "@/lib/queries/blog";
import BlogBannerCarousel from "@/components/blog/BlogBannerCarousel";
import BlogFilter from "@/components/blog/BlogFilter";
import type { BlogPost } from "@/types/directus";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | SalePoint AI",
  description: "Insights on sales, prospecting, and AI-powered revenue growth.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group border-b-2 border-gray-100 py-10 last:border-0">
      <Link href={`/blog/${post.slug}`} className="flex items-start justify-between gap-8">
        {/* Text */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className="text-xl font-bold leading-snug text-gray-900 group-hover:text-primary transition-colors md:text-2xl">
            {post.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-primary">✦</span>
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>

        {post.cover_image && (
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg md:h-32 md:w-48">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 128px, 192px"
            />
          </div>
        )}
      </Link>
    </article>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { q, tag } = await searchParams;
  const [allPosts, banners] = await Promise.all([
    getBlogPosts(),
    getBlogBanners(),
  ]);

  // Collect all unique tags for the filter
  const allTags = [...new Set(allPosts.flatMap((p) => p.tags ?? []))];

  // Filter posts server-side
  const posts = allPosts.filter((post) => {
    const matchQ =
      !q ||
      post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(q.toLowerCase());
    const matchTag = !tag || post.tags?.includes(tag);
    return matchQ && matchTag;
  });

  return (
    <main>
      {/* Banner carousel */}
      <BlogBannerCarousel banners={banners} />

      <div id="posts" className="mx-auto max-w-6xl px-6 py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">Blog</h1>
          <p className="mt-3 text-base text-gray-500">
            Insights on sales, prospecting, and AI-powered growth.
          </p>
        </div>

        {/* Filter */}
        <BlogFilter tags={allTags} currentTag={tag} currentQ={q} />

        {/* Results */}
        {posts.length > 0 ? (
          <div>
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-16 text-center text-gray-400">
            No articles found{q ? ` for "${q}"` : ""}{tag ? ` in "${tag}"` : ""}.
          </p>
        )}
      </div>
    </main>
  );
}
