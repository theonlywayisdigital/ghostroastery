import { NextResponse } from "next/server";
import { getTextModel } from "@/lib/gemini";
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
    const creditCheck = await checkAiCredits(roasterId, "label_copy");
    if (!creditCheck.allowed) {
      return NextResponse.json(
        { error: creditCheck.error, creditsRemaining: creditCheck.creditsRemaining },
        { status: 429 }
      );
    }

    // ── Body ─────────────────────────────────────────────────
    const { brandName, origin, roastLevel, flavourNotes, tone } =
      await request.json();

    if (!brandName || typeof brandName !== "string") {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    const model = getTextModel();

    const toneGuide: Record<string, string> = {
      professional:
        "Professional and trustworthy. Clean, direct language. Confidence without being flashy.",
      playful:
        "Fun, energetic, and approachable. Light-hearted but not childish. Engaging personality.",
      minimal:
        "Stripped back, letting the coffee speak. Short, impactful phrases. Less is more.",
      premium:
        "Luxurious and refined. Evocative sensory language. Exclusive and aspirational.",
    };

    const toneDesc = toneGuide[tone] || toneGuide.professional;

    const result = await model.generateContent(
      `You are an expert coffee brand copywriter. Generate label copy for a specialty coffee brand.

Brand name: ${brandName}
Origin: ${origin || "Not specified"}
Roast level: ${roastLevel || "Not specified"}
Flavour notes: ${flavourNotes || "Not specified"}
Tone: ${toneDesc}

Generate the following pieces of copy. Each should be ready to place directly on a coffee bag label:

1. **Tagline** — One punchy line (max 8 words) that captures the brand's essence
2. **Origin line** — One formatted line suitable for a label (e.g. "Single Origin — Ethiopia Yirgacheffe")
3. **Tasting notes** — 2-3 evocative lines describing the flavour experience (not just listing notes)
4. **Brand story** — 3-4 sentences for the back of the label. Tell the brand's story or coffee philosophy.

Return ONLY a JSON object with these exact keys: tagline, originLine, tastingNotes, brandStory
Each value should be a string.
No other text, just the JSON object.`
    );

    const text = result.response.text();
    let copy: {
      tagline: string;
      originLine: string;
      tastingNotes: string;
      brandStory: string;
    };

    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      copy = JSON.parse(cleaned);
    } catch {
      copy = {
        tagline: `${brandName} — Crafted with care`,
        originLine: origin ? `Single Origin — ${origin}` : "Specialty Coffee",
        tastingNotes:
          flavourNotes ||
          "Rich and full-bodied with a smooth finish that lingers.",
        brandStory: `${brandName} is dedicated to bringing you exceptional coffee, roasted with precision and passion.`,
      };
    }

    // ── Consume credits (after successful response) ──────────
    await consumeAiCredits(roasterId, "label_copy", { brandName, tone });

    return NextResponse.json(copy);
  } catch (error) {
    console.error("Generate copy error:", error);
    return NextResponse.json(
      { error: "Failed to generate copy" },
      { status: 500 }
    );
  }
}
