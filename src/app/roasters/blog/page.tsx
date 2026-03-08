import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/sanity/lib/client";
import { roasterBlogPostsQuery } from "@/sanity/lib/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Guides, Tips & Insights for Coffee Roasters",
  description:
    "Practical guides, business tips, and industry insights for working coffee roasters. From selling wholesale to growing your brand.",
};

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  category?: string;
  author?: string;
  publishedAt: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
}

const categoryLabels: Record<string, string> = {
  industry: "Industry Insights",
  guides: "How-To Guides",
  business: "Business Tips",
  coffee: "Coffee Knowledge",
};

export default async function RoastersBlogPage() {
  const posts = await client
    .fetch<BlogPost[]>(roasterBlogPostsQuery)
    .catch(() => []);

  return (
    <>
      {/* Hero */}
      <section className="py-20 lg:py-28 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-900 mb-6">
            Roaster <span className="text-accent">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Platform tips, growth strategies, and industry insights to help you
            sell more coffee.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {post.featuredImage && (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={urlFor(post.featuredImage).width(600).height(338).url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    )}
                    <h2 className="mt-2 text-xl font-bold text-neutral-900 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-neutral-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-neutral-500">
                      {post.author && <span>{post.author}</span>}
                      {post.author && post.publishedAt && (
                        <span className="mx-2">&middot;</span>
                      )}
                      {post.publishedAt && (
                        <time>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </time>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-neutral-500">
                No blog posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
