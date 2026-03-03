"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, ChevronDown, User, ShoppingBag, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

const navLinks = [
  { href: "/build", label: "Build Your Brand" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/brands", label: "Our Brands" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

interface NavbarProps {
  logoUrl?: string | null;
}

export function Navbar({ logoUrl }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Click outside to close dropdown
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
    setIsOpen(false);
    toast({ title: "Signed out successfully", variant: "success" });
    router.push("/");
  }

  const truncatedEmail = user?.email
    ? user.email.length > 24
      ? `${user.email.slice(0, 24)}…`
      : user.email
    : "";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-800">
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

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-foreground transition-colors rounded-md hover:bg-neutral-800"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[160px] truncate">
                    {truncatedEmail}
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
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
                      <ShoppingBag className="w-4 h-4" />
                      My Orders
                    </a>
                    <a
                      href={PORTAL_URL ? `${PORTAL_URL}/dashboard` : "/account"}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:text-foreground hover:bg-neutral-700 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      My Account
                    </a>
                    <div className="border-t border-neutral-700 my-1" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-neutral-300 hover:text-foreground hover:bg-neutral-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
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
                Start Building
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-neutral-300 hover:text-foreground hover:bg-neutral-800 transition-colors"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1 border-t border-neutral-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-neutral-300 hover:text-foreground hover:bg-neutral-800 rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 px-4 space-y-3">
              {user ? (
                <>
                  <p className="text-xs text-neutral-500 px-1 truncate">
                    {user.email}
                  </p>
                  <a href={PORTAL_URL ? `${PORTAL_URL}/my-orders` : "/account"} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full">
                      My Orders
                    </Button>
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium text-neutral-300 hover:text-foreground border border-neutral-700 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <a href={PORTAL_URL ? `${PORTAL_URL}/login` : "/account"} onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </a>
              )}
              <Link href="/build" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full">
                  Start Building
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
