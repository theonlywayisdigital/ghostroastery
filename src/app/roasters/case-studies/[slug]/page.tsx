import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { PortableText, type PortableTextBlock } from "@portabletext/react";
import { client, urlFor } from "@/sanity/lib/client";
import { caseStudyBySlugQuery } from "@/sanity/lib/queries";

interface CaseStudy {
  _id: string;
  brandName: string;
  slug: { current: string };
  summary: string;
  fullStory?: PortableTextBlock[];
  logo?: {
    asset: { _ref: string };
  };
  images?: Array<{
    asset: { _ref: string };
    alt?: string;
  }>;
  liveURL?: string;
  isPlaceholder?: boolean;
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
  const cs = await client
    .fetch<CaseStudy>(caseStudyBySlugQuery, { slug })
    .catch(() => null);

  if (!cs) return { title: "Case Study Not Found" };

  return {
    title: cs.seoTitle || `${cs.brandName} — Case Study`,
    description: cs.seoDescription || cs.summary,
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

export default async function RoastersCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const cs = await client
    .fetch<CaseStudy>(caseStudyBySlugQuery, { slug })
    .catch(() => null);

  if (!cs) notFound();

  return (
    <article className="bg-white">
      {/* Header */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <Link
            href="/case-studies"
            className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8"
          >
            <ArrowLeft className="mr-1" size={20} weight="duotone" />
            Back to Case Studies
          </Link>

          {cs.logo && (
            <div className="mb-6">
              <Image
                src={urlFor(cs.logo).height(80).url()}
                alt={cs.brandName}
                width={200}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            {cs.brandName}
          </h1>
          <p className="text-lg text-neutral-600">{cs.summary}</p>

          {cs.liveURL && (
            <a
              href={cs.liveURL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-4 text-accent hover:underline font-medium"
            >
              Visit website
              <ArrowSquareOut size={20} weight="duotone" />
            </a>
          )}
        </div>
      </section>

      {/* Gallery */}
      {cs.images && cs.images.length > 0 && (
        <section className="pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cs.images.map((image, i) => (
                <div
                  key={i}
                  className="aspect-[4/3] relative rounded-xl overflow-hidden"
                >
                  <Image
                    src={urlFor(image).width(600).height(450).url()}
                    alt={image.alt || `${cs.brandName} image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Full Story */}
      {cs.fullStory && (
        <section className="pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl prose prose-neutral prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline">
            <PortableText
              value={cs.fullStory}
              components={portableTextComponents}
            />
          </div>
        </section>
      )}
    </article>
  );
}
