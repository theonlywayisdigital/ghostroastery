import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ghost Roastery | Branded Coffee Roasting Service UK",
    template: "%s | Ghost Roastery",
  },
  description:
    "Your brand. Our roastery. Nobody needs to know. UK-based ghost roasting and branded coffee service. Launch your coffee brand from 25 bags.",
  keywords: [
    "ghost roasting UK",
    "white label coffee UK",
    "branded coffee bags UK",
    "start a coffee brand UK",
    "custom branded coffee bags UK",
    "private label coffee UK",
    "branded coffee for gyms UK",
    "coffee fulfillment service UK",
    "wholesale specialty coffee UK",
  ],
  authors: [{ name: "Ghost Roastery" }],
  creator: "Ghost Roastery",
  metadataBase: new URL("https://ghostroastery.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://ghostroastery.com",
    siteName: "Ghost Roastery",
    title: "Ghost Roastery | Branded Coffee Roasting Service UK",
    description:
      "Your brand. Our roastery. Nobody needs to know. UK-based ghost roasting and branded coffee service.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghost Roastery | Branded Coffee Roasting Service UK",
    description:
      "Your brand. Our roastery. Nobody needs to know. UK-based ghost roasting and branded coffee service.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
