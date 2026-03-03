import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { GoogleAnalytics } from "@/components/layout/GoogleAnalytics";
import { client, urlFor } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(
    siteSettingsQuery,
    {},
    { cache: "no-store" }
  );
  const logoUrl = settings?.logo ? urlFor(settings.logo).height(200).url() : null;

  return (
    <>
      <GoogleAnalytics />
      <Navbar logoUrl={logoUrl} />
      <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
      <Footer logoUrl={logoUrl} />
      <CookieBanner />
    </>
  );
}
