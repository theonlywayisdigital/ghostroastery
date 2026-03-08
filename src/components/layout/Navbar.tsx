"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  List as MenuIcon,
  X,
  CaretDown,
  User,
  ShoppingBag,
  SignOut,
  PaintBrush,
  Palette,
  GearSix,
  Coffee,
  Info,
  Lifebuoy,
  Newspaper,
  ShieldCheck,
  FileText,
  ArrowRight,
  Handshake,
  Globe,
  Storefront,
  Building,
  Barbell,
  Desktop,
  CalendarBlank,
  ForkKnife,
  Gift,
  Heart,
} from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;
const ROASTERS_URL = process.env.NEXT_PUBLIC_ROASTERS_URL || "https://roasters.ghostroastery.com";
const HOVER_DELAY = 150;

/* ── Mega-menu data ────────────────────────────────────── */

const brandedCoffeeItems = [
  {
    icon: Coffee,
    label: "Overview",
    desc: "Everything you need to know about branded coffee",
    href: "/branded-coffee",
  },
  {
    icon: PaintBrush,
    label: "Build Your Brand",
    desc: "Create your own branded coffee line from scratch",
    href: "/build",
  },
  {
    icon: Palette,
    label: "Label Maker",
    desc: "Design custom labels for your coffee bags",
    href: "/label-maker",
  },
  {
    icon: GearSix,
    label: "How It Works",
    desc: "Our simple four-step process explained",
    href: "/how-it-works",
  },
];

