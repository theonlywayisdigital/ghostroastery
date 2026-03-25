import { Metadata } from "next";
import { BrandedCoffeeSubPageTemplate } from "@/components/branded-coffee";
import {
  Coffee,
  Package,
  Palette,
  PaintBrush,
  Heart,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wedding Coffee Favours — Custom Branded Coffee Bags | Ghost Roastery",
  description:
    "Design beautiful custom coffee bags as wedding favours. Your names, your date, your design — created with our online label maker. From 25 bags, delivered to your door.",
  openGraph: {
    title: "Wedding Coffee Favours | Ghost Roastery",
    description:
      "Custom coffee bags as wedding favours. Design them yourself with our online label maker. From 25 bags.",
    url: "https://ghostroastery.com/branded-coffee/for-weddings",
  },
};

export default function BrandedCoffeeForWeddingsPage() {
  return (
    <BrandedCoffeeSubPageTemplate
      heroHeadline="The wedding favour"
      heroAccent="guests actually keep."
      heroDescription="Design custom coffee bags with your names, your date, and your style. Use our online label maker, pick your roast, and order from just 25 bags. A favour people will genuinely enjoy."
      heroImage="/images/wholesale/wedding.jpg"
      whyTitle="Why couples are choosing coffee favours"
      whyDescription={[
        "Let's be honest — most wedding favours get left on the table. Sugared almonds, mini candles, tiny bottles of something nobody opens. They cost you money and end up in the bin.",
        "Coffee is different. Everyone drinks it. A beautifully designed bag with your names and wedding date feels personal, useful, and memorable. It sits on their kitchen counter for weeks — a daily reminder of your day.",
        "With our online label maker, you design the bags yourself. Upload a photo, add your names and date, choose your colours. Pick a roast, order from 25 bags, and we deliver them to your door or venue. You do everything online — no back-and-forth with a designer.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "Genuinely excellent coffee — not a token gesture" },
        { icon: PaintBrush, title: "Design It Yourself", description: "Use our label maker to create your custom favour design online" },
        { icon: Palette, title: "Fully Personalised", description: "Your names, date, colours, photo, or wedding logo on every bag" },
        { icon: Package, title: "From 25 Bags", description: "Intimate dinner or 200-guest celebration — order what you need" },
        { icon: Heart, title: "A Favour They'll Use", description: "Something guests will genuinely enjoy, not throw away" },
        { icon: ShieldCheck, title: "Freshly Roasted", description: "Roasted close to your date for maximum freshness" },
      ]}
      howItWorks={[
        { step: "01", title: "Design your favour", description: "Open our free label maker and create your bag design. Add your names, date, a photo — whatever you like." },
        { step: "02", title: "Pick your coffee", description: "Choose from our specialty-grade single origins and blends. Something every guest will enjoy." },
        { step: "03", title: "Place your order", description: "Order online from 25 bags. Pay by card. No complicated quotes or back-and-forth." },
        { step: "04", title: "Delivered to your door", description: "Roasted fresh, packed, and delivered to your home or venue in 7–10 working days." },
      ]}
      useCases={[
        { title: "Table Favours", description: "A bag at every place setting — personal and practical" },
        { title: "Welcome Bags", description: "Include in hotel welcome bags for guests travelling to your wedding" },
        { title: "Thank You Gifts", description: "Post-wedding gifts for the bridal party and helpers" },
        { title: "Engagement Party", description: "Branded coffee for your engagement celebration" },
        { title: "Morning-After Brunch", description: "Serve your own blend at the day-after brunch" },
        { title: "Hen & Stag Do", description: "Custom coffee bags as party bag fillers" },
      ]}
      faqs={[
        { question: "What's the minimum order?", answer: "Just 25 bags. Perfect for intimate weddings. Order as many as you need for bigger celebrations." },
        { question: "Can I design the label myself?", answer: "Yes — that's the whole point. Our free label maker lets you design your bags online in minutes. Upload photos, add text, pick colours." },
        { question: "How far ahead should I order?", answer: "We recommend 2–3 weeks before your date. We roast close to the event for maximum freshness." },
        { question: "What bag sizes work best for favours?", answer: "Our builder offers multiple sizes. Smaller bags work perfectly for table favours, larger ones for welcome bags and thank-you gifts." },
      ]}
    />
  );
}
