import { Metadata } from "next";
import { WholesaleSubPageTemplate } from "@/components/wholesale";
import {
  Coffee,
  Package,
  Palette,
  Gift,
  CalendarBlank,
  Heart,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee for Events & Weddings — Custom Coffee Favours | Ghost Roastery",
  description:
    "Personalised coffee bags for weddings, corporate events, and celebrations. Custom labels, specialty grade, from 25 bags. A favour your guests will actually keep.",
  openGraph: {
    title: "Branded Coffee for Events & Weddings | Ghost Roastery",
    description:
      "Personalised coffee favours your guests will actually keep. Custom branded bags for weddings and events.",
    url: "https://ghostroastery.com/wholesale/for-events",
  },
};

export default function WholesaleForEventsPage() {
  return (
    <WholesaleSubPageTemplate
      heroHeadline="Coffee favours"
      heroAccent="guests actually keep."
      heroDescription="Personalised coffee bags for weddings, corporate events, and celebrations. Your names or brand on every bag, specialty coffee inside, and a gift people will genuinely enjoy."
      problemTitle="Most wedding favours end up in the bin"
      problemDescription={[
        "Let's be honest: sugared almonds, mini candles, and novelty keyrings don't get taken home. They end up on the table, in the bin, or worse — politely declined.",
        "Coffee is different. It's useful, it's premium, and it's personal. A custom-labelled bag of specialty coffee is a favour your guests will actually take home, brew, and remember.",
        "We handle the roasting, the labelling, and the delivery. You choose the design — couple's names, wedding date, a message — and we make it happen. Available from just 25 bags.",
      ]}
      features={[
        { icon: Coffee, title: "Specialty Grade", description: "Genuinely great coffee — not a token gesture" },
        { icon: Palette, title: "Custom Labels", description: "Names, dates, messages — whatever you want on the bag" },
        { icon: Package, title: "Favour-Sized Bags", description: "50g and 100g bags perfect for place settings" },
        { icon: Gift, title: "Gift-Ready", description: "Beautiful packaging that works as a standalone gift" },
        { icon: CalendarBlank, title: "Event Timing", description: "We'll work to your event date with time to spare" },
        { icon: Heart, title: "Personal Touch", description: "A favour that says something about who you are" },
      ]}
      howItWorks={[
        { step: "01", title: "Tell us about your event", description: "Date, guest count, and the vibe. Wedding? Corporate dinner? Product launch? We've done them all." },
        { step: "02", title: "Design your label", description: "Use our label maker or send us your artwork. Names, logos, dates, messages — your call." },
        { step: "03", title: "We roast and pack", description: "Specialty coffee roasted, packed in your labelled bags, and quality checked." },
        { step: "04", title: "Delivered before your event", description: "Shipped with plenty of lead time. Tracked delivery so you're never guessing." },
      ]}
      useCases={[
        { title: "Wedding Favours", description: "Personalised bags with couple's names and date" },
        { title: "Corporate Events", description: "Branded coffee as delegate gifts or table favours" },
        { title: "Product Launches", description: "Custom coffee to accompany a brand launch or reveal" },
        { title: "Birthday & Anniversary", description: "Personalised bags as party favours or gifts" },
        { title: "Christmas Gifts", description: "Branded or personalised bags for festive gifting" },
        { title: "Thank You Gifts", description: "A thoughtful way to say thanks to clients, staff, or guests" },
      ]}
      faqs={[
        { question: "What's the minimum order for events?", answer: "25 bags — perfect for smaller gatherings. For larger events (150+ bags), you'll benefit from our wholesale pricing." },
        { question: "How far in advance should I order?", answer: "We recommend at least 3 weeks before your event date. Rush orders may be possible — get in touch to check." },
        { question: "Can I see a sample first?", answer: "Yes — we can send a sample bag so you can check the label and taste the coffee before committing." },
        { question: "What bag sizes are available?", answer: "50g and 100g for favours, 250g for larger gifts. All sealed with a freshness valve." },
      ]}
    />
  );
}
