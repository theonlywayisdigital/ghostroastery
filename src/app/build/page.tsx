import { client } from "@/sanity/lib/client";
import { bagColoursQuery } from "@/sanity/queries/builder";
import { createServerClient } from "@/lib/supabase";
import type { PricingData } from "@/lib/pricing";
import { BuilderClient } from "./BuilderClient";

export const revalidate = 3600; // Revalidate every hour

// Fetch builder data — Supabase for product config + pricing, Sanity for bag colours
async function getBuilderData() {
  const supabase = createServerClient();

  const [bagColours, bagSizesResult, roastProfilesResult, grindOptionsResult, bracketsResult, pricesResult, settingsResult] =
    await Promise.all([
      client.fetch(bagColoursQuery),
      supabase
        .from("bag_sizes")
        .select("id, name, description, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("roast_profiles")
        .select("id, name, slug, descriptor, tasting_notes, roast_level, is_decaf, badge, image_url, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("grind_options")
        .select("id, name, description, image_url, sort_order, is_active")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_tier_brackets")
        .select("id, min_quantity, max_quantity, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_tier_prices")
        .select("id, bracket_id, bag_size, price_per_bag, shipping_cost, currency")
        .eq("is_active", true),
      supabase
        .from("builder_settings")
        .select("max_order_quantity, wholesale_threshold")
        .limit(1)
        .single(),
    ]);

  // Map Supabase snake_case to camelCase for builder interfaces
  const bagSizes = (bagSizesResult.data || []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    sortOrder: s.sort_order,
    isActive: s.is_active,
  }));

  const roastProfiles = (roastProfilesResult.data || []).map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    descriptor: r.descriptor,
    tastingNotes: r.tasting_notes,
    roastLevel: r.roast_level,
    isDecaf: r.is_decaf,
    badge: r.badge,
    imageUrl: r.image_url,
    sortOrder: r.sort_order,
    isActive: r.is_active,
  }));

  const grindOptions = (grindOptionsResult.data || []).map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    imageUrl: g.image_url,
    sortOrder: g.sort_order,
    isActive: g.is_active,
  }));

  const brackets = (bracketsResult.data || []).map((b) => ({
    id: b.id,
    min: b.min_quantity,
    max: b.max_quantity,
    sortOrder: b.sort_order,
  }));

  const prices = (pricesResult.data || []).map((p) => ({
    id: p.id,
    bracketId: p.bracket_id,
    bagSize: p.bag_size,
    pricePerBag: Number(p.price_per_bag),
    shippingCost: Number(p.shipping_cost),
    currency: p.currency,
  }));

  const minOrder = brackets.length > 0
    ? Math.min(...brackets.map((b) => b.min))
    : 25;

  const pricingData: PricingData = {
    brackets,
    prices,
    minOrder,
    maxOrder: settingsResult.data?.max_order_quantity ?? 99,
  };

  // Merge Supabase settings with full defaults
  const dbSettings = settingsResult.data;
  const builderSettings = {
    maxOrderQuantity: dbSettings?.max_order_quantity ?? 99,
    wholesaleThreshold: dbSettings?.wholesale_threshold ?? 99,
    turnaroundDays: "7–10 working days",
    labelMakerUrl: "/label-maker",
    step1Heading: "Choose Your Size",
    step1Subheading: "Select the bag size that works best for your brand",
    step2Heading: "Choose Your Colour",
    step2Subheading: "Pick a bag colour that matches your brand identity",
    step3Heading: "Upload Your Label",
    step3Subheading: "Add your custom label or use our template. You can also skip this for now.",
    step4Heading: "Choose Your Flavour Profile",
    step4Subheading: "Select the roast level that defines your coffee experience",
    step5Heading: "Choose Your Grind",
    step5Subheading: "Select how you want your beans prepared. Whole bean is perfect for freshness.",
    step6Heading: "Choose Your Quantity",
    step6Subheading: "How many bags would you like? Minimum order is 10 bags.",
    step7Heading: "Review Your Order",
    step7Subheading: "Check everything looks right before proceeding to checkout",
  };

  return { bagSizes, bagColours, roastProfiles, grindOptions, pricingData, builderSettings };
}

export default async function BuildPage() {
  const { bagSizes, bagColours, roastProfiles, grindOptions, pricingData, builderSettings } =
    await getBuilderData();

  return (
    <BuilderClient
      bagSizes={bagSizes}
      bagColours={bagColours}
      roastProfiles={roastProfiles}
      grindOptions={grindOptions}
      pricingData={pricingData}
      builderSettings={builderSettings}
    />
  );
}

export const metadata = {
  title: "Build Your Coffee Brand | Ghost Roastery",
  description:
    "Create your own branded coffee in minutes. Choose your bag style, roast profile, and design — we handle the rest.",
};
