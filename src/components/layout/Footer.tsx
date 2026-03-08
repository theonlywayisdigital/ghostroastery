import Link from "next/link";
import Image from "next/image";
import { InstagramLogo, LinkedinLogo, TiktokLogo } from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  brandedCoffee: [
    { href: "/build", label: "Build Your Brand" },
    { href: "/label-maker", label: "Label Maker" },
    { href: "/branded-coffee", label: "How It Works" },
    { href: "/wholesale", label: "Wholesale" },
  ],
  discover: [
    { href: "/brands", label: "Our Brands" },
    { href: "/our-coffee", label: "Our Coffee" },
    { href: "/about", label: "About Us" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/support", label: "Support" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

interface FooterProps {
  logoUrl?: string | null;
}

export function Footer({ logoUrl }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 border-t border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Ghost Roastery"
                  width={400}
                  height={100}
                  className="h-[100px] w-auto"
                />
              ) : (
                <span className="text-2xl font-black tracking-tight text-foreground">
                  GHOST ROASTERY
                </span>
              )}
            </Link>
            <p className="mt-4 text-neutral-400 max-w-sm">
              Your brand. Our roastery. Nobody needs to know.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              UK-based ghost roasting and branded coffee service.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-800 text-white hover:text-foreground hover:bg-neutral-700 transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo weight="duotone" size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-800 text-white hover:text-foreground hover:bg-neutral-700 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinLogo weight="duotone" size={24} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-800 text-white hover:text-foreground hover:bg-neutral-700 transition-colors"
                aria-label="TikTok"
              >
                <TiktokLogo weight="duotone" size={24} />
              </a>
            </div>
          </div>

          {/* Branded Coffee */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Branded Coffee
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.brandedCoffee.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Discover */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Discover
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.discover.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-400 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {currentYear} Ghost Roastery. All rights reserved.
            </p>
            <p className="text-sm text-neutral-500">
              Specialty grade coffee roasted in the UK
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
