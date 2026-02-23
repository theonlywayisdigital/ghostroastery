import { client } from "@/sanity/lib/client";
import {
  bagSizesQuery,
  bagColoursQuery,
  roastProfilesQuery,
  grindOptionsQuery,
  pricingTiersQuery,
  siteSettingsQuery,
} from "@/sanity/queries/builder";
import { BuilderClient } from "./BuilderClient";

export const revalidate = 3600; // Revalidate every hour

// Fetch builder data from Sanity
async function getBuilderData() {
  const [bagSizes, bagColours, roastProfiles, grindOptions, pricingTiers, siteSettings] =
    await Promise.all([
      client.fetch(bagSizesQuery),
      client.fetch(bagColoursQuery),
      client.fetch(roastProfilesQuery),
      client.fetch(grindOptionsQuery),
      client.fetch(pricingTiersQuery),
      client.fetch(siteSettingsQuery),
    ]);

  // Provide defaults for siteSettings if not found
  const settings = siteSettings || {
    minOrderQuantity: 10,
    maxOrderQuantity: 150,
    wholesaleThreshold: 150,
    turnaroundDays: "7–10 working days",
    labelMakerUrl: "/label-maker",
    builderCopy: null,
  };

  return { bagSizes, bagColours, roastProfiles, grindOptions, pricingTiers, siteSettings: settings };
}

export default async function BuildPage() {
  const { bagSizes, bagColours, roastProfiles, grindOptions, pricingTiers, siteSettings } =
    await getBuilderData();

  return (
    <BuilderClient
      bagSizes={bagSizes}
      bagColours={bagColours}
      roastProfiles={roastProfiles}
      grindOptions={grindOptions}
      pricingTiers={pricingTiers}
      siteSettings={siteSettings}
    />
  );
}

export const metadata = {
  title: "Build Your Coffee Brand | Ghost Roasting UK",
  description:
    "Create your own branded coffee in minutes. Choose your bag style, roast profile, and design — we handle the rest.",
};
