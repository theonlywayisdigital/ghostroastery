import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { TileCard } from "@/components/ui/Card";
import { Accordion } from "@/components/ui/Accordion";
import {
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PhosphorIcon = React.ComponentType<any>;

interface WholesaleSubPageProps {
  heroHeadline: string;
  heroAccent: string;
  heroDescription: string;
  problemTitle: string;
  problemDescription: string[];
  features: { icon: PhosphorIcon; title: string; description: string }[];
  howItWorks: { step: string; title: string; description: string }[];
  useCases: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export function WholesaleSubPageTemplate({
  heroHeadline,
  heroAccent,
  heroDescription,
  problemTitle,
  problemDescription,
  features,
  howItWorks,
  useCases,
  faqs,
}: WholesaleSubPageProps) {
  return (
    <>
      {/* Hero */}
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {heroHeadline}{" "}
              <span className="text-accent">{heroAccent}</span>
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300 mb-8">
              {heroDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/wholesale#enquiry">
                <Button variant="primary" size="lg">
                  Get a Wholesale Quote
                </Button>
              </Link>
              <Link href="/wholesale">
                <Button variant="outline" size="lg">
                  All Wholesale Services
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* The Problem */}
      <Section dark>
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            <SectionHeader title={problemTitle} align="left" />
            <div className="space-y-6 text-lg text-neutral-300">
              {problemDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </FadeIn>
      </Section>

      {/* What You Get */}
      <Section>
        <FadeIn>
          <SectionHeader title="What you get" />
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <FadeIn key={feature.title} delay={index * 0.1}>
                <TileCard
                  icon={<Icon size={28} weight="duotone" />}
                  title={feature.title}
                  description={feature.description}
                />
              </FadeIn>
            );
          })}
        </div>
      </Section>

      {/* How It Works */}
      <Section dark>
        <FadeIn>
          <SectionHeader title="How it works" />
        </FadeIn>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {howItWorks.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-accent">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-neutral-400">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Section>

      {/* Use Cases */}
      {useCases.length > 0 && (
        <Section>
          <FadeIn>
            <SectionHeader title="Popular use cases" />
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {useCases.map((useCase, index) => (
              <FadeIn key={useCase.title} delay={index * 0.1}>
                <TileCard title={useCase.title} description={useCase.description} />
              </FadeIn>
            ))}
          </div>
        </Section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section dark>
          <FadeIn>
            <SectionHeader title="Frequently asked questions" />
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="max-w-3xl mx-auto">
              <Accordion items={faqs} />
            </div>
          </FadeIn>
        </Section>
      )}

      {/* CTA */}
      <Section className="py-20 md:py-32">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Ready to get started?
            </h2>
            <p className="text-lg text-neutral-300 mb-8 max-w-xl mx-auto">
              Tell us about your business and we&apos;ll put together a custom
              wholesale package. No commitment, no pressure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/wholesale#enquiry">
                <Button variant="primary" size="lg">
                  Get a Wholesale Quote
                </Button>
              </Link>
              <Link href="/branded-coffee">
                <Button variant="outline" size="lg">
                  Smaller Orders (25+ bags)
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
