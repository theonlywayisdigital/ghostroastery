"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  List,
  X,
  CaretDown,
  ShoppingCart,
  Storefront,
  Receipt,
  Envelope,
  ShareNetwork,
  Lightning,
  Sparkle,
  BookOpen,
  Users,
  Info,
  Lifebuoy,
  ShieldCheck,
  FileText,
  ArrowRight,
  CalendarCheck,
  Newspaper,
  ShoppingBag,
  ClipboardText,
  Wrench,
  Browser,
  Leaf,
  Fire,
  CalendarBlank,
  Star,
  Calculator,
  Certificate,
  PaintBrush,
  Compass,
  Globe,
  Eye,
  Layout,
} from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const PLATFORM_URL = "https://platform.ghostroastery.com";
const CONSUMER_URL = "https://ghostroastery.com";
const HOVER_DELAY = 150;

/* ── Top Bar ───────────────────────────────────────────── */

function TopBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-neutral-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-8 relative">
        <a
          href={CONSUMER_URL}
          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Looking for white label coffee?{" "}
          <span className="font-semibold text-accent hover:underline">
            Visit Ghost Roastery &rarr;
          </span>
        </a>
        <button
          onClick={onDismiss}
          className="absolute right-4 p-1 text-neutral-500 hover:text-neutral-300 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Mega-menu data ────────────────────────────────────── */

const productsSections = [
  {
    title: "Sales Suite",
    badge: "Free",
    allHref: "/features/sales",
    mobileIcon: ShoppingBag,
    mobileDesc: "Storefront, wholesale, orders & invoicing",
    items: [
      { icon: ClipboardText, label: "Order Tracking", desc: "Track every order from roast to doorstep", href: "/features/order-tracking" },
      { icon: ShoppingCart, label: "Wholesale", desc: "Manage wholesale accounts and orders", href: "/features/wholesale" },
      { icon: Storefront, label: "Storefront", desc: "Your branded online coffee shop", href: "/features/storefront" },
      { icon: Receipt, label: "Invoicing", desc: "Automated invoicing and payment tracking", href: "/features/invoices" },
    ],
  },
  {
    title: "Marketing Suite",
    badge: "Free",
    allHref: "/features/marketing",
    mobileIcon: Envelope,
    mobileDesc: "Email campaigns, social, automations & AI",
    items: [
      { icon: Envelope, label: "Email Campaigns", desc: "Beautiful emails that drive repeat orders", href: "/features/email-campaigns" },
      { icon: ShareNetwork, label: "Social Scheduling", desc: "Plan and publish across all channels", href: "/features/social-scheduling" },
      { icon: Lightning, label: "Automations", desc: "Set it and forget it workflows", href: "/features/automations" },
      { icon: Sparkle, label: "AI Studio", desc: "AI-powered copy, images and insights", href: "/features/ai-studio" },
    ],
  },
  {
    title: "Roaster Tools",
    badge: "Free",
    allHref: "/features/roaster-tools",
    mobileIcon: Wrench,
    mobileDesc: "Green bean inventory, roast log & cupping",
    items: [
      { icon: Leaf, label: "Green Bean Inventory", desc: "Track every bag from arrival to roast", href: "/features/green-bean-inventory" },
      { icon: Fire, label: "Roast Log", desc: "Record profiles, curves and notes", href: "/features/roast-log" },
      { icon: CalendarBlank, label: "Production Planner", desc: "Schedule roasts and manage capacity", href: "/features/production-planner" },
      { icon: Star, label: "Cupping Scorecards", desc: "Score and compare every batch", href: "/features/cupping-scorecards" },
    ],
  },
  {
    title: "Website Builder",
    badge: null,
    priceLabel: "From £14/mo",
    allHref: "/features/website",
    mobileIcon: Browser,
    mobileDesc: "Page builder, theming, custom domains",
    items: [
      { icon: Layout, label: "Page Builder", desc: "Drag-and-drop pages in minutes", href: "/features/website" },
      { icon: PaintBrush, label: "Design & Theming", desc: "Your brand, your colours, your fonts", href: "/features/website" },
      { icon: Globe, label: "Custom Domains", desc: "Use your own domain name", href: "/features/website" },
      { icon: Eye, label: "Live Preview", desc: "See changes before you publish", href: "/features/website" },
    ],
  },
];

const moreSections = [
  {
    title: "Resources",
    items: [
      { icon: BookOpen, label: "Case Studies", desc: "See how roasters grow with us", href: "/case-studies" },
      { icon: Newspaper, label: "Blog", desc: "Tips, guides and industry insights", href: "/blog" },
      { icon: Lifebuoy, label: "Support", desc: "Get help from our team", href: "https://ghostroastery.com/contact", external: true },
    ],
  },
  {
    title: "Company",
    items: [
      { icon: Info, label: "About", desc: "Our mission and story", href: "https://ghostroastery.com/about", external: true },
      { icon: Users, label: "Partner Program", desc: "Earn by roasting for other brands", href: "/partner-program" },
    ],
  },
  {
    title: "Legal",
    items: [
      { icon: ShieldCheck, label: "Privacy Policy", desc: "How we handle your data", href: "https://ghostroastery.com/privacy", external: true },
      { icon: FileText, label: "Terms & Conditions", desc: "Platform terms of service", href: "https://ghostroastery.com/terms", external: true },
    ],
  },
];

