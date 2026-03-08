import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  ArrowsClockwise,
  CurrencyGbp,
  Barbell,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Gyms — Own Brand Coffee Supply | Ghost Roastery",
  description:
    "Add a high-margin revenue stream with your own branded coffee. Sell at reception, in the cafe, or online. Specialty grade, your brand, wholesale pricing.",
  openGraph: {
    title: "Branded Coffee for Gyms | Ghost Roastery",
    description:
      "A revenue stream your members will love. Own brand coffee for gyms and fitness brands.",
    url: "https://ghostroastery.com/wholesale/for-gyms",
  },
};

export default function WholesaleForGymsPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="A revenue stream"
      heroAccent="your members will love."
      heroDescription="Sell your own branded coffee at reception, in the cafe, or through your app. Specialty grade, high margin, and a product your members actually want."
      problemTitle="Why gyms are adding coffee"
      problemDescription={[
        "Your members are already buying coffee before and after their workout — just not from you. A branded coffee range turns that habit into revenue for your business.",
        "It's not about becoming a coffee shop. It's about offering a premium product that aligns with your brand — health-conscious, quality-focused, and exclusively yours.",
        "We handle everything: the roasting, the branding, the packaging. You sell it at reception, in the vending area, or ship it through your online store. High margin, low effort.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "Quality your health-conscious members expect" },
        { icon: Palette, title: "Your Gym's Branding", description: "Your logo and identity on every bag" },
        { icon: Package, title: "Retail-Ready Bags", description: "250g bags, sealed and shelf-ready" },
        { icon: CurrencyGbp, title: "High Margins", description: "Wholesale cost, retail price — the maths works" },
        { icon: Barbell, title: "Brand Alignment", description: "A product that fits your gym's identity" },
        { icon: ArrowsClockwise, title: "Easy Reorders", description: "Reorder when you need to — no contracts" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your gym", description: "Member count, brand vibe, and where you plan to sell (reception, cafe, online, all three)." },
        { step: "02", title: "We create your blend", description: "A crowd-pleasing specialty blend that your members will love. Samples sent for approval." },
        { step: "03", title: "Design your bag", description: "Your logo, your colours, your gym's identity on every bag." },
        { step: "04", title: "Stock and sell", description: "Delivered to your door. Display at reception, add to your app, or ship to members directly." },
      ]}
      useCases={[
        { title: "Reception Sales", description: "Display bags at the front desk for post-workout purchase" },
        { title: "In-Gym Cafe", description: "Serve and sell your branded coffee in the cafe area" },
        { title: "Online Store", description: "Add coffee to your merch store for nationwide delivery" },
        { title: "Membership Perks", description: "Include a bag of coffee in welcome packs or loyalty rewards" },
        { title: "Corporate Gifting", description: "Branded coffee as gifts for corporate members or partners" },
        { title: "Protein & Coffee Bundles", description: "Bundle with protein or supplements for a premium package" },
      ]}
      faqs={[
        { question: "How much can I sell coffee for?", answer: "Most gyms retail 250g bags at £10–£14. At wholesale cost, that's a healthy margin on every bag." },
        { question: "Do I need to know anything about coffee?", answer: "No. We develop the blend, design the bag, and handle the logistics. You just sell it." },
        { question: "What's the minimum order?", answer: "150 bags for wholesale. For a smaller test run (25–99 bags), try our branded coffee service." },
        { question: "Can I sell it online?", answer: "Absolutely. Many gym brands add coffee to their existing online stores." },
      ]}
    />
  );
}
