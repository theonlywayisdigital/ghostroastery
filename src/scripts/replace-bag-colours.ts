/**
 * Replace all bag colour documents in Sanity with new high-quality 1200×1600 photos.
 *
 * Usage:
 *   npx tsx src/scripts/replace-bag-colours.ts
 */

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN!,
});

// New bag definitions: file → name, hex, isShiny, sortOrder
const PREFIX = "mockup-of-an-ai-generated-sublimated-coffee-bag-placed-on-a-customizable-background-m40396";
const NEW_BAGS = [
  { file: `${PREFIX} (10).png`, name: "Black Matt",    hex: "#161517", isShiny: false, sortOrder: 1 },
  { file: `${PREFIX} (11).png`, name: "Black Shiny",   hex: "#202020", isShiny: true,  sortOrder: 2 },
  { file: `${PREFIX} (9).png`,  name: "Blue Shiny",    hex: "#3d6689", isShiny: true,  sortOrder: 3 },
  { file: `${PREFIX} (8).png`,  name: "Gold Matt",     hex: "#aa7c26", isShiny: false, sortOrder: 4 },
  { file: `${PREFIX} (7).png`,  name: "Gold Shiny",    hex: "#784a0e", isShiny: true,  sortOrder: 5 },
  { file: `${PREFIX} (6).png`,  name: "Green Shiny",   hex: "#02380b", isShiny: true,  sortOrder: 6 },
  { file: `${PREFIX} (5).png`,  name: "Kraft Paper",   hex: "#c7a976", isShiny: false, sortOrder: 7 },
  { file: `${PREFIX} (1).png`,  name: "Silver Matt",   hex: "#b6b0af", isShiny: false, sortOrder: 8 },
  { file: `${PREFIX} (3).png`,  name: "Silver Shiny",  hex: "#686057", isShiny: true,  sortOrder: 9 },
  { file: `${PREFIX}.png`,      name: "White Matt",    hex: "#d3d3ce", isShiny: false, sortOrder: 10 },
  { file: `${PREFIX} (4).png`,  name: "White Paper",   hex: "#b2bbbe", isShiny: false, sortOrder: 11 },
  { file: `${PREFIX} (2).png`,  name: "White Shiny",   hex: "#e0dcda", isShiny: true,  sortOrder: 12 },
];

const BAGS_DIR = path.join(process.env.HOME || "", "Downloads", "New bags");

async function main() {
  console.log("Step 1: Deleting all existing bag colour documents...\n");

  const existing = await sanityClient.fetch<{ _id: string; name: string }[]>(
    `*[_type == "bagColours"]{ _id, name }`
  );

  if (existing.length > 0) {
    const tx = sanityClient.transaction();
    for (const doc of existing) {
      console.log(`   Deleting: ${doc.name} (${doc._id})`);
      tx.delete(doc._id);
    }
    await tx.commit();
    console.log(`\n   Deleted ${existing.length} documents\n`);
  } else {
    console.log("   No existing documents found\n");
  }

  console.log(`Step 2: Creating ${NEW_BAGS.length} new bag colours with new photos...\n`);

  for (const bag of NEW_BAGS) {
    const filePath = path.join(BAGS_DIR, bag.file);
    console.log(`   ${bag.name}: Reading ${bag.file}...`);

    const fileBuffer = readFileSync(filePath);

    console.log(`   ${bag.name}: Uploading photo to Sanity...`);
    const asset = await sanityClient.assets.upload("image", fileBuffer, {
      filename: bag.file,
      contentType: "image/png",
    });

    console.log(`   ${bag.name}: Creating document...`);
    await sanityClient.create({
      _type: "bagColours",
      name: bag.name,
      hex: bag.hex,
      bagPhoto: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      sortOrder: bag.sortOrder,
      isActive: true,
    });

    console.log(`   ${bag.name}: Done\n`);
  }

  console.log("-".repeat(50));
  console.log(`All ${NEW_BAGS.length} bag colours created in Sanity!`);
  console.log("\nNext steps:");
  console.log("  1. Go to /studio-tools/map-label-zone to calibrate corner points for each bag");
  console.log("  2. Paint lighting maps in the calibration tool");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
