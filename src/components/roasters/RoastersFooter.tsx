import Link from "next/link";
import Image from "next/image";
import { InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";

const PLATFORM_URL = "https://platform.ghostroastery.com";

const footerLinks = {
  platform: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/partner-program", label: "Partner Program" },
    { href: "/case-studies", label: "Case Studies" },
  ],
  resources: [
    { href: "/blog", label: "Blog" },
    { href: "https://ghostroastery.com/contact", label: "Contact Us", external: true },
    { href: "https://ghostroastery.com/about", label: "About Ghost Roastery", external: true },
  ],
  legal: [
    { href: "https://ghostroastery.com/privacy", label: "Privacy Policy", external: true },
    { href: "https://ghostroastery.com/terms", label: "Terms of Service", external: true },
    { href: "https://ghostroastery.com/cookies", label: "Cookie Policy", external: true },
  ],
};

interface RoastersFooterProps {
  logoUrl?: string | null;
}

export function RoastersFooter({ logoUrl }: RoastersFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Ghost Roastery"
                  width={400}
                  height={100}
                  className="h-[100px] w-auto invert"
                />
              ) : (
                <span className="text-2xl font-black tracking-tight text-neutral-900">
                  GHOST ROASTERY
                </span>
              )}
            </Link>
            <p className="mt-4 text-neutral-600 max-w-sm">
              The all-in-one platform for coffee roasters. Sell online, manage wholesale, and grow your business.
            </p>
            <div className="mt-6">
              <a
                href={PLATFORM_URL}
                className="inline-flex items-center px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
              >
                Join the Platform
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo weight="duotone" size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedinLogo weight="duotone" size={24} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-neutral-100 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  {"external" in link ? (
                    <a
                      href={link.href}
                      className="text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {currentYear} Ghost Roastery. All rights reserved.
            </p>
            <p className="text-sm text-neutral-500">
              The platform for independent coffee roasters
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
