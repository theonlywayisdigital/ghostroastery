import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export const revalidate = 300; // ISR: revalidate every 5 minutes

export async function GET() {
  try {
    const supabase = createServerClient();

    const [bracketsResult, pricesResult, settingsResult] = await Promise.all([
      supabase
        .from("pricing_tier_brackets")
        .select("id, min_quantity, max_quantity, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("pricing_tier_prices")
        .select("id, bracket_id, bag_size, price_per_bag, shipping_cost, currency")
        .eq("is_active", true),
      supabase
        .from("builder_settings")
        .select("max_order_quantity, wholesale_threshold")
        .limit(1)
        .single(),
    ]);

    if (bracketsResult.error) {
      console.error("Brackets fetch error:", bracketsResult.error);
      return NextResponse.json(
        { error: "Failed to fetch pricing" },
        { status: 500 }
      );
    }

    if (pricesResult.error) {
      console.error("Prices fetch error:", pricesResult.error);
      return NextResponse.json(
        { error: "Failed to fetch pricing" },
        { status: 500 }
      );
    }

    const brackets = (bracketsResult.data || []).map((b) => ({
      id: b.id,
      min: b.min_quantity,
      max: b.max_quantity,
      sortOrder: b.sort_order,
    }));

    const prices = (pricesResult.data || []).map((p) => ({
      id: p.id,
      bracketId: p.bracket_id,
      bagSize: p.bag_size,
      pricePerBag: Number(p.price_per_bag),
      shippingCost: Number(p.shipping_cost),
      currency: p.currency,
    }));

    // min order derived from lowest bracket
    const minOrder = brackets.length > 0
      ? Math.min(...brackets.map((b) => b.min))
      : 25;

    const maxOrder = settingsResult.data?.max_order_quantity ?? 99;

    return NextResponse.json(
      { brackets, prices, minOrder, maxOrder },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Pricing API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
