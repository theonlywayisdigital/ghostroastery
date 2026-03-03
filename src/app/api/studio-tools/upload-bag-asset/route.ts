import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const ALLOWED_BUCKETS = ["bag-lighting-maps", "bag-images-hq"] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

export async function POST(req: Request) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bucket = formData.get("bucket") as string | null;
    const filename = formData.get("filename") as string | null;

    if (!file || !bucket || !filename) {
      return NextResponse.json(
        { error: "Missing file, bucket, or filename" },
        { status: 400 }
      );
    }

    if (!ALLOWED_BUCKETS.includes(bucket as AllowedBucket)) {
      return NextResponse.json(
        { error: `Invalid bucket. Allowed: ${ALLOWED_BUCKETS.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Ensure bucket exists (create if not)
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((b) => b.name === bucket);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucket, { public: true });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload (upsert to allow overwriting)
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filename, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { error: `Upload failed: ${err instanceof Error ? err.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
