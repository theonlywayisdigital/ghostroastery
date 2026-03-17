import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase";
import { generateLabelPdf } from "@/lib/generateLabelPdf";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createAuthServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch label (RLS ensures user can only access own labels)
    const { data: label, error } = await supabase
      .from("labels")
      .select("id, name, print_url")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    if (!label.print_url) {
      return NextResponse.json(
        { error: "Print file not available for this label" },
        { status: 404 }
      );
    }

    // Fetch print PNG from storage URL
    const printResponse = await fetch(label.print_url);
    if (!printResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch print file" },
        { status: 500 }
      );
    }
    const canvasPng = Buffer.from(await printResponse.arrayBuffer());

    // Generate PDF on-demand (106mm × 156mm — trim + 2mm bleed each side)
    const { pdfBuffer } = await generateLabelPdf({
      canvasPng,
      widthMm: 102,
      heightMm: 152,
      bleedMm: 2,
    });

    const safeName = (label.name || "label").replace(/[^a-zA-Z0-9_-]/g, "_");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
        "Content-Length": String(pdfBuffer.length),
      },
    });
  } catch (error) {
    console.error("Download PDF error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
