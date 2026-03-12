import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { createServerClient } from "@/lib/supabase";
import { fulfillOrder } from "@/lib/fulfillOrder";
import { SuccessClient } from "./SuccessClient";
import type { DeliveryAddressJson } from "@/types/database";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id } = await searchParams;

  if (!session_id) {
    redirect("/build");
  }

  // Fetch Stripe session
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/build");
  }

  if (session.payment_status !== "paid") {
    redirect("/build");
  }

  // Check if order already exists
  const supabase = createServerClient();
  let { data: order } = await supabase
    .from("ghost_orders")
    .select("*")
    .eq("stripe_session_id", session_id)
    .single();

  // If order doesn't exist yet (webhook hasn't fired), create it now
  if (!order) {
    try {
      const result = await fulfillOrder(session);
      order = result.order;
    } catch (err) {
      console.error("Failed to fulfill order from success page:", err);
    }
  }

  const turnaroundDays = "7–10 working days";

  // Extract delivery address
  const deliveryAddress = order?.delivery_address as DeliveryAddressJson | null;

  return (
    <SuccessClient
      orderNumber={order?.order_number || "Processing…"}
      bagSize={order?.bag_size || session.metadata?.bag_size || ""}
      bagColour={order?.bag_colour || session.metadata?.bag_colour || ""}
      roastProfile={
        order?.roast_profile || session.metadata?.roast_profile || ""
      }
      grind={order?.grind || session.metadata?.grind || ""}
      quantity={
        order?.quantity || parseInt(session.metadata?.quantity || "0", 10)
      }
      pricePerBag={
        order?.price_per_bag ||
        parseFloat(session.metadata?.price_per_bag || "0")
      }
      totalPrice={
        order?.total_price ||
        parseFloat(session.metadata?.total_price || "0")
      }
      labelFileUrl={order?.label_file_url || null}
      mockupImageUrl={order?.mockup_image_url || null}
      brandName={order?.brand_name || session.metadata?.brand_name || ""}
      turnaroundDays={turnaroundDays}
      deliveryAddress={
        deliveryAddress
          ? {
              name: deliveryAddress.name,
              line1: deliveryAddress.line1,
              line2: deliveryAddress.line2 ?? undefined,
              city: deliveryAddress.city,
              postalCode: deliveryAddress.postal_code || deliveryAddress.postcode || "",
            }
          : null
      }
    />
  );
}

export const metadata = {
  title: "Order Confirmed | Ghost Roastery",
  description: "Your custom coffee order has been confirmed.",
};
