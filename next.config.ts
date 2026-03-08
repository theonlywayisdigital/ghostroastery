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
        source: "/the-roasting-process",
        destination: "/our-coffee",
        permanent: true,
      },
      {
        source: "/our-partners",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/wholesale/for-gyms",
        destination: "/branded-coffee/for-gyms",
        permanent: true,
      },
      {
        source: "/wholesale/for-events",
        destination: "/branded-coffee/for-events",
        permanent: true,
      },
      {
        source: "/wholesale/for-weddings",
        destination: "/branded-coffee/for-weddings",
        permanent: true,
      },
      {
        source: "/wholesale/for-client-gifting",
        destination: "/branded-coffee/for-client-gifting",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