const moreSections = [
  {
    title: "Discover",
    items: [
      { icon: Globe, label: "Brands", desc: "Browse brands built with Ghost Roastery", href: "/brands" },
      { icon: Coffee, label: "Our Coffee", desc: "Specialty grade beans, ethically sourced", href: "/our-coffee" },
    ],
  },
  {
    title: "Company",
    items: [
      { icon: Info, label: "About", desc: "Our mission and story", href: "/about" },
      { icon: Newspaper, label: "Blog", desc: "Tips, guides and industry insights", href: "/blog" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: Lifebuoy, label: "Help Centre", desc: "Get help from our team", href: "/support" },
      { icon: Handshake, label: "Contact", desc: "Get in touch with us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { icon: ShieldCheck, label: "Privacy Policy", desc: "How we handle your data", href: "/privacy" },
      { icon: FileText, label: "Terms & Conditions", desc: "Terms of service", href: "/terms" },
    ],
  },
];

const wholesaleItems = [
  { icon: Storefront, label: "For Cafes", desc: "Your own house blend, your brand", href: "/wholesale/for-cafes" },
  { icon: Building, label: "For Hotels", desc: "Branded in-room coffee for guests", href: "/wholesale/for-hotels" },
  { icon: ForkKnife, label: "For Restaurants", desc: "Your brand on the last thing guests taste", href: "/wholesale/for-restaurants" },
  { icon: Desktop, label: "For Offices", desc: "Quality coffee under your company name", href: "/wholesale/for-offices" },
];

const perfectForItems = [
  { icon: Barbell, label: "For Gyms", desc: "Sell your own branded coffee at the desk", href: "/branded-coffee/for-gyms" },
  { icon: CalendarBlank, label: "For Events", desc: "Custom bags for conferences and launches", href: "/branded-coffee/for-events" },
  { icon: Heart, label: "For Weddings", desc: "The favour guests actually keep", href: "/branded-coffee/for-weddings" },
  { icon: Gift, label: "Client Gifting", desc: "Premium branded gifts they'll actually use", href: "/branded-coffee/for-client-gifting" },
];

/* ── Top Bar ───────────────────────────────────────────── */

function TopBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="bg-neutral-900 border-b border-neutral-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center h-8 relative">
        <a
          href={ROASTERS_URL}
          className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Are you a roaster? Check out our{" "}
          <span className="font-semibold text-accent hover:underline">
            Roasters Platform →
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

/* ── CTA Panel (right side of mega menu) ──────────────── */

function MegaCTAPanel({
  title,
  description,
  ctaLabel,
  ctaHref,
  subtext,
}: {
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  subtext?: string;
}) {
  return (
    <div className="flex flex-col gap-3 pl-8 border-l border-neutral-700 min-w-[240px]">
      <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
        {title}
      </p>
      {description && (
        <p className="text-sm text-neutral-400 mb-2">{description}</p>
      )}
      <Link
        href={ctaHref}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent text-black hover:bg-accent-hover transition-colors group"
      >
        <ArrowRight weight="duotone" className="h-5 w-5 shrink-0" />
        <div>
          <p className="text-sm font-semibold">{ctaLabel}</p>
          {subtext && (
            <p className="text-xs text-black/60">{subtext}</p>
          )}
        </div>
      </Link>
    </div>
  );
}

/* ── Mega-menu trigger + panel ────────────────────────── */

function MegaMenuTrigger({
  label,
  children,
  onNavigate,
  onOpenChange,
  closeKey,
}: {
  label: string;
  children: React.ReactNode;
  hasTopBar?: boolean;
  onNavigate?: () => void;
  onOpenChange?: (open: boolean) => void;
  closeKey?: string;
}) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCloseKey = useRef(closeKey);

  const updateOpen = useCallback((next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
  }, [onOpenChange]);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    updateOpen(true);
  }, [updateOpen]);

  const hide = useCallback(() => {
    timeoutRef.current = setTimeout(() => updateOpen(false), HOVER_DELAY);
  }, [updateOpen]);

  // Close when closeKey (pathname) changes
  useEffect(() => {
    if (prevCloseKey.current !== closeKey) {
      updateOpen(false);
      prevCloseKey.current = closeKey;
    }
  }, [closeKey, updateOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Wrap children to intercept link clicks
  const handlePanelClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const link = target.closest("a");
    if (link) {
      updateOpen(false);
      onNavigate?.();
    }
  }, [onNavigate, updateOpen]);

  return (
    <div
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button
        className={cn(
          "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-colors",
          open
            ? "text-foreground bg-neutral-800"
            : "text-neutral-300 hover:text-foreground hover:bg-neutral-800"
        )}
        onClick={() => updateOpen(!open)}
        aria-expanded={open}
      >
        {label}
        <CaretDown
          weight="duotone"
          size={16}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <>
          {/* Bridge to prevent hover gap between button and panel */}
          <div className="absolute left-0 right-0 h-6 bottom-0 translate-y-full" />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="fixed left-0 right-0 z-50"
            style={{ top: "var(--navbar-bottom)" }}
            onClick={handlePanelClick}
          >
            <div className="bg-neutral-900 border-t border-neutral-800 border-b border-b-neutral-700 shadow-xl">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Menu item ────────────────────────────────────────── */

function MenuItem({
  icon: Icon,
  label,
  desc,
  href,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; weight?: IconWeight; size?: number }>;
  label: string;
  desc: string;
  href: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors group"
    >
      <Icon weight="duotone" size={24} className="text-white group-hover:text-accent transition-colors shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
          {label}
        </p>
        <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}

/* ── Main component ───────────────────────────────────── */

interface NavbarProps {
  logoUrl?: string | null;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [megaMenuCount, setMegaMenuCount] = useState(0);
  const megaMenuOpen = megaMenuCount > 0;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Close menus and clear loading state on route change
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMobileOpen(false);
      setIsNavigating(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  // Update CSS variable for mega menu positioning
  useEffect(() => {
    function updateNavbarBottom() {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        document.documentElement.style.setProperty(
          "--navbar-bottom",
          `${rect.bottom}px`
        );
      }
    }
    updateNavbarBottom();
    window.addEventListener("resize", updateNavbarBottom);
    window.addEventListener("scroll", updateNavbarBottom);
    return () => {
      window.removeEventListener("resize", updateNavbarBottom);
      window.removeEventListener("scroll", updateNavbarBottom);
    };
  }, [topBarVisible]);

  const toggleAccordion = (key: string) =>
    setMobileAccordion((prev) => (prev === key ? null : key));

  // Show loading bar on navigation
  const handleNavClick = useCallback(() => {
    setIsNavigating(true);
  }, []);

  // Mobile: close menu + show loading
  const handleMobileNavClick = useCallback(() => {
    setMobileOpen(false);
    setIsNavigating(true);
  }, []);

  // Track mega menu open state for solid header background
  const handleMegaMenuOpenChange = useCallback((open: boolean) => {
    setMegaMenuCount((c) => c + (open ? 1 : -1));
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  async function handleSignOut() {
    await signOut();
    setDropdownOpen(false);
    setMobileOpen(false);
    toast({ title: "Signed out successfully", variant: "success" });
    router.push("/");
  }

  const truncatedEmail = user?.email
    ? user.email.length > 24
      ? `${user.email.slice(0, 24)}…`
      : user.email
    : "";

  return (
    <>
      {/* Top Bar */}
      {topBarVisible && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <TopBar onDismiss={() => setTopBarVisible(false)} />
        </div>
      )}

      {/* Loading bar */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-0.5">
          <div className="h-full bg-accent animate-loading-bar" />
        </div>
      )}

      {/* Main Header */}
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b border-neutral-800 transition-[margin,background-color] duration-200",
          megaMenuOpen ? "bg-background" : "bg-background/80 backdrop-blur-md",
          topBarVisible && "mt-8"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Ghost Roastery"
                  width={400}
                  height={100}
                  className="h-20 lg:h-[100px] w-auto"
                  priority
                />
              ) : (
                <span className="text-xl lg:text-2xl font-black tracking-tight text-foreground hover:text-accent transition-colors">
                  GHOST ROASTERY
                </span>
              )}
            </Link>

            {/* ─── Desktop Navigation ─── */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center gap-1">
                {/* Branded Coffee mega menu */}
                <MegaMenuTrigger label="Branded Coffee" hasTopBar={topBarVisible} onNavigate={handleNavClick} onOpenChange={handleMegaMenuOpenChange} closeKey={pathname}>
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                        Branded Coffee Fast
                      </h3>
                      <div className="space-y-1">
                        {brandedCoffeeItems.map((item) => (
                          <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            desc={item.desc}
                            href={item.href}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                        Perfect For
                      </h3>
                      <div className="space-y-1">
                        {perfectForItems.map((item) => (
                          <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            desc={item.desc}
                            href={item.href}
                          />
                        ))}
                      </div>
                    </div>
                    <MegaCTAPanel
                      title="Get started"
                      ctaLabel="Set Up Your Brand Now"
                      ctaHref="/build"
                      subtext="Receive your own branded coffee in 7–10 working days"
                    />
                  </div>
                </MegaMenuTrigger>

                {/* Wholesale mega menu */}
                <MegaMenuTrigger label="Wholesale" hasTopBar={topBarVisible} onNavigate={handleNavClick} onOpenChange={handleMegaMenuOpenChange} closeKey={pathname}>
                  <div className="flex gap-8">
                    <div className="flex-1">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                        By sector
                      </h3>
                      <div className="grid grid-cols-2 gap-1">
                        {wholesaleItems.map((item) => (
                          <MenuItem
                            key={item.label}
                            icon={item.icon}
                            label={item.label}
                            desc={item.desc}
                            href={item.href}
                          />
                        ))}
                      </div>
                    </div>
                    <MegaCTAPanel
                      title="Wholesale"
                      ctaLabel="Request Wholesale Access"
                      ctaHref="/wholesale/sign-up"
                      subtext="Trade pricing and flexible terms"
                    />
                  </div>
                </MegaMenuTrigger>

                {/* More mega menu */}
                <MegaMenuTrigger label="More" hasTopBar={topBarVisible} onNavigate={handleNavClick} onOpenChange={handleMegaMenuOpenChange} closeKey={pathname}>
                  <div className="flex gap-8">
                    <div className="flex-1 grid grid-cols-4 gap-8">
                      {moreSections.map((section) => (
                        <div key={section.title}>
                          <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
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
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </MegaMenuTrigger>
              </div>
            </div>

            {/* ─── Desktop CTA ─── */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <User weight="duotone" size={20} />
                    <span className="max-w-[160px] truncate">
                      {truncatedEmail}
                    </span>
                    <CaretDown
                      weight="duotone"
                      size={16}
                      className={cn(
                        "transition-transform",
                        dropdownOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl py-1 z-50">
                      <a
                        href={PORTAL_URL ? `${PORTAL_URL}/my-orders` : "/account"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-foreground hover:bg-neutral-700 transition-colors"
                      >
                        <ShoppingBag weight="duotone" size={20} />
                        My Orders
                      </a>
                      <a
                        href={PORTAL_URL ? `${PORTAL_URL}/dashboard` : "/account"}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-foreground hover:bg-neutral-700 transition-colors"
                      >
                        <User weight="duotone" size={20} />
                        My Account
                      </a>
                      <div className="border-t border-neutral-700 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-300 hover:text-foreground hover:bg-neutral-700 transition-colors"
                      >
                        <SignOut weight="duotone" size={20} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a href={PORTAL_URL ? `${PORTAL_URL}/login` : "/account"}>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </a>
              )}
              <Link href="/build">
                <Button variant="primary" size="sm">
                  Build Your Brand
                </Button>
              </Link>
            </div>

            {/* ─── Mobile menu button ─── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-neutral-300 hover:text-foreground hover:bg-neutral-800 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? (
                <X size={28} />
              ) : (
                <MenuIcon size={28} />
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
            <div className="py-4 space-y-1 border-t border-neutral-800">
              {/* Branded Coffee accordion */}
              <button
                onClick={() => toggleAccordion("branded")}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
              >
                Branded Coffee
                <CaretDown
                  weight="duotone"
                  size={20}
                  className={cn(
                    "text-white transition-transform duration-200",
                    mobileAccordion === "branded" && "rotate-180"
                  )}
                />
              </button>
              {mobileAccordion === "branded" && (
                <div className="pl-4 py-2 space-y-1">
                  {brandedCoffeeItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleMobileNavClick}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <Icon weight="duotone" size={20} className="text-white" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 mt-3 mb-1">
                    Perfect For
                  </p>
                  {perfectForItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleMobileNavClick}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <Icon weight="duotone" size={20} className="text-white" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Wholesale accordion */}
              <button
                onClick={() => toggleAccordion("wholesale")}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
              >
                Wholesale
                <CaretDown
                  weight="duotone"
                  size={20}
                  className={cn(
                    "text-white transition-transform duration-200",
                    mobileAccordion === "wholesale" && "rotate-180"
                  )}
                />
              </button>
              {mobileAccordion === "wholesale" && (
                <div className="pl-4 py-2 space-y-1">
                  <Link
                    href="/wholesale"
                    onClick={handleMobileNavClick}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                  >
                    <Coffee weight="duotone" size={20} className="text-white" />
                    Overview
                  </Link>
                  {wholesaleItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={handleMobileNavClick}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                      >
                        <Icon weight="duotone" size={20} className="text-white" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* More accordion */}
              <button
                onClick={() => toggleAccordion("more")}
                className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
              >
                More
                <CaretDown
                  weight="duotone"
                  size={20}
                  className={cn(
                    "text-white transition-transform duration-200",
                    mobileAccordion === "more" && "rotate-180"
                  )}
                />
              </button>
              {mobileAccordion === "more" && (
                <div className="pl-4 py-2 space-y-4">
                  {moreSections.map((section) => (
                    <div key={section.title}>
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-4 mb-1">
                        {section.title}
                      </p>
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={handleMobileNavClick}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                          >
                            <Icon weight="duotone" size={20} className="text-white" />
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
                {user ? (
                  <>
                    <p className="text-xs text-neutral-500 px-1 truncate">
                      {user.email}
                    </p>
                    <a
                      href={PORTAL_URL ? `${PORTAL_URL}/my-orders` : "/account"}
                      onClick={handleMobileNavClick}
                    >
                      <Button variant="outline" className="w-full">
                        My Orders
                      </Button>
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-neutral-300 hover:text-foreground border border-neutral-700 rounded-lg transition-colors"
                    >
                      <SignOut size={20} weight="duotone" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <a
                    href={PORTAL_URL ? `${PORTAL_URL}/login` : "/account"}
                    onClick={handleMobileNavClick}
                  >
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </a>
                )}
                <Link href="/build" onClick={handleMobileNavClick}>
                  <Button variant="primary" className="w-full">
                    Build Your Brand
                  </Button>
                </Link>
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
