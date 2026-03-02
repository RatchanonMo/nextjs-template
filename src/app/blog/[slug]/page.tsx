import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/queries/blog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Static params for prerendering
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | SalePoint AI Blog`,
    description: post.excerpt,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      {/* Back link */}
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        ← Back to Blog
      </Link>

      {/* Header */}
      <header className="mt-4 mb-10">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-500"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
          {post.title}
        </h1>

        {/* Excerpt */}
        <p className="mt-4 text-lg leading-relaxed text-gray-500">{post.excerpt}</p>

        {/* Author + date */}
        <div className="mt-6 flex items-center gap-3 border-b border-gray-100 pb-6">
          {/* Avatar placeholder */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{post.author}</p>
            <p className="text-xs text-gray-400">{formatDate(post.published_at)}</p>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.cover_image && (
        <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-2xl">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </div>
      )}

      {/* Body */}
      <article
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Footer divider */}
      <div className="mt-16 border-t border-gray-100 pt-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          ← More articles
        </Link>
      </div>
    </main>
  );
}
