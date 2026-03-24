import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { client, urlFor } from "@/sanity/lib/client";
import {
  blogPostBySlugQuery,
  consumerBlogSlugsQuery,
  relatedBlogPostsQuery,
} from "@/sanity/lib/queries";

export const revalidate = 3600;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextBlock[];
  category?: string;
  author?: string;
  publishedAt: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  ctaType?: "build" | "wholesale" | "learn";
  ctaUrl?: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  featuredImage?: {
    asset: { _ref: string };
    alt?: string;
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await client
    .fetch<{ slug: string }[]>(consumerBlogSlugsQuery)
    .catch(() => []);
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client
    .fetch<BlogPost>(blogPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) return { title: "Post Not Found" };

  const title = post.seoTitle || post.title;
  const description = (post.seoDescription || post.excerpt || "").slice(0, 155);
  const imageUrl = post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `https://roasteryplatform.com/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `https://roasteryplatform.com/blog/${slug}`,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.featuredImage?.alt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

const categoryLabels: Record<string, string> = {
  industry: "Industry Insights",
  guides: "How-To Guides",
  business: "Business Tips",
  coffee: "Coffee Knowledge",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const portableTextComponents: any = {
  types: {
    image: ({
      value,
    }: {
      value: { asset: { _ref: string }; alt?: string; caption?: string };
    }) => (
      <figure className="my-8">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || ""}
          width={800}
          height={450}
          className="rounded-lg w-full"
        />
        {value.caption && (
          <figcaption className="mt-2 text-center text-sm text-neutral-400">
            {value.caption}
          </figcaption>
        )}
      </figure>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode;
      value?: { href: string };
    }) => {
      const href = value?.href || "#";
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link href={href} className="text-accent hover:underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          {children}
        </a>
      );
    },
  },
};

const ctaConfig: Record<
  string,
  { heading: string; description: string; buttonText: string; defaultUrl: string }
> = {
  build: {
    heading: "Ready to launch your coffee brand?",
    description:
      "Design your bag, upload your label, and place your first order — all in one place.",
    buttonText: "Build Your Brand",
    defaultUrl: "/build",
  },
  wholesale: {
    heading: "Need wholesale coffee for your business?",
    description:
      "Custom-branded or unbranded specialty coffee delivered to your door. Flexible MOQs and competitive pricing.",
    buttonText: "Enquire About Wholesale",
    defaultUrl: "/wholesale",
  },
  learn: {
    heading: "Discover how Ghost Roastery works",
    description:
      "From roasting to fulfilment, we handle everything behind the scenes so you can focus on your brand.",
    buttonText: "Learn More",
    defaultUrl: "/how-it-works",
  },
};

function ArticleCta({
  ctaType,
  ctaUrl,
}: {
  ctaType?: string;
  ctaUrl?: string;
}) {
  const config = ctaConfig[ctaType || "learn"] || ctaConfig.learn;
  const href = ctaUrl || config.defaultUrl;

  return (
    <div className="mt-16 rounded-2xl border border-neutral-700 bg-neutral-800/60 p-8 md:p-10 text-center">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
        {config.heading}
      </h3>
      <p className="text-neutral-300 mb-6 max-w-xl mx-auto">
        {config.description}
      </p>
      <Link
        href={href}
        className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors"
      >
        {config.buttonText}
      </Link>
    </div>
  );
}

function JsonLd({ post }: { post: BlogPost }) {
  const imageUrl = post.featuredImage
    ? urlFor(post.featuredImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    author: {
      "@type": "Person",
      name: post.author || "Ghost Roastery",
    },
    publisher: {
      "@type": "Organization",
      name: "Ghost Roastery",
      logo: {
        "@type": "ImageObject",
        url: "https://roasteryplatform.com/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://roasteryplatform.com/blog/${post.slug.current}`,
    },
    ...(imageUrl && {
      image: {
        "@type": "ImageObject",
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function ConsumerBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await client
    .fetch<BlogPost>(blogPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) notFound();

  const relatedPosts = post.category
    ? await client
        .fetch<RelatedPost[]>(relatedBlogPostsQuery, {
          slug,
          category: post.category,
        })
        .catch(() => [])
    : [];

  return (
    <>
      <JsonLd post={post} />

      <article className="bg-neutral-900">
        {/* Header */}
        <section className="pt-24 md:pt-32 pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="mr-1" size={20} weight="duotone" />
              Back to Blog
            </Link>
            {post.category && (
              <span className="block text-sm font-semibold text-accent uppercase tracking-wider mb-3">
                {categoryLabels[post.category] || post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-neutral-400">
              {post.author && <span>{post.author}</span>}
              {post.author && post.publishedAt && (
                <span className="mx-2">&middot;</span>
              )}
              {post.publishedAt && (
                <time>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          </div>
        </section>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl mb-12">
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden">
              <Image
                src={urlFor(post.featuredImage).width(1200).height(675).url()}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* Body */}
        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-invert prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-neutral">
            {post.body && (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <ArticleCta ctaType={post.ctaType} ctaUrl={post.ctaUrl} />
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pb-20 border-t border-neutral-800 pt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {relatedPosts.map((related) => (
                  <Link
                    key={related._id}
                    href={`/blog/${related.slug.current}`}
                    className="group rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-600 transition-colors bg-neutral-800/50"
                  >
                    {related.featuredImage && (
                      <div className="aspect-[16/9] relative overflow-hidden">
                        <Image
                          src={urlFor(related.featuredImage)
                            .width(400)
                            .height(225)
                            .url()}
                          alt={related.featuredImage.alt || related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="mt-2 text-neutral-400 text-sm line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
