import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  ArrowsClockwise,
  ChatCircle,
  Star,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Hotels — In-Room Coffee Supply | Ghost Roastery",
  description:
    "Elevate the guest experience with your own branded in-room coffee. Specialty grade, custom packaging, delivered to your hotel. From 150 bags.",
  openGraph: {
    title: "Branded Coffee for Hotels | Ghost Roastery",
    description:
      "Branded in-room coffee that elevates the guest experience. Specialty grade wholesale supply for hotels.",
    url: "https://ghostroastery.com/wholesale/for-hotels",
  },
};

export default function WholesaleForHotelsPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="The in-room coffee"
      heroAccent="guests actually remember."
      heroDescription="Replace generic sachets with your own branded specialty coffee. Your hotel name on every bag, quality your guests will notice, and wholesale pricing that works."
      problemTitle="Generic in-room coffee is a missed opportunity"
      problemDescription={[
        "Most hotels offer the same forgettable instant sachets or pod machines. Guests expect better — and they notice when the details are right. Coffee is one of the first things they reach for.",
        "With your own branded coffee in every room, you turn a commodity into a brand touchpoint. Guests see your name, taste specialty-grade coffee, and associate that quality with your hotel.",
        "We handle the roasting, branding, and delivery. You get a premium product that enhances the guest experience and reinforces your brand — without the complexity of running a coffee operation.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "SCA 80+ beans — not commodity coffee in a branded wrapper" },
        { icon: Palette, title: "Hotel Branding", description: "Your logo and brand identity on every bag" },
        { icon: Package, title: "Room-Ready Packaging", description: "Compact 50g, 100g, or 250g bags for in-room use" },
        { icon: ArrowsClockwise, title: "Scheduled Delivery", description: "Regular deliveries matched to your occupancy patterns" },
        { icon: ChatCircle, title: "Account Manager", description: "A single contact for your orders, reorders, and questions" },
        { icon: Star, title: "Guest Experience", description: "A detail guests notice, remember, and mention in reviews" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your hotel", description: "Room count, occupancy patterns, and what kind of coffee experience you want to offer." },
        { step: "02", title: "We create your blend", description: "A profile developed for in-room brewing. Approachable, consistent, and crowd-pleasing." },
        { step: "03", title: "Design your packaging", description: "Compact branded bags or sachets designed for the in-room setting." },
        { step: "04", title: "Delivered on schedule", description: "Recurring deliveries matched to your needs. Tracked, reliable, always fresh." },
      ]}
      useCases={[
        { title: "In-Room Coffee", description: "Branded bags or sachets placed in every guest room" },
        { title: "Welcome Packs", description: "Premium coffee included in VIP or loyalty guest welcome hampers" },
        { title: "Restaurant & Lounge", description: "Serve your branded coffee in the restaurant, bar, and lounge" },
        { title: "Minibar Upsell", description: "Sell premium bags in the minibar or gift shop" },
        { title: "Conference & Events", description: "Branded coffee for meeting rooms and conference facilities" },
        { title: "Turn-Down Gift", description: "A small bag of your branded coffee as a turn-down amenity" },
      ]}
      faqs={[
        { question: "What sizes work for hotels?", answer: "We offer 50g, 100g, and 250g bags. Most hotels use 50g or 100g for in-room, and 250g for retail or gift shop." },
        { question: "Can you match our brand guidelines?", answer: "Absolutely. Send us your brand pack and we'll design packaging that's consistent with your identity." },
        { question: "What's the minimum order?", answer: "150 bags per order. We can schedule recurring deliveries to keep your stock fresh." },
        { question: "Is the coffee suitable for all brewing methods?", answer: "Yes — we can supply whole bean or ground to suit cafetières, filter machines, or pour-over." },
      ]}
    />
  );
}
