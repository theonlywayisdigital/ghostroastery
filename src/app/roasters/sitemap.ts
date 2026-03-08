import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import {
  roasterBlogPostsQuery,
  roasterCaseStudiesQuery,
  allRoasterFeatureDetailSlugsQuery,
} from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://roasters.ghostroastery.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/features/sales`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/marketing`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/roaster-tools`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/features/website`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/partner-program`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case-studies`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic pages from Sanity
  let featureDetailPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];
  let caseStudyPages: MetadataRoute.Sitemap = [];

  try {
    const [featureSlugs, blogPosts, caseStudies] = await Promise.all([
      client
        .fetch<{ slug: string }[]>(allRoasterFeatureDetailSlugsQuery)
        .catch(() => []),
      client
        .fetch<{ slug: { current: string } }[]>(roasterBlogPostsQuery)
        .catch(() => []),
      client
        .fetch<{ slug: { current: string }; isPlaceholder?: boolean }[]>(
          roasterCaseStudiesQuery
        )
        .catch(() => []),
    ]);

    featureDetailPages = featureSlugs.map((f) => ({
      url: `${baseUrl}/features/${f.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    blogPages = blogPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug.current}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    caseStudyPages = caseStudies
      .filter((cs) => !cs.isPlaceholder)
      .map((cs) => ({
        url: `${baseUrl}/case-studies/${cs.slug.current}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
  } catch {
    // Silently fail — sitemap will omit dynamic pages
  }

  return [
    ...staticPages,
    ...featureDetailPages,
    ...blogPages,
    ...caseStudyPages,
  ];
}
