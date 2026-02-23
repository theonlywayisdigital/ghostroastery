"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "ghost-roasting-cookie-consent";

type ConsentStatus = "pending" | "accepted" | "declined";

export function CookieBanner() {
  const [status, setStatus] = useState<ConsentStatus>("pending");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (savedConsent === "accepted" || savedConsent === "declined") {
      setStatus(savedConsent as ConsentStatus);
      setIsVisible(false);
    } else {
      // Small delay before showing banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setStatus("accepted");
    setIsVisible(false);

    // Dispatch custom event for GA initialization
    window.dispatchEvent(new CustomEvent("cookieConsentAccepted"));
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setStatus("declined");
    setIsVisible(false);
  };

  if (status !== "pending" || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 transition-transform duration-500 ease-out",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto">
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
            {/* Text Content */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                We value your privacy
              </h3>
              <p className="text-sm text-neutral-300">
                We use cookies to enhance your browsing experience and analyse
                our traffic. By clicking &quot;Accept All&quot;, you consent to
                our use of cookies.{" "}
                <Link
                  href="/cookies"
                  className="text-accent hover:underline"
                >
                  Read our Cookie Policy
                </Link>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="order-2 sm:order-1"
              >
                Decline
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                className="order-1 sm:order-2"
              >
                Accept All
              </Button>
            </div>

            {/* Close button (declines) */}
            <button
              onClick={handleDecline}
              className="absolute top-4 right-4 lg:hidden p-1 text-neutral-400 hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper hook to check consent status
export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      setHasConsent(consent === "accepted");
    };

    checkConsent();

    // Listen for consent changes
    const handleConsentChange = () => checkConsent();
    window.addEventListener("cookieConsentAccepted", handleConsentChange);
    window.addEventListener("storage", handleConsentChange);

    return () => {
      window.removeEventListener("cookieConsentAccepted", handleConsentChange);
      window.removeEventListener("storage", handleConsentChange);
    };
  }, []);

  return hasConsent;
}
