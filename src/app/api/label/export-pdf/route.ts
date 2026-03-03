import { NextResponse } from "next/server";
import { generateLabelPdf } from "@/lib/generateLabelPdf";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { canvasImageBase64, dimensions } = await request.json();

    if (!canvasImageBase64 || typeof canvasImageBase64 !== "string") {
      return NextResponse.json(
        { error: "Canvas image is required" },
        { status: 400 }
      );
    }

    if (!dimensions?.widthMm || !dimensions?.heightMm) {
      return NextResponse.json(
        { error: "Label dimensions are required" },
        { status: 400 }
      );
    }

    // Convert base64 data URL to Buffer
    const base64Match = canvasImageBase64.match(
      /^data:image\/\w+;base64,(.+)$/
    );
    if (!base64Match) {
      return NextResponse.json(
        { error: "Invalid image data" },
        { status: 400 }
      );
    }
    const canvasPng = Buffer.from(base64Match[1], "base64");

    // Generate PDF with fixed dimensions
    const { pdfBuffer, previewPngBuffer, filename } = await generateLabelPdf({
      canvasPng,
      widthMm: dimensions.widthMm,
      heightMm: dimensions.heightMm,
      bleedMm: dimensions.bleedMm ?? 3,
    });

    // Upload to Supabase storage
    const supabase = createServerClient();
    const timestamp = Date.now();
    const pdfPath = `exports/${filename}`;
    const previewPath = `exports/preview-${timestamp}.png`;

    const [pdfUpload, previewUpload] = await Promise.all([
      supabase.storage
        .from("label-files")
        .upload(pdfPath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        }),
      supabase.storage
        .from("label-files")
        .upload(previewPath, previewPngBuffer, {
          contentType: "image/png",
          upsert: true,
        }),
    ]);

    if (pdfUpload.error) {
      console.error("PDF upload error:", pdfUpload.error);
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }

    if (previewUpload.error) {
      console.error("Preview upload error:", previewUpload.error);
      // Non-fatal — continue without preview
    }

    // Get public URLs
    const { data: pdfUrlData } = supabase.storage
      .from("label-files")
      .getPublicUrl(pdfPath);

    const { data: previewUrlData } = supabase.storage
      .from("label-files")
      .getPublicUrl(previewPath);

    return NextResponse.json({
      pdfUrl: pdfUrlData.publicUrl,
      previewPngUrl: previewUpload.error ? null : previewUrlData.publicUrl,
      filename,
    });
  } catch (error) {
    console.error("Export PDF error:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
