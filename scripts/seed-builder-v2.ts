import { createClient } from "@sanity/client";
import { config } from "dotenv";

// Load .env.local
config({ path: ".env.local" });

const client = createClient({
  projectId: "z97yvgto",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

console.log("Using project:", "z97yvgto");
console.log("Token loaded:", process.env.SANITY_API_TOKEN ? "Yes" : "No");

async function deleteExisting(type: string) {
  const docs = await client.fetch(`*[_type == "${type}"]._id`);
  if (docs.length > 0) {
    console.log(`  Deleting ${docs.length} existing ${type} documents...`);
    for (const id of docs) {
      await client.delete(id);
    }
  }
}

async function seed() {
  console.log("Seeding builder v2 data...\n");

  // Clean up old data
  console.log("Cleaning up old data...");
  await deleteExisting("bagOptions"); // Old schema
  await deleteExisting("bagSizes");
  await deleteExisting("bagColours");
  await deleteExisting("grindOptions");
  await deleteExisting("roastProfiles");
  console.log("  Done\n");

  // Seed bag sizes
  console.log("Creating bag sizes...");
  const bagSizes = [
    {
      _type: "bagSizes",
      name: "250g",
      description: "Perfect for sampling or personal use",
      sortOrder: 1,
      isActive: true,
    },
    {
      _type: "bagSizes",
      name: "500g",
      description: "Our most popular size for retail",
      sortOrder: 2,
      isActive: true,
    },
    {
      _type: "bagSizes",
      name: "1kg",
      description: "Best value for bulk buyers",
      sortOrder: 3,
      isActive: true,
    },
  ];

  for (const size of bagSizes) {
    await client.create(size);
    console.log(`  Created ${size.name}`);
  }

  // Seed bag colours
  console.log("\nCreating bag colours...");
  const bagColours = [
    {
      _type: "bagColours",
      name: "Midnight Black",
      hex: "#1A1A1A",
      sortOrder: 1,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Chalk White",
      hex: "#F5F5F0",
      sortOrder: 2,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Espresso Brown",
      hex: "#3C2415",
      sortOrder: 3,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Forest Green",
      hex: "#1A3A2A",
      sortOrder: 4,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Slate Grey",
      hex: "#4A4A4A",
      sortOrder: 5,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Dusty Rose",
      hex: "#C4857A",
      sortOrder: 6,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Navy Blue",
      hex: "#1A2744",
      sortOrder: 7,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
    {
      _type: "bagColours",
      name: "Burnt Orange",
      hex: "#C4622D",
      sortOrder: 8,
      isActive: true,
      labelWidth: 100,
      labelHeight: 70,
      labelBleed: 3,
    },
  ];

  for (const colour of bagColours) {
    await client.create(colour);
    console.log(`  Created ${colour.name}`);
  }
  console.log("  NOTE: Bag photos need to be uploaded via Sanity Studio");

  // Seed grind options
  console.log("\nCreating grind options...");
  const grindOptions = [
    {
      _type: "grindOptions",
      name: "Whole Bean",
      description: "For grinding fresh at home or in your cafe",
      icon: "coffee-bean",
      sortOrder: 1,
      isActive: true,
    },
    {
      _type: "grindOptions",
      name: "Filter",
      description: "Medium-coarse grind for pour-over, drip, and Chemex",
      icon: "filter",
      sortOrder: 2,
      isActive: true,
    },
    {
      _type: "grindOptions",
      name: "Cafetiere",
      description: "Coarse grind for French press",
      icon: "cafetiere",
      sortOrder: 3,
      isActive: true,
    },
    {
      _type: "grindOptions",
      name: "Espresso",
      description: "Fine grind for espresso machines",
      icon: "espresso",
      sortOrder: 4,
      isActive: true,
    },
    {
      _type: "grindOptions",
      name: "Moka Pot",
      description: "Medium-fine grind for stovetop espresso",
      icon: "moka",
      sortOrder: 5,
      isActive: true,
    },
    {
      _type: "grindOptions",
      name: "AeroPress",
      description: "Fine-medium grind optimised for AeroPress",
      icon: "aeropress",
      sortOrder: 6,
      isActive: true,
    },
  ];

  for (const grind of grindOptions) {
    await client.create(grind);
    console.log(`  Created ${grind.name}`);
  }

  // Seed roast profiles
  console.log("\nCreating roast profiles...");
  const roastProfiles: Array<{
    _type: string;
    name: string;
    slug: { _type: string; current: string };
    descriptor: string;
    tastingNotes: string;
    roastLevel: number;
    isDecaf: boolean;
    badge: string | null;
    sortOrder: number;
    isActive: boolean;
  }> = [
    {
      _type: "roastProfiles",
      name: "Light Roast",
      slug: { _type: "slug", current: "light-roast" },
      descriptor: "Fruity & Bright",
      tastingNotes: "Floral, citrus, tea-like finish",
      roastLevel: 1,
      isDecaf: false,
      badge: null,
      sortOrder: 1,
      isActive: true,
    },
    {
      _type: "roastProfiles",
      name: "Medium Roast",
      slug: { _type: "slug", current: "medium-roast" },
      descriptor: "Balanced & Smooth",
      tastingNotes: "Caramel, milk chocolate, clean finish",
      roastLevel: 2,
      isDecaf: false,
      badge: "Most Popular",
      sortOrder: 2,
      isActive: true,
    },
    {
      _type: "roastProfiles",
      name: "Medium-Dark Roast",
      slug: { _type: "slug", current: "medium-dark-roast" },
      descriptor: "Rich & Full",
      tastingNotes: "Toffee, dark chocolate, nutty undertones",
      roastLevel: 3,
      isDecaf: false,
      badge: null,
      sortOrder: 3,
      isActive: true,
    },
    {
      _type: "roastProfiles",
      name: "Dark Roast",
      slug: { _type: "slug", current: "dark-roast" },
      descriptor: "Bold & Intense",
      tastingNotes: "Dark chocolate, smoky, full-bodied",
      roastLevel: 4,
      isDecaf: false,
      badge: null,
      sortOrder: 4,
      isActive: true,
    },
    {
      _type: "roastProfiles",
      name: "Decaf Medium",
      slug: { _type: "slug", current: "decaf-medium" },
      descriptor: "Balanced & Smooth",
      tastingNotes: "All the flavour, none of the buzz",
      roastLevel: 2,
      isDecaf: true,
      badge: "Swiss Water Process",
      sortOrder: 5,
      isActive: true,
    },
  ];

  for (const profile of roastProfiles) {
    await client.create(profile);
    console.log(`  Created ${profile.name}`);
  }

  // Create builder settings document
  console.log("\nCreating builder settings...");
  await deleteExisting("builderSettings");
  await client.create({
    _type: "builderSettings",
    _id: "builderSettings",
    minOrderQuantity: 10,
    maxOrderQuantity: 99,
    wholesaleThreshold: 99,
    turnaroundDays: "7–10 working days",
    labelMakerUrl: "/label-maker",
    step1Heading: "Choose Your Size",
    step1Subheading: "Select the bag size that works best for your brand",
    step2Heading: "Choose Your Colour",
    step2Subheading: "Pick a bag colour that matches your brand identity",
    step3Heading: "Upload Your Label",
    step3Subheading:
      "Add your custom label or use our template. You can also skip this for now.",
    step4Heading: "Choose Your Flavour Profile",
    step4Subheading:
      "Select the roast level that defines your coffee experience",
    step5Heading: "Choose Your Grind",
    step5Subheading:
      "Select how you want your beans prepared. Whole bean is perfect for freshness.",
    step6Heading: "Choose Your Quantity",
    step6Subheading:
      "How many bags would you like? Minimum order is 10 bags.",
    step7Heading: "Review Your Order",
    step7Subheading:
      "Check everything looks right before proceeding to checkout",
  });
  console.log("  Created builder settings document");

  console.log("\n✓ Builder v2 data seeding complete!");
  console.log("\nNext steps:");
  console.log("1. Upload bag photos to each bagColours document in Sanity Studio");
  console.log("2. Use /studio-tools/map-label-zone to define label zones for each colour");
  console.log("3. Test the builder at /build");
}

seed().catch(console.error);
