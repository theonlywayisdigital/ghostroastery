"use client";

import {
  BuilderProvider,
  BuilderShell,
  useBuilder,
  BagSize,
  BagColour,
  RoastProfile,
  GrindOption,
  PricingTier,
  SiteSettings,
} from "@/components/builder";
import {
  Step1Size,
  Step2Colour,
  Step3Label,
  Step4RoastProfile,
  Step5Grind,
  Step6Quantity,
  Step7Summary,
  Step8MockCheckout,
  Step9MockConfirmation,
} from "@/components/builder/steps";

interface BuilderClientProps {
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingTiers: PricingTier[];
  siteSettings: SiteSettings;
}

function BuilderSteps() {
  const { state } = useBuilder();

  switch (state.currentStep) {
    case 1:
      return <Step1Size />;
    case 2:
      return <Step2Colour />;
    case 3:
      return <Step3Label />;
    case 4:
      return <Step4RoastProfile />;
    case 5:
      return <Step5Grind />;
    case 6:
      return <Step6Quantity />;
    case 7:
      return <Step7Summary />;
    case 8:
      return <Step8MockCheckout />;
    case 9:
      return <Step9MockConfirmation />;
    default:
      return <Step1Size />;
  }
}

export function BuilderClient({
  bagSizes,
  bagColours,
  roastProfiles,
  grindOptions,
  pricingTiers,
  siteSettings,
}: BuilderClientProps) {
  return (
    <BuilderProvider
      bagSizes={bagSizes}
      bagColours={bagColours}
      roastProfiles={roastProfiles}
      grindOptions={grindOptions}
      pricingTiers={pricingTiers}
      siteSettings={siteSettings}
    >
      <BuilderShell>
        <BuilderSteps />
      </BuilderShell>
    </BuilderProvider>
  );
}
