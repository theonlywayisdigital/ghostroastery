import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { client, urlFor } from "@/sanity/lib/client";
import { blogPostBySlugQuery } from "@/sanity/lib/queries";

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
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client
    .fetch<BlogPost>(blogPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
  };
}

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
          <figcaption className="mt-2 text-center text-sm text-neutral-500">
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
    }) => (
      <a
        href={value?.href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        {children}
      </a>
    ),
  },
};

export default async function RoastersBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await client
    .fetch<BlogPost>(blogPostBySlugQuery, { slug })
    .catch(() => null);

  if (!post) notFound();

  const categoryLabels: Record<string, string> = {
    industry: "Industry Insights",
    guides: "How-To Guides",
    business: "Business Tips",
    coffee: "Coffee Knowledge",
  };

  return (
    <article className="bg-white">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="mr-1" size={20} weight="duotone" />
            Back to Blog
          </Link>
          {post.category && (
            <span className="block text-sm font-semibold text-accent uppercase tracking-wider mb-3">
              {categoryLabels[post.category] || post.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center text-sm text-neutral-500">
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
      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-neutral prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
          {post.body && (
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          )}
        </div>
      </section>
    </article>
  );
}
