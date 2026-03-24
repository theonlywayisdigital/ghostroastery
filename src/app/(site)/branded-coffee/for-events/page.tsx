import { Metadata } from "next";
import { BrandedCoffeeSubPageTemplate } from "@/components/branded-coffee";
import {
  Coffee,
  Package,
  Palette,
  PaintBrush,
  CalendarBlank,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Events & Conferences — Ghost Roastery",
  description:
    "Create custom branded coffee bags for your event, conference, or launch. Design your label online, pick your roast, and order from 25 bags. Delivered in 7–10 days.",
  openGraph: {
    title: "Branded Coffee for Events & Conferences | Ghost Roastery",
    description:
      "Custom branded coffee bags for corporate events, conferences, and launches. Design it yourself online. From 25 bags.",
    url: "https://roasteryplatform.com/branded-coffee/for-events",
  },
};

export default function BrandedCoffeeForEventsPage() {
  return (
    <BrandedCoffeeSubPageTemplate
      heroHeadline="Branded coffee for"
      heroAccent="events people remember."
      heroDescription="Design custom coffee bags for your conference, exhibition, or launch. Use our online builder, add your event branding, and order from just 25 bags. No designers needed, no wholesale minimums."
      heroImage="/images/wholesale/events.jpg"
      whyTitle="Why branded coffee makes events stand out"
      whyDescription={[
        "You spend thousands on the venue, the speakers, the branding. Then you serve forgettable coffee from a catering urn. Attendees notice — they just don't say it.",
        "With Ghost Roastery, you design your own branded coffee bags online. Add your event logo, your sponsor's branding, or a custom message. Pick your roast, order from 25 bags, and we deliver them ready for your event.",
        "Every delegate gets a bag of specialty coffee with your branding on it. It's a talking point, a take-home, and a brand touchpoint that lasts weeks after the event ends.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "SCA 80+ scored beans — noticeably better than catering coffee" },
        { icon: PaintBrush, title: "Design It Online", description: "Use our label maker to create your event-branded bags in minutes" },
        { icon: Palette, title: "Your Event Branding", description: "Your event logo, sponsor logos, or custom artwork on every bag" },
        { icon: Package, title: "Any Quantity from 25", description: "Small roundtable or 500-person conference — order what you need" },
        { icon: CalendarBlank, title: "One-Off or Recurring", description: "Single event orders or regular runs for your events calendar" },
        { icon: ShieldCheck, title: "Freshly Roasted", description: "Roasted to order so it's fresh for your event date" },
      ]}
      howItWorks={[
        { step: "01", title: "Design your label", description: "Open our label maker and add your event branding. Upload logos, pick colours, and preview your bag." },
        { step: "02", title: "Pick your roast", description: "Choose from our specialty-grade single origins and blends. Something for every palate." },
        { step: "03", title: "Place your order", description: "Order online from 25 bags. Pay by card. We'll have them ready before your event." },
        { step: "04", title: "Impress your attendees", description: "Delivered to your office or venue in 7–10 working days. Hand them out, add them to delegate bags, or display them at your stand." },
      ]}
      useCases={[
        { title: "Conference Delegate Bags", description: "A branded bag of coffee in every delegate welcome pack" },
        { title: "Exhibition Stands", description: "Hand out branded coffee to drive footfall to your stand" },
        { title: "Product Launches", description: "Branded coffee as a premium launch giveaway" },
        { title: "Team Away Days", description: "Branded coffee for internal corporate events" },
        { title: "Charity Fundraisers", description: "Sell branded coffee bags to raise funds at events" },
        { title: "Pop-Ups & Markets", description: "Stock your stall with your own branded coffee" },
      ]}
      faqs={[
        { question: "How far in advance should I order?", answer: "We recommend 2–3 weeks before your event to allow for roasting and delivery. For tighter timelines, get in touch and we'll see what we can do." },
        { question: "Can I add sponsor logos to the bags?", answer: "Yes — our label maker supports multiple logos and custom layouts. Design it exactly how you want." },
        { question: "What's the minimum order?", answer: "25 bags. Perfect for small roundtables or intimate events. Order more for larger conferences." },
        { question: "Can you deliver directly to my venue?", answer: "Yes. We deliver UK-wide to any address — your office, the venue, or a warehouse." },
      ]}
    />
  );
}
