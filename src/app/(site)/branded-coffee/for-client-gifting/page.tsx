import { Metadata } from "next";
import { BrandedCoffeeSubPageTemplate } from "@/components/branded-coffee";
import {
  Coffee,
  Package,
  Palette,
  PaintBrush,
  ShieldCheck,
  Gift,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Client Gifting — Corporate Gifts | Ghost Roastery",
  description:
    "Create premium branded coffee as corporate gifts. Design your bags online with our label maker, add your company logo, and order from 25 bags. Delivered in 7–10 days.",
  openGraph: {
    title: "Branded Coffee for Client Gifting | Ghost Roastery",
    description:
      "Premium branded coffee as corporate gifts. Design your bags online. Your logo on every bag. From 25 bags.",
    url: "https://roasteryplatform.com/branded-coffee/for-client-gifting",
  },
};

export default function BrandedCoffeeForClientGiftingPage() {
  return (
    <BrandedCoffeeSubPageTemplate
      heroHeadline="Corporate gifts"
      heroAccent="they'll actually use."
      heroDescription="Design branded coffee bags with your company logo using our online builder. Pick your roast, order from just 25 bags, and have them delivered to your office. Premium gifts, zero fuss."
      heroImage="/images/wholesale/gifting.jpg"
      whyTitle="Why branded coffee beats every other corporate gift"
      whyDescription={[
        "Branded pens, notebooks, and water bottles. Your clients have a drawer full of them. Most corporate gifts end up forgotten because they're generic and impersonal.",
        "Coffee is different. It's consumable, universally appreciated, and used daily. A bag of specialty coffee with your company branding feels premium without being flashy. It says 'we thought about this.'",
        "With our online label maker, you design the bags yourself in minutes. Upload your logo, choose your colours, add a message. Pick a roast, order from 25 bags, and we deliver to your office. No designers, no agencies, no long lead times.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "SCA 80+ scored beans — a genuinely premium gift" },
        { icon: PaintBrush, title: "Design It Online", description: "Use our label maker to add your branding — takes minutes, not weeks" },
        { icon: Palette, title: "Your Company Branding", description: "Your logo, colours, and messaging on every bag" },
        { icon: Package, title: "From 25 Bags", description: "Small client list or company-wide — order exactly what you need" },
        { icon: Gift, title: "A Gift They'll Actually Use", description: "Consumable, premium, and sits on their counter for weeks" },
        { icon: ShieldCheck, title: "Freshly Roasted", description: "Roasted to order for maximum freshness on arrival" },
      ]}
      howItWorks={[
        { step: "01", title: "Design your gift bags", description: "Open our label maker and add your company branding. Upload your logo, pick colours, add a festive or personal touch." },
        { step: "02", title: "Pick your roast", description: "Choose from our specialty-grade single origins and blends. A crowd-pleaser for every palate." },
        { step: "03", title: "Place your order", description: "Order online from 25 bags. Pay by card. No quotes, no waiting, no minimum spend." },
        { step: "04", title: "Send to your team or clients", description: "Delivered to your office in 7–10 working days. Distribute them yourself or we can ship to your office for onward distribution." },
      ]}
      useCases={[
        { title: "Client Thank-You", description: "A premium gift to thank clients for their business" },
        { title: "New Client Welcome", description: "Send branded coffee as a memorable onboarding gift" },
        { title: "Employee Rewards", description: "Branded coffee in welcome packs or milestone rewards" },
        { title: "Christmas Gifts", description: "Annual branded coffee gift for your client or team list" },
        { title: "Event Giveaways", description: "Hand out branded bags at trade shows and conferences" },
        { title: "Referral Rewards", description: "Thank people who refer new business with a branded coffee gift" },
      ]}
      faqs={[
        { question: "What's the minimum order?", answer: "25 bags. Perfect for a small client list. Order more for bigger teams or company-wide gifting." },
        { question: "Can I design the bags myself?", answer: "Yes — our free online label maker lets you design your bags in minutes. Upload your logo, choose colours, add a message." },
        { question: "How quickly can I get them?", answer: "7–10 working days from when you place your order. We roast fresh for every order." },
        { question: "Can I reorder the same design?", answer: "Yes. Your designs are saved in your account so you can reorder with one click." },
      ]}
    />
  );
}
