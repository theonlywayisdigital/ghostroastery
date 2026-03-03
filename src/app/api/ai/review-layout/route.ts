import { NextResponse } from "next/server";
import { getVisionModel, base64ToInlineData } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { canvasImageBase64, dimensions } = await request.json();

    if (!canvasImageBase64 || typeof canvasImageBase64 !== "string") {
      return NextResponse.json(
        { error: "Canvas image is required" },
        { status: 400 }
      );
    }

    const model = getVisionModel();
    const imageData = base64ToInlineData(canvasImageBase64);

    const dimInfo = dimensions
      ? `The label dimensions are ${dimensions.w}mm × ${dimensions.h}mm.`
      : "";

    const result = await model.generateContent([
      imageData,
      {
        text: `You are a professional print designer reviewing a coffee bag label. ${dimInfo}

Give 3-5 specific, actionable suggestions to improve readability, visual hierarchy and overall print quality. Be concise and practical. Focus on:
- Text hierarchy and sizing
- Layout balance and whitespace
- Element alignment
- Visual weight distribution
- Overall composition

Do not comment on the colour profile or resolution — these are handled separately.

Return ONLY a JSON array of suggestion strings.
Example: ["Move the brand name higher for better hierarchy", "Increase the body text size for readability", "Add more whitespace between sections"]

No other text, just the JSON array.`,
      },
    ]);

    const text = result.response.text();
    let suggestions: string[];

    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      suggestions = JSON.parse(cleaned);
      if (!Array.isArray(suggestions)) {
        throw new Error("Expected array of suggestions");
      }
    } catch {
      // Try to extract suggestions from plain text
      suggestions = text
        .split("\n")
        .filter((line) => line.trim().length > 10)
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .slice(0, 5);
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Review layout error:", error);
    return NextResponse.json(
      { error: "Failed to review layout" },
      { status: 500 }
    );
  }
}
