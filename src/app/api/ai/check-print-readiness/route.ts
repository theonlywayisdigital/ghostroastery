import { NextResponse } from "next/server";
import { getVisionModel, base64ToInlineData } from "@/lib/gemini";

interface CheckResult {
  label: string;
  status: "passed" | "warning" | "error";
  message: string;
}

export async function POST(request: Request) {
  try {
    const { canvasImageBase64, elements, dimensions } = await request.json();

    const results: CheckResult[] = [];

    // ─── Client-side checks (based on element data) ───

    if (elements && Array.isArray(elements) && dimensions) {
      const bleedMm = dimensions.bleedMm ?? 3;
      const safeZoneMm = dimensions.safeZoneMm ?? 4;
      const trimW = dimensions.widthMm ?? 94;
      const trimH = dimensions.heightMm ?? 140;

      // Safe zone edges (relative to canvas origin, in mm)
      const safeLeft = bleedMm + safeZoneMm;
      const safeTop = bleedMm + safeZoneMm;
      const safeRight = bleedMm + trimW - safeZoneMm;
      const safeBottom = bleedMm + trimH - safeZoneMm;

      // Trim edges
      const trimLeft = bleedMm;
      const trimTop = bleedMm;
      const trimRight = bleedMm + trimW;
      const trimBottom = bleedMm + trimH;

      // Total canvas
      const totalW = trimW + bleedMm * 2;
      const totalH = trimH + bleedMm * 2;

      let hasBackground = false;
      let elementsOutsideSafe = 0;
      let elementsNearTrim = 0;
      let lowDpiImages = 0;
      let tinyText = 0;

      for (const el of elements) {
        if (el.isBackground) {
          hasBackground = true;
          // Check if background covers bleed area
          const coversBleed =
            el.x <= 0.5 &&
            el.y <= 0.5 &&
            el.x + el.w >= totalW - 0.5 &&
            el.y + el.h >= totalH - 0.5;
          if (!coversBleed) {
            results.push({
              label: "Background reaches bleed",
              status: "warning",
              message:
                "Background image doesn't fully extend to the bleed edge. This may leave white edges after trimming.",
            });
          } else {
            results.push({
              label: "Background reaches bleed",
              status: "passed",
              message: "Background extends to bleed area.",
            });
          }
          continue;
        }

        // Check safe zone
        if (
          el.x < safeLeft ||
          el.y < safeTop ||
          el.x + el.w > safeRight ||
          el.y + el.h > safeBottom
        ) {
          elementsOutsideSafe++;
        }

        // Check near trim (within 2mm)
        const nearTrimThreshold = 2;
        if (
          el.x < trimLeft + nearTrimThreshold ||
          el.y < trimTop + nearTrimThreshold ||
          el.x + el.w > trimRight - nearTrimThreshold ||
          el.y + el.h > trimBottom - nearTrimThreshold
        ) {
          elementsNearTrim++;
        }

        // Check image DPI
        if (el.type === "image" && el.dpi && el.dpi < 150) {
          lowDpiImages++;
        }

        // Check text size (6pt minimum)
        if (el.type === "text" && el.fontSizeMm && el.fontSizeMm < 2.1) {
          // 6pt ≈ 2.12mm
          tinyText++;
        }
      }

      // Safe zone check
      if (elementsOutsideSafe > 0) {
        results.push({
          label: "Elements within safe zone",
          status: "warning",
          message: `${elementsOutsideSafe} element${elementsOutsideSafe > 1 ? "s" : ""} extend beyond the safe zone. Important content may be cut off.`,
        });
      } else {
        results.push({
          label: "Elements within safe zone",
          status: "passed",
          message: "All elements are within the safe zone.",
        });
      }

      // Background check
      if (!hasBackground) {
        results.push({
          label: "Background reaches bleed",
          status: "warning",
          message:
            "No background layer detected. The label will have a white background which may show white edges after trimming.",
        });
      }

      // Image DPI check
      if (lowDpiImages > 0) {
        results.push({
          label: "Image resolution",
          status: "error",
          message: `${lowDpiImages} image${lowDpiImages > 1 ? "s" : ""} below 150 DPI at current size. These may print poorly. Use higher resolution images.`,
        });
      } else {
        results.push({
          label: "Image resolution",
          status: "passed",
          message: "All images are at acceptable resolution.",
        });
      }

      // Text size check
      if (tinyText > 0) {
        results.push({
          label: "Text size",
          status: "warning",
          message: `${tinyText} text element${tinyText > 1 ? "s" : ""} below 6pt (2mm). Very small text may be unreadable in print.`,
        });
      } else {
        results.push({
          label: "Text size",
          status: "passed",
          message: "All text elements are above minimum readable size.",
        });
      }

      // Near trim check
      if (elementsNearTrim > 0) {
        results.push({
          label: "Elements near trim",
          status: "warning",
          message: `${elementsNearTrim} element${elementsNearTrim > 1 ? "s" : ""} within 2mm of the trim line. These may be partially cut off.`,
        });
      } else {
        results.push({
          label: "Elements near trim",
          status: "passed",
          message: "No elements dangerously close to trim line.",
        });
      }
    }

    // ─── AI-based check: text contrast ───
    if (canvasImageBase64) {
      try {
        const model = getVisionModel();
        const imageData = base64ToInlineData(canvasImageBase64);

        const contrastResult = await model.generateContent([
          imageData,
          {
            text: `You are a print quality inspector. Look at this coffee bag label design and evaluate the text contrast and legibility.

Is all text clearly readable against its background? Are there any areas where text blends into the background or has poor contrast?

Return ONLY a JSON object with these exact keys:
- "status": "passed" | "warning" | "error"
- "message": a brief explanation (1-2 sentences)

Example: {"status": "warning", "message": "The body text in the lower section has low contrast against the dark background. Consider using a lighter colour or adding a text shadow."}

No other text, just the JSON object.`,
          },
        ]);

        const text = contrastResult.response.text();
        try {
          const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const contrast = JSON.parse(cleaned);
          results.push({
            label: "Text contrast",
            status: contrast.status || "passed",
            message: contrast.message || "Text contrast is acceptable.",
          });
        } catch {
          results.push({
            label: "Text contrast",
            status: "passed",
            message: "Unable to evaluate text contrast automatically.",
          });
        }
      } catch {
        results.push({
          label: "Text contrast",
          status: "warning",
          message: "Could not perform AI contrast check. Please verify text is readable manually.",
        });
      }
    }

    // Separate results by status
    const passed = results.filter((r) => r.status === "passed");
    const warnings = results.filter((r) => r.status === "warning");
    const errors = results.filter((r) => r.status === "error");

    return NextResponse.json({ passed, warnings, errors });
  } catch (error) {
    console.error("Print readiness check error:", error);
    return NextResponse.json(
      { error: "Failed to check print readiness" },
      { status: 500 }
    );
  }
}
