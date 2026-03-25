import { Metadata } from "next";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { WholesaleForm } from "@/components/wholesale";
import {
  MapPin,
  Coffee,
  ShieldCheck,
  Clock,
  Truck,
  CheckCircle,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title:
    "Request Wholesale Access — Ghost Roastery",
  description:
    "Apply for wholesale access to Ghost Roastery. Specialty grade coffee for cafes, hotels, restaurants, offices, and events. Branded or unbranded, from 150 bags.",
  openGraph: {
    title: "Request Wholesale Access — Ghost Roastery",
    description:
      "Apply for wholesale access. Specialty grade coffee for businesses. Branded or unbranded, from 150 bags.",
    url: "https://ghostroastery.com/wholesale/sign-up",
  },
};

const trustSignals = [
  { icon: MapPin, label: "UK Based Roastery" },
  { icon: Coffee, label: "Specialty Grade Coffee" },
  { icon: ShieldCheck, label: "Food-Safe Packaging" },
  { icon: Clock, label: "Small Batch Weekly Roasts" },
  { icon: Truck, label: "Ships Across the UK" },
  { icon: CheckCircle, label: "Quality Checked Every Batch" },
];

export default function WholesaleSignUpPage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-12 md:pb-16">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Request <span className="text-accent">Wholesale Access</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto">
              Tell us about your business and we&apos;ll put together a custom
              wholesale package. We typically respond within 2 business days.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Trust Signals */}
      <Section className="py-8 md:py-10 border-t border-b border-neutral-800">
        <FadeIn>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {trustSignals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-neutral-200"
                >
                  <Icon
                    weight="duotone"
                    size={24}
                    className="text-accent flex-shrink-0"
                  />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {signal.label}
                  </span>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </Section>

      {/* Form */}
      <Section className="py-16 md:py-20">
        <FadeIn>
          <SectionHeader
            title="Tell us about your business"
            subtitle="Fill in the form below and we'll get back to you with pricing, options, and next steps."
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-2xl mx-auto">
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-2xl p-6 md:p-8">
              <WholesaleForm />
            </div>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
