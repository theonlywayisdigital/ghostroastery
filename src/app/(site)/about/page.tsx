import { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { Coffee, Leaf, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Ghost Roastery",
  description:
    "We're a UK-based ghost roasting service helping businesses launch and grow their own coffee brands. Specialty grade, small batch, ethically sourced.",
  openGraph: {
    title: "About Us | Ghost Roastery",
    description:
      "We're a UK-based ghost roasting service helping businesses launch and grow their own coffee brands.",
    url: "https://ghostroastery.com/about",
  },
};

const values = [
  {
    icon: Coffee,
    title: "Specialty Grade Only",
    description:
      "We only roast beans that meet specialty grade standards. No compromises.",
  },
  {
    icon: Leaf,
    title: "Ethically Sourced",
    description:
      "Every bean is sourced from farms that share our values. Quality starts at origin.",
  },
  {
    icon: Clock,
    title: "Small Batch Always",
    description:
      "We roast in small batches every week. Fresher coffee, better flavour.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              Specialty coffee.{" "}
              <span className="text-accent">Ghost roasted.</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              We&apos;re a UK-based ghost roasting service helping businesses
              launch and grow their own coffee brands.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Our Story */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="Why we built this" align="left" />
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="max-w-3xl space-y-6 text-lg text-neutral-300">
            <p>
              Coffee is one of the most consumed products in the world. But
              launching a coffee brand has always meant either owning a roastery
              or compromising on quality. We built Ghost Roastery to change
              that.
            </p>
            <p>
              Our partner roastery has been roasting specialty coffee for years.
              Small batches, ethically sourced beans, proper craft. We opened up
              that capability so that any business — a gym, a café, a wellness
              brand — can put their name on a bag of genuinely great coffee.
            </p>
            <p>
              We proved the model worked by building our own brand first. Off
              Your Bean is a real, live, shoppable coffee brand built entirely
              through Ghost Roastery. If we can do it for ourselves, we can
              do it for you.
            </p>
          </div>
        </FadeIn>
      </Section>

      {/* Our Values */}
      <Section>
        <FadeIn>
          <SectionHeader title="What we stand for" />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <FadeIn key={value.title} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-neutral-400">{value.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Off Your Bean Callout */}
      <Section dark className="py-16 md:py-20">
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Want to see the proof?
            </h2>
            <p className="text-neutral-400 mb-6">
              Off Your Bean is our own coffee brand, built using the exact same
              service we offer you. From concept to live store in under two
              weeks.
            </p>
            <Link href="/brands/off-your-bean">
              <Button variant="outline">See the case study</Button>
            </Link>
          </div>
        </FadeIn>
      </Section>
    </>
  );
}
