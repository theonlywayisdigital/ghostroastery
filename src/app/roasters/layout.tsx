import { Metadata } from "next";
import { RoastersNavbar } from "@/components/roasters/RoastersNavbar";
import { RoastersFooter } from "@/components/roasters/RoastersFooter";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { client, urlFor } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "Ghost Roastery Platform | For Coffee Roasters",
    template: "%s | Ghost Roastery Platform",
  },
  description:
    "The all-in-one platform for coffee roasters. Sell online, manage wholesale orders, and grow your roasting business.",
  metadataBase: new URL("https://roasters.ghostroastery.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://roasters.ghostroastery.com",
    siteName: "Ghost Roastery Platform",
    title: "Ghost Roastery Platform | For Coffee Roasters",
    description:
      "The all-in-one platform for coffee roasters. Sell online, manage wholesale orders, and grow your roasting business.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Roastery Platform | For Coffee Roasters",
    description:
      "The all-in-one platform for coffee roasters. Sell online, manage wholesale orders, and grow your roasting business.",
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
    <div className="theme-light">
      <RoastersNavbar logoUrl={logoUrl} />
      <main className="min-h-screen">{children}</main>
      <RoastersFooter logoUrl={logoUrl} />
      <CookieBanner variant="light" />
    </div>
  );
}
