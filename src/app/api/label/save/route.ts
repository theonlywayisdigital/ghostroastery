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
      bleedMm: dimensions.bleedMm ?? 2,
    });
    console.log("[label/save] PDF generated:", filename, pdfBuffer.length);

    // Generate preview PNG (800px wide for thumbnails/previews)
    const previewBuffer = await sharp(canvasPng)
      .resize(800, null, { fit: "inside" })
      .png({ quality: 80 })
      .toBuffer();
    console.log("[label/save] Preview generated:", previewBuffer.length);

    // Embed 300 DPI metadata into print PNG so image viewers show correct resolution
    const printPngBuffer = await sharp(canvasPng)
      .withMetadata({ density: 300 })
      .png()
      .toBuffer();
    console.log("[label/save] Print PNG with DPI metadata:", printPngBuffer.length);

    // Prepare canvas JSON buffer
    const canvasJsonBuffer = Buffer.from(canvasJson, "utf-8");

    // Determine label ID (update existing or create new)
    const id = labelId || crypto.randomUUID();
    const basePath = `labels/${user.id}/${id}`;
    console.log("[label/save] Uploading to:", basePath);

    // Upload to storage using service role client (bypasses RLS on storage)
    const supabaseStorage = createServerClient();

    const [previewUpload, printUpload, canvasJsonUpload, pdfUpload] =
      await Promise.all([
        supabaseStorage.storage
          .from("label-files")
          .upload(`${basePath}/preview.png`, previewBuffer, {
            contentType: "image/png",
            upsert: true,
          }),
        supabaseStorage.storage
          .from("label-files")
          .upload(`${basePath}/print.png`, printPngBuffer, {
            contentType: "image/png",
            upsert: true,
          }),
        supabaseStorage.storage
          .from("label-files")
          .upload(`${basePath}/canvas.json`, canvasJsonBuffer, {
            contentType: "application/json",
            upsert: true,
          }),
        supabaseStorage.storage
          .from("label-files")
          .upload(`${basePath}/label.pdf`, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
          }),
      ]);

    if (previewUpload.error) {
      console.error("[label/save] Preview upload error:", previewUpload.error);
      return NextResponse.json(
        { error: "Failed to upload preview" },
        { status: 500 }
      );
    }
    if (printUpload.error) {
      console.error("[label/save] Print PNG upload error:", printUpload.error);
      return NextResponse.json(
        { error: "Failed to upload print PNG" },
        { status: 500 }
      );
    }
    if (canvasJsonUpload.error) {
      console.error(
        "[label/save] Canvas JSON upload error:",
        canvasJsonUpload.error
      );
      // Non-fatal — canvas JSON is also stored in DB
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
    const { data: previewUrlData } = supabaseStorage.storage
      .from("label-files")
      .getPublicUrl(`${basePath}/preview.png`);
    const { data: printUrlData } = supabaseStorage.storage
      .from("label-files")
      .getPublicUrl(`${basePath}/print.png`);
    const { data: pdfUrlData } = supabaseStorage.storage
      .from("label-files")
      .getPublicUrl(`${basePath}/label.pdf`);

    // Upsert label record (using auth client so RLS is enforced)
    console.log("[label/save] Upserting to DB...");
    const { data: label, error: dbError } = await supabaseAuth
      .from("labels")
      .upsert(
        {
          id,
          user_id: user.id,
          name: name || "Untitled Label",
          thumbnail_url: previewUrlData.publicUrl,
          canvas_json: JSON.parse(canvasJson),
          pdf_url: pdfUrlData.publicUrl,
          print_url: printUrlData.publicUrl,
        },
        { onConflict: "id" }
      )
      .select(
        "id, name, thumbnail_url, pdf_url, print_url, created_at, updated_at"
      )
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
