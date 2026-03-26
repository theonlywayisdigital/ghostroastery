import { NextResponse } from "next/server";
import { getVisionModel, base64ToInlineData } from "@/lib/gemini";
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
    const creditCheck = await checkAiCredits(roasterId, "label_palette");
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.error, creditsRemaining: creditCheck.creditsRemaining },
        { status: 429 }
      );
    }

    // ── Body ─────────────────────────────────────────────────
    const { logoImageBase64 } = await request.json();

    if (!logoImageBase64 || typeof logoImageBase64 !== "string") {
      return NextResponse.json(
        { error: "Logo image is required" },
        { status: 400 }
      );
    }

    const model = getVisionModel();
    const imageData = base64ToInlineData(logoImageBase64);

    const result = await model.generateContent([
      imageData,
      {
        text: `You are an expert brand designer. Analyse this logo image and suggest 3 complementary colour palettes for a coffee bag label.

Each palette should have 3-4 hex colour values that work well together and complement the logo's existing colours. Consider:
- A primary/dominant colour
- A secondary accent colour
- A text colour that provides good contrast
- An optional highlight or background tint

Return ONLY a JSON array of 3 arrays, each containing 3-4 hex colour strings.
Example: [["#2d1b0e", "#d4a574", "#f5f0eb"], ["#1a2332", "#c4956a", "#ffffff"], ["#3d1f0e", "#8b6b4a", "#f0e6d8", "#c4a882"]]

No other text, just the JSON array.`,
      },
    ]);

    const text = result.response.text();
    let palettes: string[][];

    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      palettes = JSON.parse(cleaned);
      if (!Array.isArray(palettes) || palettes.length < 3) {
        throw new Error("Expected array of 3 palettes");
      }
    } catch {
      // Fallback palettes
      palettes = [
        ["#2d1b0e", "#d4a574", "#f5f0eb"],
        ["#1a2332", "#c4956a", "#ffffff"],
        ["#3d1f0e", "#8b6b4a", "#f0e6d8"],
      ];
    }

    // ── Consume credits (after successful response) ──────────
    await consumeAiCredits(roasterId, "label_palette");

    return NextResponse.json({ palettes });
  } catch (error) {
    console.error("Suggest palette error:", error);
    return NextResponse.json(
      { error: "Failed to suggest palettes" },
      { status: 500 }
    );
  }
}
