import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  ArrowsClockwise,
  ChatCircle,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wholesale Coffee for Cafes — Own Brand Coffee Supply | Ghost Roastery",
  description:
    "Supply your cafe with your own branded coffee. Specialty grade, custom roast profiles, flexible delivery. Stand out from every other cafe serving the same brand.",
  openGraph: {
    title: "Wholesale Coffee for Cafes | Ghost Roastery",
    description:
      "Your own house blend, your own brand on the shelf. Wholesale branded coffee for cafes and coffee shops.",
    url: "https://ghostroastery.com/wholesale/for-cafes",
  },
};

export default function WholesaleForCafesPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="Your cafe deserves"
      heroAccent="its own coffee brand."
      heroDescription="Stop serving the same roaster as everyone else on the high street. Get your own branded blend — specialty grade, roasted to your spec, and delivered on your schedule."
      heroImage="/images/wholesale/cafe.jpg"
      problemTitle="The problem with generic coffee"
      problemDescription={[
        "Most cafes serve coffee from the same handful of roasters. The same bags, the same branding, the same flavour profile as the shop next door. Your customers can't tell the difference — because there isn't one.",
        "With Ghost Roastery, you get a custom roast profile developed for your cafe, packed in bags with your branding. Your customers see your name, your story, your identity. Nobody knows we roasted it.",
        "You also get wholesale pricing, flexible delivery schedules, and a dedicated account manager. No contracts, no lock-in — just great coffee with your name on it.",
      ]}
      features={[
        { icon: Coffee, title: "Custom Roast Profile", description: "Developed for your cafe's palate and service style" },
        { icon: Palette, title: "Your Branding", description: "Your logo, your colours, your story on every bag" },
        { icon: Package, title: "Retail-Ready Bags", description: "250g and 1kg options, sealed with freshness valve" },
        { icon: ArrowsClockwise, title: "Flexible Scheduling", description: "Weekly, fortnightly, or monthly deliveries" },
        { icon: ChatCircle, title: "Account Manager", description: "A single point of contact for orders and support" },
        { icon: ShieldCheck, title: "Consistency Guaranteed", description: "Same profile, same quality, every single batch" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your cafe", description: "Volume, service style, flavour preferences, and whether you want branded or unbranded bags." },
        { step: "02", title: "We develop your profile", description: "Our roasters create a custom blend or single origin matched to your brief. Sample roasts sent for approval." },
        { step: "03", title: "Design your bag", description: "Use our label maker or send us your artwork. We print and apply your label to every bag." },
        { step: "04", title: "Production & delivery", description: "Roasted in small batches, quality checked, and delivered on your schedule. Tracked throughout." },
      ]}
      useCases={[
        { title: "House Blend", description: "Your signature coffee — served in-store and sold as retail bags" },
        { title: "Seasonal Specials", description: "Limited edition roasts for Christmas, summer, or local events" },
        { title: "Multi-Site Supply", description: "Consistent quality across all your locations" },
        { title: "Retail Sales", description: "Sell branded bags alongside your coffee service" },
        { title: "Gift Sets", description: "Branded coffee gift boxes for loyal customers" },
        { title: "Subscription Packs", description: "Offer a monthly coffee subscription under your brand" },
      ]}
      faqs={[
        { question: "What's the minimum order?", answer: "150 bags per order for wholesale. For smaller quantities (25–99 bags), check out our branded coffee service." },
        { question: "Can I choose my own roast profile?", answer: "Yes. We'll develop a profile to your spec — or recommend one based on your brief." },
        { question: "How fast is delivery?", answer: "7–10 working days for new orders. Recurring orders can be faster with pre-agreed schedules." },
        { question: "Do you supply ground coffee as well?", answer: "Yes — we can supply whole bean or ground to your specification." },
      ]}
    />
  );
}
