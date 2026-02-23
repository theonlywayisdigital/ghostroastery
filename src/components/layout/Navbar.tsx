"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/build", label: "Build Your Brand" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/brands", label: "Our Brands" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-800">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 text-xl lg:text-2xl font-black tracking-tight text-foreground hover:text-accent transition-colors"
          >
            GHOST ROASTING
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
            <Link href="/account">
              <Button variant="ghost" size="sm">
                Account
              </Button>
            </Link>
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
              <Link href="/account" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full">
                  Account
                </Button>
              </Link>
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
