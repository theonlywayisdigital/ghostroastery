import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import {
  PaintBrush,
  Coffee,
  Package,
  Truck,
  Barbell,
  CalendarBlank,
  Heart,
  Handshake,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Branded Coffee — Create Your Own Coffee Brand | Ghost Roastery",
  description:
    "Design your own branded coffee bags online. Use our free label maker, pick your roast, and order from 25 bags. Perfect for gyms, events, weddings, and corporate gifting.",
  openGraph: {
    title: "Branded Coffee — Create Your Own Coffee Brand | Ghost Roastery",
    description:
      "Design your own branded coffee bags online. Free label maker, specialty grade beans, from 25 bags.",
    url: "https://ghostroastery.com/branded-coffee",
  },
};

const segments = [
  {
    icon: Barbell,
    title: "Gyms & Fitness",
    description:
      "Sell branded coffee at reception, bundle it with memberships, or stock your gym shop.",
    href: "/branded-coffee/for-gyms",
  },
  {
    icon: CalendarBlank,
    title: "Events",
    description:
      "Branded coffee for conferences, festivals, product launches, and corporate events.",
    href: "/branded-coffee/for-events",
  },
  {
    icon: Heart,
    title: "Weddings",
    description:
      "Personalised coffee favours your guests will actually keep and enjoy.",
    href: "/branded-coffee/for-weddings",
  },
  {
    icon: Handshake,
    title: "Client Gifting",
    description:
      "Branded coffee gifts that leave a lasting impression with clients and partners.",
    href: "/branded-coffee/for-client-gifting",
  },
];

const steps = [
  {
    icon: PaintBrush,
    step: "01",
    title: "Design Your Label",
    description:
      "Use our free label maker or upload your own artwork.",
  },
  {
    icon: Coffee,
    step: "02",
    title: "Pick Your Roast",
    description:
      "Choose from specialty-grade single origins and blends.",
  },
  {
    icon: Package,
    step: "03",
    title: "We Roast & Pack",
    description:
      "Roasted in small batches, packed with your label.",
  },
  {
    icon: Truck,
    step: "04",
    title: "Delivered",
    description:
      "Shipped to your door in 7–10 working days.",
  },
];

export default function BrandedCoffeePage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Your brand{" "}
              <span className="text-accent">on every bag.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8">
              Design your own branded coffee bags online. Use our free label
              maker, pick your roast, and order from just 25 bags. Specialty
              grade, no contracts, delivered in 7–10 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Start Building
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="lg">
                  See How It Works
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* Perfect for */}
      <Section dark>
        <FadeIn>
          <SectionHeader
            title="Perfect for"
            subtitle="Branded coffee works for businesses of every size. Pick your sector to learn more."
          />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {segments.map((segment, index) => {
            const Icon = segment.icon;
            return (
              <FadeIn key={segment.title} delay={index * 0.1}>
                <Link href={segment.href} className="block group">
                  <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-6 text-center transition-all duration-300 hover:border-accent/50 hover:bg-neutral-800">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Icon size={28} weight="duotone" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-accent transition-colors">
                      {segment.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mb-3">
                      {segment.description}
                    </p>
                    <span className="inline-flex items-center text-sm text-accent font-medium">
                      Learn more
                      <ArrowRight weight="bold" size={14} className="ml-1" />
                    </span>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* How it works */}
      <Section>
        <FadeIn>
          <SectionHeader
            title="How it works"
            subtitle="Four steps to your own branded coffee."
          />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <p className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
                    Step {item.step}
                  </p>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-neutral-400">{item.description}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* Final CTA */}
      <Section dark className="py-20 md:py-32">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Start building your brand
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              25 bags. 7–10 days. Specialty grade. Your label.
              No contracts, no commitments — just great coffee with your name on
              it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/build">
                <Button variant="primary" size="lg">
                  Build Your Brand
                </Button>
              </Link>
              <Link href="/wholesale">
                <Button variant="outline" size="lg">
                  Need 150+ bags? Go wholesale
                  <ArrowRight weight="bold" size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
