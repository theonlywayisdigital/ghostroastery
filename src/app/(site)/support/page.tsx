import { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { customerSupportPageQuery } from "@/sanity/lib/queries";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { Envelope, ChatCircle, BookOpen } from "@phosphor-icons/react/dist/ssr";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Support | Ghost Roastery",
  description:
    "Need help? Get in touch with the Ghost Roastery team. We're here to help with orders, branding, and everything in between.",
  openGraph: {
    title: "Support | Ghost Roastery",
    description:
      "Need help? Get in touch with the Ghost Roastery team.",
    url: "https://roasteryplatform.com/support",
  },
};

const supportOptions = [
  {
    icon: Envelope,
    title: "Email Us",
    description:
      "Drop us an email and we'll get back to you within 24 hours.",
    cta: "Contact Us",
    href: "/contact",
  },
  {
    icon: ChatCircle,
    title: "Live Chat",
    description:
      "Chat with our team during business hours for quick answers.",
    cta: "Coming Soon",
    href: "#",
    disabled: true,
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description:
      "Browse guides, FAQs, and tutorials to find answers fast.",
    cta: "Coming Soon",
    href: "#",
    disabled: true,
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, React.ComponentType<any>> = {
  Envelope,
  ChatCircle,
  BookOpen,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSupportPageContent(): Promise<any> {
  try {
    return await client.fetch(customerSupportPageQuery);
  } catch {
    return null;
  }
}

export default async function SupportPage() {
  const cms = await getSupportPageContent();

  const resolvedOptions = cms?.supportOptions?.length
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cms.supportOptions.map((opt: any) => ({
        ...opt,
        icon: iconMap[opt.icon || ""] || Envelope,
      }))
    : supportOptions;

  return (
    <>
      <Section className="pt-24 md:pt-32 pb-16 md:pb-20">
        <FadeIn>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
              {cms?.heroHeadline ?? (
                <>
                  How can we{" "}
                  <span className="text-accent">help?</span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-300">
              {cms?.heroSubheadline ??
                "Whether it's about your order, your brand, or just a question \u2014 we're here for you."}
            </p>
          </div>
        </FadeIn>
      </Section>

      <Section dark>
        <FadeIn>
          <SectionHeader title={cms?.optionsTitle ?? "Get in touch"} />
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resolvedOptions.map((item: typeof supportOptions[number], index: number) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.title} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                    <Icon weight="duotone" size={40} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-neutral-400 mb-4">{item.description}</p>
                  {item.disabled ? (
                    <span className="text-sm text-neutral-500 font-medium">
                      {item.cta}
                    </span>
                  ) : (
                    <Link href={item.href}>
                      <Button variant="outline" size="sm">
                        {item.cta}
                      </Button>
                    </Link>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Section>
    </>
  );
}
