import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  ArrowsClockwise,
  ChatCircle,
  ForkKnife,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Wholesale Coffee for Restaurants — Own Brand Coffee Supply | Ghost Roastery",
  description:
    "Serve your own branded coffee as the final course. Specialty grade, custom roast profiles, flexible delivery. Elevate the dining experience with your name on the bag.",
  openGraph: {
    title: "Wholesale Coffee for Restaurants | Ghost Roastery",
    description:
      "Your brand on the last thing guests taste. Wholesale branded coffee for restaurants and hospitality.",
    url: "https://ghostroastery.com/wholesale/for-restaurants",
  },
};

export default function WholesaleForRestaurantsPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="The last thing your guests taste"
      heroAccent="should be yours."
      heroImage="/images/wholesale/restaurant.jpg"
      heroDescription="Coffee is the final impression your restaurant makes. Serve your own branded specialty coffee — and make sure guests leave remembering your name, not a roaster's."
      problemTitle="Why restaurants are branding their coffee"
      problemDescription={[
        "You control every detail of the dining experience — the menu, the wine list, the ambience. But when coffee arrives, most restaurants hand the stage to someone else's brand.",
        "With your own branded coffee, the final course reinforces your identity. Guests see your name, taste specialty-grade quality, and associate that last impression with your restaurant.",
        "We handle the roasting, branding, and delivery. You get a premium product that completes the dining experience — without the complexity of sourcing and roasting yourself.",
      ]}
      features={[
        { icon: Coffee, title: "Custom Roast Profile", description: "Developed for your restaurant's style and palate" },
        { icon: Palette, title: "Your Branding", description: "Your restaurant name and identity on every bag" },
        { icon: Package, title: "Multiple Formats", description: "Whole bean, ground, or espresso — your choice" },
        { icon: ArrowsClockwise, title: "Flexible Scheduling", description: "Weekly or fortnightly deliveries to match your covers" },
        { icon: ChatCircle, title: "Account Manager", description: "A single point of contact for your orders" },
        { icon: ForkKnife, title: "Menu Integration", description: "Coffee that complements your food offering" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your restaurant", description: "Covers, service style, espresso or filter, and what kind of coffee experience you want to offer." },
        { step: "02", title: "We develop your profile", description: "A roast profile that complements your menu. Samples sent for tasting and approval." },
        { step: "03", title: "Design your bag", description: "Your restaurant name and branding on every bag — for service and retail." },
        { step: "04", title: "Production & delivery", description: "Roasted in small batches, quality checked, and delivered on your schedule." },
      ]}
      useCases={[
        { title: "After-Dinner Service", description: "Branded coffee served as the final course" },
        { title: "Retail Bags", description: "Sell branded bags at the counter or reception" },
        { title: "Takeaway Coffee", description: "Extend your brand beyond the dining room" },
        { title: "Gift With Purchase", description: "Include a bag of your coffee with large bookings" },
        { title: "Private Events", description: "Branded coffee for private dining and functions" },
        { title: "Multi-Site Consistency", description: "Same quality and brand across all locations" },
      ]}
      faqs={[
        { question: "What's the minimum order?", answer: "150 bags per order for wholesale. For smaller quantities (25–99 bags), check out our branded coffee service." },
        { question: "Can you match our espresso profile?", answer: "Yes. We'll develop a profile to your spec — or recommend one based on your equipment and serving style." },
        { question: "Do you supply espresso beans?", answer: "Yes — we can supply single origins or blends optimised for espresso extraction." },
        { question: "How fast is delivery?", answer: "7–10 working days for new orders. Recurring orders can be scheduled for faster turnaround." },
      ]}
    />
  );
}
