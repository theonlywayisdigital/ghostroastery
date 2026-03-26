import { NextResponse } from "next/server";
import { getTextModel, getImageModel } from "@/lib/gemini";
import { createAuthServerClient } from "@/lib/supabase";
import {
  checkAiCredits,
  consumeAiCredits,
  resolveRoasterId,
} from "@/lib/ai-credits";

export async function POST(request: Request) {
  try {
    // ── Auth ──────────────────────────────────────────────────
    const supabaseAuth = await createAuthServerClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roasterId = await resolveRoasterId(user.id);
    if (!roasterId) {
      return NextResponse.json(
        { error: "No roaster account found" },
        { status: 403 }
      );
    }

    // ── Credit check ─────────────────────────────────────────
    const creditCheck = await checkAiCredits(roasterId, "label_background");
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.error, creditsRemaining: creditCheck.creditsRemaining },
        { status: 429 }
      );
    }

    // ── Body ─────────────────────────────────────────────────
    const { prompt, style } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = getTextModel();

    const styleGuide: Record<string, string> = {
      photographic: "photorealistic, high-quality DSLR photography style, natural lighting",
      illustrated: "hand-drawn illustration style, artistic, detailed linework",
      abstract: "abstract art, geometric shapes, modern design, flowing forms",
      textured: "rich texture, paper grain, linen, marble, wood, natural materials",
      flat: "flat design, solid colours, minimal shadows, clean vector-like aesthetic",
    };

    const styleDesc = styleGuide[style] || styleGuide.photographic;

    // Generate 3 image descriptions that Gemini can create
    const descriptionPrompt = `You are an expert graphic designer specialising in label and packaging design.

A customer needs a BACKGROUND IMAGE for a printed rectangular label (portrait orientation, approximately 102mm wide × 152mm tall). This background will sit behind text on the label surface.

CRITICAL RULES — THE IMAGE MUST:
- Be a FULL-BLEED background — the imagery/colour/texture MUST extend to EVERY edge of the image with NO margins, NO borders, NO frames, NO white edges, and NO empty space at any side.
- Fill the ENTIRE rectangle edge-to-edge — nothing should stop short of the edges.
- NOT depict a coffee bag, pouch, package, or any 3D product mockup.
- NOT include any text, logos, borders, frames, or visible edges.
- Leave visual "breathing room" for text to be overlaid on top.
- Work as a portrait-oriented rectangle.

Customer's request: "${prompt}"
Style: ${styleDesc}

Generate exactly 3 distinct, detailed image descriptions. Each should describe a different flat rectangular background composition that BLEEDS OFF ALL FOUR EDGES. Focus on colours, textures, gradients, patterns, or atmospheric imagery — NOT product photography.

Return ONLY a JSON array of 3 strings. No other text.
Example: ["description 1", "description 2", "description 3"]`;

    const result = await model.generateContent(descriptionPrompt);
    const text = result.response.text();

    // Parse the JSON array from the response
    let descriptions: string[];
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      descriptions = JSON.parse(cleaned);
      if (!Array.isArray(descriptions) || descriptions.length < 3) {
        throw new Error("Expected array of 3 descriptions");
      }
    } catch {
      // Fallback: split by numbered lines
      descriptions = [
        `Flat rectangular background texture: ${prompt}, ${styleDesc}, variation 1`,
        `Flat rectangular background texture: ${prompt}, ${styleDesc}, variation 2`,
        `Flat rectangular background texture: ${prompt}, ${styleDesc}, variation 3`,
      ];
    }

    // Use Gemini's image generation for each description
    const images: string[] = [];

    for (const desc of descriptions.slice(0, 3)) {
      try {
        const imageModel = getImageModel();
        const imgResult = await imageModel.generateContent(
          `Generate a flat rectangular background image in portrait orientation (about 1020px wide × 1520px tall). This is a FULL-BLEED surface texture/pattern for a printed label — NOT a product photo.

ABSOLUTE REQUIREMENTS:
- The image content MUST extend to ALL FOUR EDGES — no margins, no borders, no white space, no frames, no visible edges whatsoever.
- The colour/texture/pattern must bleed off every side as if it continues beyond the frame.
- Do NOT show a coffee bag, pouch, or any 3D object.
- No text, no logos, no borders, no rounded corners, no vignette frames.

Description: ${desc}. Style: ${styleDesc}.`
        );

        const response = imgResult.response;
        const parts = response.candidates?.[0]?.content?.parts;
        const imagePart = parts?.find(
          (p) => "inlineData" in p && p.inlineData?.mimeType?.startsWith("image/")
        );

        if (imagePart && "inlineData" in imagePart && imagePart.inlineData) {
          images.push(
            `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`
          );
        } else {
          images.push(generateGradientPlaceholder(desc));
        }
      } catch {
        images.push(generateGradientPlaceholder(desc));
      }
    }

    // ── Consume credits (after successful response) ──────────
    await consumeAiCredits(roasterId, "label_background", { prompt, style });

    return NextResponse.json({ images, descriptions });
  } catch (error) {
    console.error("Generate background error:", error);
    return NextResponse.json(
      { error: "Failed to generate backgrounds" },
      { status: 500 }
    );
  }
}

/** Generate a simple SVG gradient as a placeholder data URL */
function generateGradientPlaceholder(description: string): string {
  const dark = description.toLowerCase().includes("dark");
  const warm = description.toLowerCase().includes("warm") || description.toLowerCase().includes("coffee");
  const cool = description.toLowerCase().includes("cool") || description.toLowerCase().includes("blue");
  const tropical = description.toLowerCase().includes("tropical") || description.toLowerCase().includes("bright");

  let c1 = "#2d1b0e";
  let c2 = "#5c3a1e";

  if (dark) { c1 = "#0d0d0d"; c2 = "#1a1a2e"; }
  else if (cool) { c1 = "#1a2332"; c2 = "#2d4a5e"; }
  else if (tropical) { c1 = "#1a4a2e"; c2 = "#4a6e3a"; }
  else if (warm) { c1 = "#3d1f0e"; c2 = "#6b3a1a"; }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1020" height="1520">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${c1}"/>
        <stop offset="100%" style="stop-color:${c2}"/>
      </linearGradient>
    </defs>
    <rect width="1020" height="1520" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
