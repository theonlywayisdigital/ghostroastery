import { NextResponse } from "next/server";
import { createAuthServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = await createAuthServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch labels without canvas_json for performance
    const { data: labels, error } = await supabase
      .from("labels")
      .select("id, name, thumbnail_url, pdf_url, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("List labels error:", error);
      return NextResponse.json(
        { error: "Failed to fetch labels" },
        { status: 500 }
      );
    }

    return NextResponse.json({ labels: labels || [] });
  } catch (error) {
    console.error("List labels error:", error);
    return NextResponse.json(
      { error: "Failed to fetch labels" },
      { status: 500 }
    );
  }
}
