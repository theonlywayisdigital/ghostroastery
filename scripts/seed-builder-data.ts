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

const bagColours = [
  { name: "Midnight Black", hex: "#1A1A1A" },
  { name: "Chalk White", hex: "#F5F5F0" },
  { name: "Espresso Brown", hex: "#3C2415" },
  { name: "Forest Green", hex: "#1A3A2A" },
  { name: "Slate Grey", hex: "#4A4A4A" },
  { name: "Dusty Rose", hex: "#C4857A" },
  { name: "Navy Blue", hex: "#1A2744" },
  { name: "Burnt Orange", hex: "#C4622D" },
];

async function seed() {
  console.log("Seeding builder data...\n");

  // Seed bag options
  console.log("Creating bag options...");
  const bagOptions = [
    {
      _type: "bagOptions",
      name: "Flat Bottom Pouch",
      slug: { _type: "slug", current: "flat-bottom-pouch" },
      description: "Premium stand-up bag with flat base. Great shelf presence.",
      availableSizes: ["250g", "500g", "1kg"],
      colours: bagColours.map((c) => ({
        _type: "colour",
        _key: c.hex.replace("#", ""),
        name: c.name,
        hex: c.hex,
      })),
      labelWidth: 160,
      labelHeight: 110,
      labelBleed: 3,
      labelOrientation: "landscape",
    },
    {
      _type: "bagOptions",
      name: "Stand-Up Pouch",
      slug: { _type: "slug", current: "stand-up-pouch" },
      description: "Classic flexible pouch. Lightweight and cost-effective.",
      availableSizes: ["250g", "500g", "1kg"],
      colours: bagColours.map((c) => ({
        _type: "colour",
        _key: c.hex.replace("#", ""),
        name: c.name,
        hex: c.hex,
      })),
      labelWidth: 140,
      labelHeight: 100,
      labelBleed: 3,
      labelOrientation: "landscape",
    },
    {
      _type: "bagOptions",
      name: "Kraft Bag",
      slug: { _type: "slug", current: "kraft-bag" },
      description: "Natural kraft finish. Perfect for artisan and eco brands.",
      availableSizes: ["250g", "500g", "1kg"],
      colours: bagColours.map((c) => ({
        _type: "colour",
        _key: c.hex.replace("#", ""),
        name: c.name,
        hex: c.hex,
      })),
      labelWidth: 130,
      labelHeight: 90,
      labelBleed: 3,
      labelOrientation: "landscape",
    },
  ];

  for (const bag of bagOptions) {
    await client.create(bag);
    console.log(`  Created ${bag.name}`);
  }

  // Seed roast profiles
  console.log("\nCreating roast profiles...");
  const roastProfiles = [
    {
      _type: "roastProfiles",
      name: "Light Roast",
      slug: { _type: "slug", current: "light-roast" },
      roastLevel: "light",
      descriptor: "Fruity & Bright",
      tastingNotes: "Floral, citrus, tea-like finish",
    },
    {
      _type: "roastProfiles",
      name: "Medium Roast",
      slug: { _type: "slug", current: "medium-roast" },
      roastLevel: "medium",
      descriptor: "Balanced & Smooth",
      tastingNotes: "Caramel, milk chocolate, clean finish",
    },
    {
      _type: "roastProfiles",
      name: "Dark Roast",
      slug: { _type: "slug", current: "dark-roast" },
      roastLevel: "dark",
      descriptor: "Bold & Rich",
      tastingNotes: "Dark chocolate, smoky, full-bodied",
    },
    {
      _type: "roastProfiles",
      name: "Decaf",
      slug: { _type: "slug", current: "decaf" },
      roastLevel: "decaf",
      descriptor: "Medium Roast",
      tastingNotes: "All the flavour, none of the buzz",
    },
  ];

  for (const profile of roastProfiles) {
    await client.create(profile);
    console.log(`  Created ${profile.name}`);
  }

  console.log("\nBuilder data seeding complete!");
}

seed().catch(console.error);
