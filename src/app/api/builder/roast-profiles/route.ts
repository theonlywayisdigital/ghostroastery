import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("roast_profiles")
      .select(
        "id, name, slug, descriptor, tasting_notes, roast_level, is_decaf, badge, image_url, sort_order, is_active"
      )
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Roast profiles fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch roast profiles" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { roastProfiles: data || [] },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Roast profiles error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
