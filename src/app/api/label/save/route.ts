import { NextResponse } from "next/server";
import { createAuthServerClient, createServerClient } from "@/lib/supabase";
import { generateLabelPdf } from "@/lib/generateLabelPdf";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    console.log("[label/save] Starting save...");
    const supabaseAuth = await createAuthServerClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (!user) {
      console.log("[label/save] No user found in session");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("[label/save] User:", user.id);

    const { canvasJson, canvasImageBase64, name, labelId, dimensions } =
      await request.json();

    if (!canvasJson || !canvasImageBase64) {
      return NextResponse.json(
        { error: "Canvas data is required" },
        { status: 400 }
      );
    }

    if (!dimensions?.widthMm || !dimensions?.heightMm) {
      return NextResponse.json(
        { error: "Label dimensions are required" },
        { status: 400 }
      );
    }

    // Decode canvas image
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
    console.log("[label/save] Image decoded, size:", canvasPng.length);

    // Generate PDF
    console.log("[label/save] Generating PDF...");
    const { pdfBuffer, filename } = await generateLabelPdf({
      canvasPng,
      widthMm: dimensions.widthMm,
      heightMm: dimensions.heightMm,
      bleedMm: dimensions.bleedMm ?? 3,
    });
    console.log("[label/save] PDF generated:", filename, pdfBuffer.length);

    // Generate thumbnail (400px wide)
    const thumbnailBuffer = await sharp(canvasPng)
      .resize(400, null, { fit: "inside" })
      .png({ quality: 80 })
      .toBuffer();
    console.log("[label/save] Thumbnail generated:", thumbnailBuffer.length);

    // Determine label ID (update existing or create new)
    const id = labelId || crypto.randomUUID();
    const basePath = `labels/${user.id}/${id}`;
    console.log("[label/save] Uploading to:", basePath);

    // Upload to storage using service role client (bypasses RLS on storage)
    const supabaseStorage = createServerClient();

    const [thumbnailUpload, pdfUpload] = await Promise.all([
      supabaseStorage.storage
        .from("label-files")
        .upload(`${basePath}/thumbnail.png`, thumbnailBuffer, {
          contentType: "image/png",
          upsert: true,
        }),
      supabaseStorage.storage
        .from("label-files")
        .upload(`${basePath}/${filename}`, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        }),
    ]);

    if (thumbnailUpload.error) {
      console.error("[label/save] Thumbnail upload error:", thumbnailUpload.error);
      return NextResponse.json(
        { error: "Failed to upload thumbnail" },
        { status: 500 }
      );
    }
    if (pdfUpload.error) {
      console.error("[label/save] PDF upload error:", pdfUpload.error);
      return NextResponse.json(
        { error: "Failed to upload PDF" },
        { status: 500 }
      );
    }
    console.log("[label/save] Storage uploads complete");

    // Get public URLs
    const { data: thumbUrlData } = supabaseStorage.storage
      .from("label-files")
      .getPublicUrl(`${basePath}/thumbnail.png`);
    const { data: pdfUrlData } = supabaseStorage.storage
      .from("label-files")
      .getPublicUrl(`${basePath}/${filename}`);

    // Upsert label record (using auth client so RLS is enforced)
    console.log("[label/save] Upserting to DB...");
    const { data: label, error: dbError } = await supabaseAuth
      .from("labels")
      .upsert(
        {
          id,
          user_id: user.id,
          name: name || "Untitled Label",
          thumbnail_url: thumbUrlData.publicUrl,
          canvas_json: JSON.parse(canvasJson),
          pdf_url: pdfUrlData.publicUrl,
        },
        { onConflict: "id" }
      )
      .select("id, name, thumbnail_url, pdf_url, created_at, updated_at")
      .single();

    if (dbError) {
      console.error("[label/save] DB upsert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save label: " + dbError.message },
        { status: 500 }
      );
    }

    console.log("[label/save] Success! Label ID:", label?.id);
    return NextResponse.json({ label });
  } catch (error) {
    console.error("[label/save] Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to save label: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
