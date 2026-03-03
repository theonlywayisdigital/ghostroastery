import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("bag_sizes")
      .select("id, name, description, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Bag sizes fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bag sizes" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { bagSizes: data || [] },
      {
        headers: {
          "Cache-Control":
            "public, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Bag sizes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
