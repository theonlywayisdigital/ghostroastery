import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { sendOrderStatusUpdateEmail } from "@/lib/resend";

const VALID_STATUSES = ["Pending", "In Production", "Dispatched", "Delivered"];

export async function POST(req: NextRequest) {
  // Validate webhook secret
  const secret = req.headers.get("x-webhook-secret");
  if (!secret || secret !== process.env.ORDER_STATUS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { order_id, new_status } = body;

    if (!order_id || !new_status) {
      return NextResponse.json(
        { error: "order_id and new_status are required" },
        { status: 400 }
      );
    }

    if (!VALID_STATUSES.includes(new_status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Fetch order
    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ order_status: new_status })
      .eq("id", order_id);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return NextResponse.json(
        { error: "Failed to update order status" },
        { status: 500 }
      );
    }

    // Send status update email
    try {
      await sendOrderStatusUpdateEmail({
        orderNumber: order.order_number,
        customerEmail: order.customer_email,
        customerName: order.customer_name || "Customer",
        newStatus: new_status,
        bagSize: order.bag_size,
        roastProfile: order.roast_profile,
        quantity: order.quantity,
      });
    } catch (emailError) {
      console.error("Error sending status update email:", emailError);
      // Don't fail the webhook if email fails — status is already updated
    }

    return NextResponse.json({
      success: true,
      order_number: order.order_number,
      new_status,
    });
  } catch (error) {
    console.error("Order status webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
