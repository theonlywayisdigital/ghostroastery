import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/studio",
        "/api",
        "/build",
        "/label-maker",
        "/dashboard",
        "/account",
      ],
    },
    sitemap: "https://ghostroastery.com/sitemap.xml",
  };
}
