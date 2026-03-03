import { NextResponse } from "next/server";
import sharp from "sharp";

// Expected print dimensions at 300 DPI
const TRIM_WIDTH = 1110; // 94mm at 300 DPI
const TRIM_HEIGHT = 1654; // 140mm at 300 DPI
const BLEED_WIDTH = 1181; // 100mm at 300 DPI
const BLEED_HEIGHT = 1724; // 146mm at 300 DPI
const TOLERANCE = 0.1; // 10% tolerance
const MIN_DPI = 200;

function isWithinTolerance(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) / expected <= TOLERANCE;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // PDF files skip dimension validation (vector-based)
    if (file.type === "application/pdf") {
      return NextResponse.json({ ok: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Could not read image dimensions" },
        { status: 400 }
      );
    }

    const { width, height, density } = metadata;
    const warnings: string[] = [];

    // Check DPI
    const dpi = density || 72;
    let dpiWarning: string | null = null;
    if (dpi < MIN_DPI) {
      dpiWarning = `Image resolution is ${dpi} DPI. We recommend at least 300 DPI for sharp printing. Your label may appear blurry.`;
    }

    // Check dimensions against trim (1110x1654) and bleed (1181x1724)
    const matchesTrim =
      isWithinTolerance(width, TRIM_WIDTH) &&
      isWithinTolerance(height, TRIM_HEIGHT);
    const matchesBleed =
      isWithinTolerance(width, BLEED_WIDTH) &&
      isWithinTolerance(height, BLEED_HEIGHT);

    if (matchesTrim || matchesBleed) {
      // Within 10% — auto-resize to exact target
      const targetW = matchesBleed ? BLEED_WIDTH : TRIM_WIDTH;
      const targetH = matchesBleed ? BLEED_HEIGHT : TRIM_HEIGHT;

      if (width !== targetW || height !== targetH) {
        // Resize the image
        await sharp(buffer)
          .resize(targetW, targetH, { fit: "fill" })
          .toBuffer();

        warnings.push(
          `Image was ${width}x${height}px, resized to ${targetW}x${targetH}px to match label dimensions.`
        );
      }

      return NextResponse.json({
        ok: true,
        warning: warnings.length > 0 ? warnings.join(" ") : null,
        dpiWarning,
        dimensions: { width, height, density: dpi },
      });
    }

    // More than 10% off — reject
    return NextResponse.json(
      {
        error: `Image dimensions (${width}x${height}px) don't match the required label size. Expected approximately ${TRIM_WIDTH}x${TRIM_HEIGHT}px (trim) or ${BLEED_WIDTH}x${BLEED_HEIGHT}px (with bleed). Please resize your image or use our Label Maker to design a correctly sized label.`,
      },
      { status: 422 }
    );
  } catch (error) {
    console.error("Validate upload error:", error);
    return NextResponse.json(
      { error: "Failed to validate upload" },
      { status: 500 }
    );
  }
}
