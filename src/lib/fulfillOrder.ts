import { createServerClient } from "@/lib/supabase";
import { client } from "@/sanity/lib/client";
import { siteSettingsQuery } from "@/sanity/lib/queries";
import {
  sendOrderConfirmationEmail,
  sendAdminOrderNotification,
  sendRoasteryOrderNotification,
  sendGhostRoasterOrderNotification,
  sendAccountActivationEmail,
} from "@/lib/resend";
import { generateMockup } from "@/lib/generateMockup";
import { addBusinessDays } from "@/lib/businessDays";
import { getPartnerForOrder, getPartnerRate } from "@/lib/partnerRouting";
import type Stripe from "stripe";
import type { Json } from "@/types/database";

/**
 * Shared order fulfillment function called by both:
 * 1. The success page (primary path — works without webhooks in dev)
 * 2. The Stripe webhook (backup path — ensures reliability in production)
 *
 * This function is idempotent: if the order already exists for the given
 * Stripe session, it returns the existing order without creating a duplicate.
 */
export async function fulfillOrder(session: Stripe.Checkout.Session) {
  const supabase = createServerClient();
  const metadata = session.metadata || {};

  // Idempotency check: return existing order if already fulfilled
  const { data: existingOrder } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", session.id)
    .single();

  if (existingOrder) {
    return { order: existingOrder, alreadyFulfilled: true };
  }

  // Build delivery address from Stripe shipping
  const shipping = session.collected_information?.shipping_details;
  const deliveryAddress = shipping
    ? {
        name: shipping.name || "",
        line1: shipping.address?.line1 || "",
        line2: shipping.address?.line2 || undefined,
        city: shipping.address?.city || "",
        state: shipping.address?.state || undefined,
        postal_code: shipping.address?.postal_code || "",
        country: shipping.address?.country || "GB",
      }
    : null;

  // Save order to Supabase
  const { data: order, error: dbError } = await supabase
    .from("orders")
    .insert({
      user_id: metadata.user_id || null,
      brand_name: metadata.brand_name || null,
      customer_email:
        session.customer_email || metadata.customer_email || "",
      customer_name: shipping?.name || null,
      bag_colour: metadata.bag_colour,
      bag_size: metadata.bag_size,
      roast_profile: metadata.roast_profile,
      grind: metadata.grind,
      quantity: parseInt(metadata.quantity, 10),
      price_per_bag: parseFloat(metadata.price_per_bag),
      total_price: parseFloat(metadata.total_price),
      label_file_url: metadata.label_file_url || null,
      delivery_address: deliveryAddress as unknown as Json,
      stripe_session_id: session.id,
      stripe_payment_id: session.payment_intent as string,
      payment_status: "paid",
      order_status: "Pending",
      pricing_bracket_id: metadata.pricing_bracket_id || null,
    })
    .select()
    .single();

  if (dbError) {
    // If it's a unique constraint violation, another process already created it
    if (dbError.code === "23505") {
      const { data: raceOrder } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", session.id)
        .single();
      return { order: raceOrder, alreadyFulfilled: true };
    }
    console.error("Failed to save order:", dbError);
    throw new Error(`Failed to save order: ${dbError.message}`);
  }

  // ── Account linking & role grant ──
  // Link order to existing user or create a new account
  try {
    const customerEmail = order.customer_email;
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || process.env.PORTAL_URL || "https://portal.ghostroasting.co.uk";

    if (customerEmail) {
      // Check if a public.users row exists for this email
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", customerEmail)
        .single();

      let userId = existingUser?.id ?? metadata.user_id ?? null;

      if (existingUser) {
        // User exists — link the order if not already linked
        if (!order.user_id) {
          await supabase
            .from("orders")
            .update({ user_id: existingUser.id })
            .eq("id", order.id);
        }
        userId = existingUser.id;
      } else {
        // No account yet — create one via Supabase Auth admin API
        // This triggers handle_new_user() which creates the public.users row
        const { data: newAuth, error: authError } =
          await supabase.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
            user_metadata: {
              full_name: order.customer_name || "",
            },
          });

        if (!authError && newAuth?.user) {
          userId = newAuth.user.id;

          // Link order to the new user
          await supabase
            .from("orders")
            .update({ user_id: userId })
            .eq("id", order.id);

          // Generate a magic link for account activation
          const { data: linkData } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: customerEmail,
            options: {
              redirectTo: `${portalUrl}/my-orders`,
            },
          });

          // Send activation email (non-blocking)
          if (linkData?.properties?.action_link) {
            sendAccountActivationEmail({
              customerEmail,
              customerName: order.customer_name || "there",
              activationLink: linkData.properties.action_link,
              portalUrl,
            }).catch((err) => {
              console.error("Failed to send account activation email:", err);
            });
          }
        } else if (authError) {
          console.error("Failed to create auth user for customer:", authError.message);
        }
      }

      // Grant ghost_roastery_customer role if we have a user ID
      if (userId) {
        await supabase.from("user_roles").upsert(
          { user_id: userId, role_id: "ghost_roastery_customer" },
          { onConflict: "user_id,role_id,roaster_id" }
        );
      }
    }
  } catch (accountError) {
    // Account linking failure should never block the order
    console.error("Account linking failed:", accountError);
  }

  // ── Partner routing via territories ──
  // Look up partner_territories to find the fulfilment partner for this order.
  // Falls back to head_office if no partner assigned for the delivery country.
  try {
    const deliveryCountry = deliveryAddress?.country || "GB";

    // Update delivery_country on the order
    await supabase
      .from("orders")
      .update({ delivery_country: deliveryCountry })
      .eq("id", order.id);

    const partnerMatch = await getPartnerForOrder(deliveryCountry);

    if (partnerMatch) {
      // Partner found — calculate rate and assign
      const partnerRate = await getPartnerRate(
        partnerMatch.roasterId,
        order.bag_size,
        order.quantity
      );

      // If partner has no rate for this bag size, fall back to head office
      if (partnerRate === null) {
        console.warn(
          `Partner ${partnerMatch.roasterId} has no rate for ${order.bag_size}, falling back to head office`
        );
        await supabase
          .from("orders")
          .update({ fulfilment_type: "head_office", routed_at: new Date().toISOString() })
          .eq("id", order.id);
      } else {
        const partnerPayoutTotal = partnerRate * order.quantity;
        const dispatchDeadline = addBusinessDays(new Date(), 4);

        // Create roaster_orders record
        await supabase.from("roaster_orders").insert({
          order_id: order.id,
          roaster_id: partnerMatch.roasterId,
          status: "pending",
          dispatch_deadline: dispatchDeadline.toISOString(),
        });

        // Update the order with partner assignment and rate snapshot
        await supabase
          .from("orders")
          .update({
            roaster_id: partnerMatch.roasterId,
            partner_roaster_id: partnerMatch.roasterId,
            partner_rate_per_bag: partnerRate,
            partner_payout_total: partnerPayoutTotal,
            fulfilment_type: "partner",
            routed_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        // Record platform fee ledger entry
        supabase
          .from("platform_fee_ledger")
          .insert({
            roaster_id: partnerMatch.roasterId,
            order_type: "ghost_roastery",
            reference_id: order.id,
            gross_amount: order.total_price,
            fee_amount: order.total_price - partnerPayoutTotal,
            fee_percent: null,
            net_to_roaster: partnerPayoutTotal,
            currency: "GBP",
            stripe_payment_id: order.stripe_payment_id,
            status: "collected",
          })
          .then(({ error: ledgerError }) => {
            if (ledgerError) console.error("Failed to write ledger entry:", ledgerError);
          });

        // Fetch partner details for notification
        const { data: roaster } = await supabase
          .from("partner_roasters")
          .select("email, contact_name")
          .eq("id", partnerMatch.roasterId)
          .single();

        if (roaster) {
          // Send notification to partner (non-blocking)
          const portalUrl = process.env.PORTAL_URL || "https://portal.ghostroasting.co.uk";
          sendGhostRoasterOrderNotification({
            roasterEmail: roaster.email,
            roasterName: roaster.contact_name,
            orderNumber: order.order_number,
            brandName: metadata.brand_name || null,
            bagSize: order.bag_size,
            roastProfile: order.roast_profile,
            grind: order.grind,
            quantity: order.quantity,
            dispatchDeadline: dispatchDeadline.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            portalUrl: `${portalUrl}/ghost-orders`,
          }).catch((err: unknown) => {
            console.error("Failed to send partner notification:", err);
          });
        }
      }
    } else {
      // No partner for this territory — head office fulfilment
      await supabase
        .from("orders")
        .update({ fulfilment_type: "head_office", routed_at: new Date().toISOString() })
        .eq("id", order.id);
    }
  } catch (routingError) {
    // Routing failure should never block the order — defaults to head_office
    console.error("Partner routing failed:", routingError);
  }

  // Generate mockup image (non-blocking — don't fail the order)
  // We fire-and-forget: generates the image, uploads to Sanity, updates the order row.
  generateMockup(metadata.bag_colour, metadata.label_file_url || null)
    .then(async (mockupUrl) => {
      if (mockupUrl && order) {
        await supabase
          .from("orders")
          .update({ mockup_image_url: mockupUrl })
          .eq("id", order.id);
      }
    })
    .catch((err) => {
      console.error("Mockup generation failed:", err);
    });

  // Send emails (non-blocking — don't fail the order)
  try {
    const siteSettings = await client.fetch(siteSettingsQuery);
    const adminEmail =
      siteSettings?.adminEmail ||
      process.env.ADMIN_EMAIL ||
      "admin@ghostroastery.com";
    const roasteryEmail = siteSettings?.roasteryEmail || adminEmail;
    const turnaroundDays = "7–10 working days";

    const emailData = {
      orderNumber: order.order_number,
      customerEmail: order.customer_email,
      customerName: order.customer_name || "Customer",
      bagSize: order.bag_size,
      bagColour: order.bag_colour,
      roastProfile: order.roast_profile,
      grind: order.grind,
      quantity: order.quantity,
      pricePerBag: order.price_per_bag,
      totalPrice: order.total_price,
      labelFileUrl: order.label_file_url,
      deliveryAddress: deliveryAddress,
      stripeSessionId: session.id,
      stripePaymentId: (session.payment_intent as string) || "",
      turnaroundDays,
    };

    Promise.allSettled([
      sendOrderConfirmationEmail(emailData),
      sendAdminOrderNotification({ ...emailData, adminEmail }),
      sendRoasteryOrderNotification({ ...emailData, roasteryEmail }),
    ]).then((results) => {
      results.forEach((result, i) => {
        if (result.status === "rejected") {
          const names = ["customer", "admin", "roastery"];
          console.error(`Failed to send ${names[i]} email:`, result.reason);
        }
      });
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
  }

  return { order, alreadyFulfilled: false };
}
