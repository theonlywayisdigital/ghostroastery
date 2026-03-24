import { Metadata } from "next";
import { BrandedCoffeeSubPageTemplate } from "@/components/branded-coffee";
import {
  Coffee,
  Package,
  Palette,
  PaintBrush,
  ShieldCheck,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Gyms & Fitness Studios — Ghost Roastery",
  description:
    "Create your own branded coffee to sell at your gym. Design your label online, pick your roast, and order from just 25 bags. Delivered in 7–10 working days.",
  openGraph: {
    title: "Branded Coffee for Gyms & Fitness Studios | Ghost Roastery",
    description:
      "Launch your own branded coffee line for your gym or studio. Design it yourself with our online builder. From 25 bags.",
    url: "https://roasteryplatform.com/branded-coffee/for-gyms",
  },
};

export default function BrandedCoffeeForGymsPage() {
  return (
    <BrandedCoffeeSubPageTemplate
      heroHeadline="Your gym."
      heroAccent="Your coffee brand."
      heroDescription="Design your own branded coffee to sell at reception, stock in your shop, or include in membership packs. Use our online builder, pick your roast, and order from just 25 bags."
      heroImage="/images/wholesale/gym.jpg"
      whyTitle="Why gyms are launching their own coffee brands"
      whyDescription={[
        "Your members are already buying coffee before and after every session — just not from you. They walk past your front desk and straight to the chain next door.",
        "With Ghost Roastery, you design your own branded coffee bags online using our label maker. Pick your roast profile, upload your logo, choose your colours — then order as few as 25 bags. No middlemen, no minimums in the thousands.",
        "Put them on the front desk, add them to your online shop, or bundle them with memberships. You set the price, you keep the margin. We just roast, pack, and deliver.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "SCA 80+ scored beans your health-conscious members will appreciate" },
        { icon: PaintBrush, title: "Design It Yourself", description: "Use our online label maker to design your bags — no designer needed" },
        { icon: Palette, title: "Your Branding", description: "Your logo, your colours, your gym's identity on every bag" },
        { icon: Package, title: "From 25 Bags", description: "No huge minimums — start with 25 bags and reorder when you sell out" },
        { icon: Storefront, title: "Retail-Ready", description: "Sealed with a freshness valve, labelled and ready to sell" },
        { icon: ShieldCheck, title: "Consistent Quality", description: "Same roast, same taste, every batch guaranteed" },
      ]}
      howItWorks={[
        { step: "01", title: "Design your label", description: "Open our free label maker and create your bag design. Add your gym logo, pick your colours, write your brand story." },
        { step: "02", title: "Pick your roast", description: "Choose from our specialty-grade single origins and blends. Every bean scores 80+ on the SCA scale." },
        { step: "03", title: "Place your order", description: "Order online from just 25 bags. Pay by card. No contracts, no commitments." },
        { step: "04", title: "Sell at your gym", description: "We roast, pack, and deliver to your door in 7–10 working days. Stock the desk, fill your shelves, start selling." },
      ]}
      useCases={[
        { title: "Reception Sales", description: "Branded bags at the front desk — grab-and-go for members" },
        { title: "Membership Bundles", description: "Include a bag of coffee in premium membership sign-up packs" },
        { title: "Online Shop", description: "Sell your branded coffee through your gym's website or app" },
        { title: "Challenge Prizes", description: "Use branded coffee bags as fitness challenge rewards" },
        { title: "Vending Area", description: "Stock your branded coffee alongside shakes and supplements" },
        { title: "Gift Cards & Merch", description: "Pair branded coffee with gym merchandise for gifting" },
      ]}
      faqs={[
        { question: "What's the minimum order?", answer: "Just 25 bags. No wholesale minimums — order what you need and reorder when you sell out." },
        { question: "Can I design the label myself?", answer: "Yes — our free online label maker lets you design your bag in minutes. Upload your logo, choose your colours, and preview before ordering." },
        { question: "Do I need to commit to recurring orders?", answer: "No. Order whenever you need to. There are no contracts, subscriptions, or lock-ins." },
        { question: "How long does delivery take?", answer: "7–10 working days from when you place your order. We roast fresh for every order." },
      ]}
    />
  );
}
