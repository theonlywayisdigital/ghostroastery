"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <Section dark className="py-20 md:py-32">
      <FadeIn>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-8">
            Ready to launch your coffee brand?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/build">
              <Button variant="primary" size="lg">
                Build Your Brand
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Get in Touch
              </Button>
            </Link>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
