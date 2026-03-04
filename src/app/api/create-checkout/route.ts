import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { client } from "@/sanity/lib/client";
import { createServerClient } from "@/lib/supabase";
import { getPriceForQuantity } from "@/lib/pricing";
import type { PricingData } from "@/lib/pricing";

// Sanity write client for uploading label files
const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const brandName = (formData.get("brandName") as string) || "";
    const bagSize = formData.get("bagSize") as string;
    const bagSizeName = formData.get("bagSizeName") as string;
    const bagColour = formData.get("bagColour") as string;
    const roastProfile = formData.get("roastProfile") as string;
    const roastProfileSlug = formData.get("roastProfileSlug") as string;
    const grind = formData.get("grind") as string;
    const grindId = formData.get("grindId") as string;
    const quantity = parseInt(formData.get("quantity") as string, 10);
    const customerEmail = formData.get("customerEmail") as string;
    const userId = (formData.get("userId") as string) || null;
    const labelFile = formData.get("labelFile") as File | null;
    const labelPdfUrl = (formData.get("labelPdfUrl") as string) || null;
    const labelId = (formData.get("labelId") as string) || null;
    const labelPreviewUrl = (formData.get("labelPreviewUrl") as string) || null;

    // Validate required fields
    if (!bagSize || !bagColour || !roastProfile || !grind || !quantity) {
      return NextResponse.json(
        { error: "Missing required order fields" },
        { status: 400 }
      );
    }

    // Server-side price calculation from Supabase (source of truth)
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
        .select("max_order_quantity")
        .limit(1)
        .single(),
    ]);

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

    const minOrder = brackets.length > 0
      ? Math.min(...brackets.map((b) => b.min))
      : 25;
    const maxOrder = settingsResult.data?.max_order_quantity ?? 99;

    const pricingData: PricingData = { brackets, prices, minOrder, maxOrder };

    // Validate quantity range
    if (quantity < minOrder || quantity > maxOrder) {
      return NextResponse.json(
        { error: `Quantity must be between ${minOrder} and ${maxOrder}` },
        { status: 400 }
      );
    }

    const priceResult = getPriceForQuantity(quantity, bagSize, pricingData);

    if (!priceResult) {
      return NextResponse.json(
        { error: "Invalid bag size or quantity for pricing" },
        { status: 400 }
      );
    }

    const serverPricePerBag = priceResult.pricePerBag;
    const serverTotalPrice = serverPricePerBag * quantity;
    const shippingCost = priceResult.shippingCost || 0;

    // Upload label file to Sanity if provided, or use existing URL from Label Maker
    let labelFileUrl: string | null = null;
    if (labelFile && labelFile.size > 0) {
      try {
        const buffer = Buffer.from(await labelFile.arrayBuffer());
        const asset = await writeClient.assets.upload("file", buffer, {
          filename: labelFile.name,
          contentType: labelFile.type,
        });
        labelFileUrl = asset.url;
      } catch (uploadError) {
        console.error("Label file upload failed:", uploadError);
        // Continue without label — don't block checkout
      }
    } else if (labelPdfUrl) {
      // Label created via Label Maker — already uploaded to Supabase storage
      labelFileUrl = labelPdfUrl;
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail !== "guest@checkout.pending" ? customerEmail : undefined,
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${bagSizeName || bagSize} Custom Coffee Bags`,
              description: `${roastProfile} · ${grind} · ${bagColour}`,
            },
            unit_amount: Math.round(serverPricePerBag * 100), // Stripe uses pence
          },
          quantity,
        },
        ...(shippingCost > 0
          ? [
              {
                price_data: {
                  currency: "gbp" as const,
                  product_data: {
                    name: "Shipping",
                  },
                  unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      metadata: {
        brand_name: brandName,
        bag_size: bagSize,
        bag_colour: bagColour,
        roast_profile: roastProfile,
        roast_profile_slug: roastProfileSlug,
        grind,
        grind_id: grindId,
        quantity: String(quantity),
        price_per_bag: String(serverPricePerBag),
        total_price: String(serverTotalPrice),
        label_file_url: labelFileUrl || "",
        label_id: labelId || "",
        label_preview_url: labelPreviewUrl || "",
        user_id: userId || "",
        customer_email: customerEmail,
        pricing_bracket_id: priceResult.bracket.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")}/build/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || request.headers.get("origin")}/build?step=8`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