/* ── CTA panel (shared by both mega menus) ─────────────── */

function MegaCTAPanel() {
  return (
    <div className="flex flex-col gap-3 pl-8 border-l border-neutral-200 min-w-[220px]">
      <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-1">
        Get started
      </p>
      <a
        href={`${PLATFORM_URL}/demo`}
        className="flex items-center gap-3 px-4 py-3 rounded-lg border border-neutral-200 hover:border-accent hover:bg-accent-muted transition-colors group"
      >
        <CalendarCheck weight="duotone" size={24} className="text-accent shrink-0" />
        <div>
          <p className="text-sm font-semibold text-neutral-900 group-hover:text-accent transition-colors">
            Book a Demo
          </p>
          <p className="text-xs text-neutral-500">See the platform in action</p>
        </div>
      </a>
      <a
        href={`${PLATFORM_URL}/signup`}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-white hover:bg-accent-hover transition-colors group"
      >
        <ArrowRight weight="duotone" size={24} className="shrink-0" />
        <div>
          <p className="text-sm font-semibold">Join the Platform</p>
          <p className="text-xs text-white/70">Free to get started</p>
        </div>
      </a>
    </div>
  );
}

/* ── Mega-menu trigger + panel ─────────────────────────── */

function MegaMenuTrigger({
  label,
  children,
  hasTopBar,
}: {
  label: string;
  children: React.ReactNode;
  hasTopBar?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), HOVER_DELAY);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger */}
      <button
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
          open
            ? "text-neutral-900 bg-neutral-100"
            : "text-neutral-900 hover:bg-neutral-100"
        )}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {label}
        <CaretDown
          weight="duotone"
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Panel — full-width, anchored to the header */}
      {open && (
        <div className={cn(
          "fixed left-0 right-0 z-50",
          hasTopBar ? "top-[calc(2rem+79px)]" : "top-[79px]"
        )}>
          <div className="bg-white border-b border-neutral-200 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Badge ─────────────────────────────────────────────── */

function FreeBadge() {
  return (
    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
      Free
    </span>
  );
}

/* ── Menu item (HubSpot style — icon, title, description) ─ */

function MenuItem({
  icon: Icon,
  label,
  desc,
  href,
  external,
  comingSoon,
}: {
  icon: React.ComponentType<{ className?: string; weight?: IconWeight; size?: number }>;
  label: string;
  desc: string;
  href: string;
  external?: boolean;
  comingSoon?: boolean;
}) {
  if (comingSoon) {
    return (
      <div className="flex gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-default">
        <Icon weight="duotone" size={24} className="text-neutral-400 shrink-0 mt-0.5" />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-neutral-400">
              {label}
            </span>
            <span className="text-[10px] font-semibold text-neutral-400 uppercase">
              Coming Soon
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
        </div>
      </div>
    );
  }

  const className =
    "flex gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 transition-colors group";

  const content = (
    <>
      <Icon weight="duotone" size={24} className="text-neutral-900 group-hover:text-accent transition-colors shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-neutral-900 group-hover:text-accent transition-colors">
          {label}
        </p>
        <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

/* ── Main component ────────────────────────────────────── */

interface RoastersNavbarProps {
  logoUrl?: string | null;
}

export function RoastersNavbar({ }: RoastersNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [topBarVisible, setTopBarVisible] = useState(true);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleAccordion = (key: string) =>
    setMobileAccordion((prev) => (prev === key ? null : key));

  return (
    <>
    {topBarVisible && (
      <div className="fixed top-0 left-0 right-0 z-50">
        <TopBar onDismiss={() => setTopBarVisible(false)} />
      </div>
    )}
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-200 transition-[margin] duration-200",
      topBarVisible && "mt-8"
    )}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/ghost-roastery-platform-logo.png"
              alt="Ghost Roastery Platform"
              width={400}
              height={100}
              className="h-14 lg:h-[80px] w-auto"
              priority
            />
          </Link>

          {/* ─── Desktop Navigation ─── */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center gap-1">
              {/* Products mega menu */}
              <MegaMenuTrigger label="Products" hasTopBar={topBarVisible}>
                <div className="flex gap-8">
                  {/* Product sections */}
                  <div className="flex-1 grid grid-cols-4 gap-8">
                    {productsSections.map((section) => (
                      <div key={section.title}>
                        <div className="flex items-center mb-4">
                          <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                            {section.title}
                          </h3>
                          {section.badge && <FreeBadge />}
                          {"priceLabel" in section && (section as { priceLabel?: string }).priceLabel && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-accent/10 text-accent border border-accent/20">
                              {(section as { priceLabel?: string }).priceLabel}
                            </span>
                          )}
                          {"comingSoon" in section && (section as { comingSoon?: boolean }).comingSoon && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-500 border border-neutral-200">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <MenuItem
                              key={item.label}
                              icon={item.icon}
                              label={item.label}
                              desc={item.desc}
                              href={item.href}
                              comingSoon={"comingSoon" in item && !!(item as { comingSoon?: boolean }).comingSoon}
                            />
                          ))}
                        </div>
                        {!("comingSoon" in section && section.comingSoon) && (
                          <Link
                            href={section.allHref}
                            className="flex items-center gap-1 px-3 mt-3 text-xs font-semibold text-accent hover:underline"
                          >
                            All {section.title} features
                            <ArrowRight weight="duotone" size={16} />
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA panel */}
                  <MegaCTAPanel />
                </div>
              </MegaMenuTrigger>

              {/* Pricing — plain link */}
              <Link
                href="/pricing"
                className="px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 transition-colors rounded-md"
              >
                Pricing
              </Link>

              {/* More mega menu */}
              <MegaMenuTrigger label="More" hasTopBar={topBarVisible}>
                <div className="flex gap-8">
                  <div className="flex-1 grid grid-cols-3 gap-8">
                    {moreSections.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.items.map((item) => (
                            <MenuItem
                              key={item.label}
                              icon={item.icon}
                              label={item.label}
                              desc={item.desc}
                              href={item.href}
                              external={"external" in item && item.external}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA panel */}
                  <MegaCTAPanel />
                </div>
              </MegaMenuTrigger>
            </div>
          </div>

          {/* ─── Desktop CTA ─── */}
          <div className="hidden lg:flex items-center gap-3">
            <a href={`${PLATFORM_URL}/login`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-neutral-900 hover:bg-neutral-100"
              >
                Sign In
              </Button>
            </a>
            <a href={`${PLATFORM_URL}/signup`}>
              <Button variant="primary" size="sm">
                Start Free
              </Button>
            </a>
          </div>

          {/* ─── Mobile menu button ─── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? (
              <X weight="duotone" size={24} />
            ) : (
              <List weight="duotone" size={28} />
            )}
          </button>
        </div>

        {/* ─── Mobile Navigation ─── */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1 border-t border-neutral-200">
            {/* Products accordion */}
            <button
              onClick={() => toggleAccordion("products")}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              Products
              <CaretDown
                weight="duotone"
                size={16}
                className={cn(
                  "text-neutral-400 transition-transform duration-200",
                  mobileAccordion === "products" && "rotate-180"
                )}
              />
            </button>
            {mobileAccordion === "products" && (
              <div className="px-4 space-y-2 py-2">
                {productsSections.map((section) => {
                  const MobileIcon = section.mobileIcon;
                  return (
                    <Link
                      key={section.title}
                      href={section.allHref}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-neutral-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-accent group-hover:text-white transition-colors">
                        <MobileIcon weight="duotone" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-neutral-900 group-hover:text-accent transition-colors">
                            {section.title}
                          </p>
                          {section.badge && <FreeBadge />}
                          {"priceLabel" in section && (section as { priceLabel?: string }).priceLabel && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-accent/10 text-accent border border-accent/20">
                              {(section as { priceLabel?: string }).priceLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{section.mobileDesc}</p>
                      </div>
                      <ArrowRight weight="duotone" size={16} className="text-neutral-400 group-hover:text-accent shrink-0 mt-2.5 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pricing link */}
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              Pricing
            </Link>

            {/* More accordion */}
            <button
              onClick={() => toggleAccordion("more")}
              className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
            >
              More
              <CaretDown
                weight="duotone"
                size={16}
                className={cn(
                  "text-neutral-400 transition-transform duration-200",
                  mobileAccordion === "more" && "rotate-180"
                )}
              />
            </button>
            {mobileAccordion === "more" && (
              <div className="pl-4 py-2 space-y-4">
                {moreSections.map((section) => (
                  <div key={section.title}>
                    <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wider px-4 mb-1">
                      {section.title}
                    </p>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isExternal =
                        "external" in item && item.external;
                      const props = {
                        className:
                          "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors",
                        onClick: () => setMobileOpen(false),
                      };

                      if (isExternal) {
                        return (
                          <a key={item.label} href={item.href} {...props}>
                            <Icon weight="duotone" size={20} className="text-neutral-900" />
                            {item.label}
                          </a>
                        );
                      }

                      return (
                        <Link key={item.label} href={item.href} {...props}>
                          <Icon weight="duotone" size={20} className="text-neutral-900" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile CTAs */}
            <div className="pt-4 px-4 space-y-3">
              <a
                href={`${PLATFORM_URL}/login`}
                onClick={() => setMobileOpen(false)}
              >
                <Button
                  variant="outline"
                  className="w-full text-neutral-900 border-neutral-300"
                >
                  Sign In
                </Button>
              </a>
              <a
                href={`${PLATFORM_URL}/signup`}
                onClick={() => setMobileOpen(false)}
              >
                <Button variant="primary" className="w-full">
                  Start Free
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>

    {/* Spacer to push content below the fixed header */}
    <div className={cn(
      "transition-[height] duration-200",
      topBarVisible ? "h-24 lg:h-28" : "h-16 lg:h-20"
    )} />
    </>
  );
}
