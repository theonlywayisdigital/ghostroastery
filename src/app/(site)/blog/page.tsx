import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "@/sanity/lib/client";
import {
  customerBlogSettingsQuery,
  consumerBlogPostsQuery,
} from "@/sanity/lib/queries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";

export const revalidate = 3600;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getBlogSettings(): Promise<any> {
  try {
    return await client.fetch(customerBlogSettingsQuery);
  } catch {
    return null;
  }
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    return await client.fetch<BlogPost[]>(consumerBlogPostsQuery);
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const cms = await getBlogSettings();
  return {
    title: "Blog",
    description:
      cms?.heroSubheadline ??
      "Tips, guides, and industry insights from the Ghost Roastery team. Learn about coffee branding, white labelling, and more.",
    openGraph: {
      title: "Blog | Ghost Roastery",
      description:
        cms?.heroSubheadline ??
        "Tips, guides, and industry insights from the Ghost Roastery team.",
      url: "https://ghostroastery.com/blog",
    },
  };
}

export default async function BlogPage() {
  const [cms, posts] = await Promise.all([getBlogSettings(), getBlogPosts()]);

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? (
                <>
                  The Ghost Roastery{" "}
                  <span className="text-accent">Blog.</span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              {cms?.heroSubheadline ??
                "Tips, guides, and insights on building a coffee brand, white labelling, and the specialty coffee industry."}
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.latestPostsTitle ?? "Latest posts"} />
        </FadeIn>

        {posts.length > 0 ? (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="group rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-colors bg-neutral-800/50"
                >
                  {post.featuredImage && (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <Image
                        src={urlFor(post.featuredImage)
                          .width(600)
                          .height(338)
                          .url()}
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
                    <h2 className="mt-2 text-xl font-bold text-white group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-neutral-400 text-sm line-clamp-3">
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
          </FadeIn>
        ) : (
          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-neutral-300">
                {cms?.emptyStateMessage ??
                  "We're working on our first articles. Check back soon for guides on launching your coffee brand, marketing tips, and industry news."}
              </p>
            </div>
          </FadeIn>
        )}
      </Section>
    </>
  );
}
