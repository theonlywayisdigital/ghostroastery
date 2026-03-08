import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  serverExternalPackages: ["pdfkit"],
  async redirects() {
    return [
      {
        source: "/branded-coffee",
        destination: "/how-it-works",
        permanent: true,
      },
      {
        source: "/the-roasting-process",
        destination: "/our-coffee",
        permanent: true,
      },
      {
        source: "/our-partners",
        destination: "/about",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
