import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  ArrowsClockwise,
  Users,
  Buildings,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Offices — Company Coffee Supply | Ghost Roastery",
  description:
    "Supply your office with your own branded specialty coffee. Impress clients, reward staff, and upgrade the kitchen. Wholesale pricing, flexible delivery.",
  openGraph: {
    title: "Branded Coffee for Offices | Ghost Roastery",
    description:
      "Quality coffee under your company name. Branded office coffee supply for businesses.",
    url: "https://roasteryplatform.com/wholesale/for-offices",
  },
};

export default function WholesaleForOfficesPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="Your company coffee."
      heroAccent="Actually good."
      heroImage="/images/wholesale/office.jpg"
      heroDescription="Replace the generic office coffee with your own branded specialty blend. For the kitchen, the boardroom, and the client meeting where details matter."
      problemTitle="Office coffee doesn't have to be terrible"
      problemDescription={[
        "Most offices default to the cheapest option — plastic pods, stale instant, or bulk-bought supermarket bags. Staff know it. Clients notice it. It's a missed opportunity.",
        "Your own branded coffee says something about your company: you care about quality, you pay attention to detail, and you invest in your people. It's a small thing that makes a big impression.",
        "We supply specialty-grade coffee in bags with your company name. Use it in the kitchen, the boardroom, or as client gifts. Delivered on a schedule that works for you.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "A genuine upgrade over standard office coffee" },
        { icon: Palette, title: "Company Branding", description: "Your logo and brand on every bag" },
        { icon: Package, title: "Multiple Formats", description: "250g, 500g, or 1kg — whole bean or ground" },
        { icon: ArrowsClockwise, title: "Auto-Delivery", description: "Set a schedule and forget about reordering" },
        { icon: Users, title: "Staff Perk", description: "A benefit your team will actually appreciate" },
        { icon: Buildings, title: "Multi-Site", description: "Same quality across all your offices" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your office", description: "Staff count, number of sites, and how you serve coffee (cafetière, filter, bean-to-cup)." },
        { step: "02", title: "We recommend a blend", description: "Something crowd-pleasing, consistent, and designed for the way you brew." },
        { step: "03", title: "Design your packaging", description: "Your company name, logo, and colours — on every bag." },
        { step: "04", title: "Delivered automatically", description: "We'll set up a delivery schedule so you never run out. Adjust volume any time." },
      ]}
      useCases={[
        { title: "Kitchen & Break Room", description: "Daily coffee for the team — a real upgrade from the usual" },
        { title: "Client Meetings", description: "Serve your own brand in the boardroom — a detail clients notice" },
        { title: "Welcome Packs", description: "A bag of branded coffee for new starters or visiting clients" },
        { title: "Corporate Gifts", description: "End-of-year or thank-you gifts with your branding" },
        { title: "Company Store", description: "Sell or distribute via your internal merch store" },
        { title: "Events & Conferences", description: "Branded coffee at company events and town halls" },
      ]}
      faqs={[
        { question: "How much coffee does an office need?", answer: "A rough guide: 1 bag (250g) per 5 coffee-drinking staff per week. We'll help you estimate based on your headcount." },
        { question: "Can you supply multiple offices?", answer: "Yes — we can deliver to multiple addresses on the same schedule." },
        { question: "What brewing methods do you support?", answer: "We supply whole bean or ground for any method: cafetière, filter, pour-over, or bean-to-cup machines." },
        { question: "What's the minimum order?", answer: "150 bags for wholesale. For smaller offices or a trial, start with our branded coffee service (25+ bags)." },
      ]}
    />
  );
}
