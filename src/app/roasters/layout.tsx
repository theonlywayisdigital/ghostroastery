import { Metadata } from "next";
import { RoastersNavbar } from "@/components/roasters/RoastersNavbar";
import { RoastersFooter } from "@/components/roasters/RoastersFooter";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { client, urlFor } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "Ghost Roastery Platform — The All-in-One Platform for Coffee Roasters",
    template: "%s | Ghost Roastery Platform",
  },
  description:
    "Everything you need to sell more coffee. Storefront, wholesale, marketing, roaster tools, and website builder — one platform, one login.",
  metadataBase: new URL("https://roasters.ghostroastery.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://roasters.ghostroastery.com",
    siteName: "Ghost Roastery Platform",
    title: "Ghost Roastery Platform — The All-in-One Platform for Coffee Roasters",
    description:
      "Everything you need to sell more coffee. Storefront, wholesale, marketing, roaster tools, and website builder — one platform, one login.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Roastery Platform — The All-in-One Platform for Coffee Roasters",
    description:
      "Everything you need to sell more coffee. Storefront, wholesale, marketing, roaster tools, and website builder — one platform, one login.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RoastersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(
    siteSettingsQuery,
    {},
    { cache: "no-store" }
  );
  const logoUrl = settings?.logo
    ? urlFor(settings.logo).height(200).url()
    : null;

  return (
    <div className="theme-light overflow-x-hidden">
      <RoastersNavbar logoUrl={logoUrl} />
      <main className="min-h-screen">{children}</main>
      <RoastersFooter logoUrl={logoUrl} />
      <CookieBanner variant="light" />
    </div>
  );
}
