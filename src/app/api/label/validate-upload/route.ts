import { NextResponse } from "next/server";
import sharp from "sharp";

// Expected print dimensions at 300 DPI (canvas = 106×156mm, trim + 2mm bleed each side)
const LABEL_WIDTH = 1252; // 106mm at 300 DPI
const LABEL_HEIGHT = 1843; // 156mm at 300 DPI
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

    // Check dimensions against label size (1252x1843)
    const matchesLabel =
      isWithinTolerance(width, LABEL_WIDTH) &&
      isWithinTolerance(height, LABEL_HEIGHT);

    if (matchesLabel) {
      // Within 10% — auto-resize to exact target
      if (width !== LABEL_WIDTH || height !== LABEL_HEIGHT) {
        await sharp(buffer)
          .resize(LABEL_WIDTH, LABEL_HEIGHT, { fit: "fill" })
          .toBuffer();

        warnings.push(
          `Image was ${width}x${height}px, resized to ${LABEL_WIDTH}x${LABEL_HEIGHT}px to match label dimensions.`
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
        error: `Image dimensions (${width}x${height}px) don't match the required label size. Expected approximately ${LABEL_WIDTH}x${LABEL_HEIGHT}px (106\u00d7156mm at 300 DPI, includes 2mm bleed). Please resize your image or use our Label Maker to design a correctly sized label.`,
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
