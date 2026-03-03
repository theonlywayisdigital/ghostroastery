import { NextResponse } from "next/server";
import { createAuthServerClient, createServerClient } from "@/lib/supabase";

// GET: Fetch a single label with full canvas_json
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

    const { data: label, error } = await supabase
      .from("labels")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !label) {
      return NextResponse.json({ error: "Label not found" }, { status: 404 });
    }

    return NextResponse.json({ label });
  } catch (error) {
    console.error("Get label error:", error);
    return NextResponse.json(
      { error: "Failed to fetch label" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a label and its storage files
export async function DELETE(
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

    // Delete DB record (RLS ensures user can only delete own)
    const { error: dbError } = await supabase
      .from("labels")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (dbError) {
      console.error("Delete label DB error:", dbError);
      return NextResponse.json(
        { error: "Failed to delete label" },
        { status: 500 }
      );
    }

    // Clean up storage files (best effort, use service role)
    const supabaseStorage = createServerClient();
    const basePath = `labels/${user.id}/${id}`;

    const { data: files } = await supabaseStorage.storage
      .from("label-files")
      .list(basePath);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${basePath}/${f.name}`);
      await supabaseStorage.storage.from("label-files").remove(filePaths);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete label error:", error);
    return NextResponse.json(
      { error: "Failed to delete label" },
      { status: 500 }
    );
  }
}
