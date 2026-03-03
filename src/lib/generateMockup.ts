import sharp from "sharp";
import { client } from "@/sanity/lib/client";
import { bagColoursQuery } from "@/sanity/queries/builder";
import { getBagMockupConfig } from "@/components/builder/bagMockupConfig";

const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
});

interface BagColourData {
  name: string;
  bagPhotoUrl: string;
}

/**
 * Generates a bag mockup by compositing the label onto the bag photo.
 * Derives label bounding box from the 4 corners of the label rect.
 */
export async function generateMockup(
  bagColourName: string,
  labelFileUrl: string | null
): Promise<string | null> {
  if (!labelFileUrl) return null;

  try {
    const bagColours: BagColourData[] = await client.fetch(bagColoursQuery);
    const colour = bagColours.find((c) => c.name === bagColourName);
    if (!colour?.bagPhotoUrl) return null;

    const [bagResponse, labelResponse] = await Promise.all([
      fetch(colour.bagPhotoUrl),
      fetch(labelFileUrl),
    ]);

    if (!bagResponse.ok || !labelResponse.ok) return null;

    const bagBuffer = Buffer.from(await bagResponse.arrayBuffer());
    let labelBuffer: Buffer = Buffer.from(await labelResponse.arrayBuffer());

    const bagMeta = await sharp(bagBuffer).metadata();
    const bagWidth = bagMeta.width || 800;
    const bagHeight = bagMeta.height || 1120;

    const config = getBagMockupConfig(bagColourName);
    const { labelRect } = config;

    // Derive bounding box from 4 corners of the label rect
    const corners = [labelRect.topLeft, labelRect.topRight, labelRect.bottomLeft, labelRect.bottomRight];
    const labelLeft = Math.round(bagWidth * Math.min(...corners.map(p => p.x)) / 100);
    const labelTop = Math.round(bagHeight * Math.min(...corners.map(p => p.y)) / 100);
    const labelRight = Math.round(bagWidth * Math.max(...corners.map(p => p.x)) / 100);
    const labelBottom = Math.round(bagHeight * Math.max(...corners.map(p => p.y)) / 100);
    const labelAreaWidth = labelRight - labelLeft;
    const labelAreaHeight = labelBottom - labelTop;

    const labelMeta = await sharp(labelBuffer).metadata();
    const labelAspect = (labelMeta.width || 1) / (labelMeta.height || 1);
    const areaAspect = labelAreaWidth / labelAreaHeight;

    let resizeWidth: number;
    let resizeHeight: number;

    if (labelAspect > areaAspect) {
      resizeWidth = labelAreaWidth;
      resizeHeight = Math.round(labelAreaWidth / labelAspect);
    } else {
      resizeHeight = labelAreaHeight;
      resizeWidth = Math.round(labelAreaHeight * labelAspect);
    }

    labelBuffer = await sharp(labelBuffer)
      .resize(resizeWidth, resizeHeight, { fit: "fill" })
      .png()
      .toBuffer();

    const offsetLeft = labelLeft + Math.round((labelAreaWidth - resizeWidth) / 2);
    const offsetTop = labelTop + Math.round((labelAreaHeight - resizeHeight) / 2);

    const mockupBuffer = await sharp(bagBuffer)
      .composite([
        {
          input: labelBuffer,
          left: offsetLeft,
          top: offsetTop,
          blend: "over" as const,
        },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    const asset = await writeClient.assets.upload("image", mockupBuffer, {
      filename: `mockup-${Date.now()}.jpg`,
      contentType: "image/jpeg",
    });

    return asset.url;
  } catch (err) {
    console.error("Mockup generation failed:", err);
    return null;
  }
}
