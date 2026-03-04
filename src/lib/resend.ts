import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ghostroasting.co.uk";
const FROM_EMAIL = "Ghost Roasting UK <noreply@ghostroasting.co.uk>";

// ── Ghost Roastery order email types ──

interface OrderEmailData {
  orderNumber: string;
  customerEmail: string | null;
  customerName: string;
  bagSize: string;
  bagColour: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  pricePerBag: number;
  totalPrice: number;
  labelFileUrl: string | null;
  deliveryAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  } | null;
  stripeSessionId: string;
  stripePaymentId: string;
  turnaroundDays: string;
}

interface AdminOrderEmailData extends OrderEmailData {
  adminEmail: string;
}

interface RoasteryOrderEmailData extends OrderEmailData {
  roasteryEmail: string;
}

interface GhostRoasterNotificationData {
  roasterEmail: string;
  roasterName: string;
  orderNumber: string;
  brandName: string | null;
  bagSize: string;
  roastProfile: string;
  grind: string;
  quantity: number;
  dispatchDeadline: string;
  portalUrl: string;
}

interface AccountActivationEmailData {
  customerEmail: string;
  customerName: string;
  activationLink: string;
  portalUrl: string;
}

interface OrderStatusUpdateEmailData {
  orderNumber: string;
  customerEmail: string | null;
  customerName: string;
  newStatus: string;
  bagSize: string;
  roastProfile: string;
  quantity: number;
}

interface WholesaleEnquiryEmailData {
  name: string;
  businessName: string;
  businessType: string;
  email: string;
  phone?: string;
  estimatedVolume: string;
  bagSizePreference: string;
  branded: string;
  message?: string;
}

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Format business type for display
function formatBusinessType(type: string): string {
  const types: Record<string, string> = {
    cafe: "Cafe / Coffee Shop",
    gym: "Gym & Fitness",
    office: "Office & Corporate",
    restaurant: "Restaurant",
    wellness: "Wellness Brand",
    entrepreneur: "Entrepreneur",
    other: "Other",
  };
  return types[type] || type;
}

// Format subject for display
function formatSubject(subject: string): string {
  const subjects: Record<string, string> = {
    general: "General enquiry",
    bespoke: "Bespoke order question",
    wholesale: "Wholesale question",
    press: "Press & partnerships",
    other: "Other",
  };
  return subjects[subject] || subject;
}

// Send wholesale enquiry confirmation to customer
export async function sendWholesaleConfirmationEmail(
  data: WholesaleEnquiryEmailData
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: "We've received your wholesale enquiry",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">Thanks for your enquiry, ${data.name}</h1>
          <p>We've received your wholesale enquiry for ${data.businessName}.</p>
          <p>Our team will review your requirements and get back to you within <strong>2 business days</strong>.</p>
          <h3>Your enquiry details:</h3>
          <ul>
            <li><strong>Business:</strong> ${data.businessName}</li>
            <li><strong>Type:</strong> ${formatBusinessType(data.businessType)}</li>
            <li><strong>Estimated volume:</strong> ${data.estimatedVolume} bags/month</li>
            <li><strong>Bag size:</strong> ${data.bagSizePreference}</li>
            <li><strong>Packaging:</strong> ${data.branded === "branded" ? "Branded" : data.branded === "unbranded" ? "Unbranded" : "Not sure yet"}</li>
          </ul>
          ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
          <p style="margin-top: 30px;">In the meantime, feel free to reply to this email if you have any questions.</p>
          <p>Best,<br>The Ghost Roasting UK Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending wholesale confirmation email:", error);
    throw error;
  }
}

// Send wholesale enquiry notification to admin
export async function sendWholesaleAdminNotification(
  data: WholesaleEnquiryEmailData
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `New wholesale enquiry from ${data.businessName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">New Wholesale Enquiry</h1>
          <h3>Contact Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></li>
            ${data.phone ? `<li><strong>Phone:</strong> ${data.phone}</li>` : ""}
          </ul>
          <h3>Business Details:</h3>
          <ul>
            <li><strong>Business name:</strong> ${data.businessName}</li>
            <li><strong>Type:</strong> ${formatBusinessType(data.businessType)}</li>
          </ul>
          <h3>Order Requirements:</h3>
          <ul>
            <li><strong>Estimated volume:</strong> ${data.estimatedVolume} bags/month</li>
            <li><strong>Bag size preference:</strong> ${data.bagSizePreference}</li>
            <li><strong>Packaging:</strong> ${data.branded === "branded" ? "Branded" : data.branded === "unbranded" ? "Unbranded" : "Not sure yet"}</li>
          </ul>
          ${data.message ? `<h3>Message:</h3><p style="background: #f5f5f5; padding: 15px; border-radius: 8px;">${data.message}</p>` : ""}
          <p style="margin-top: 30px; color: #666;">This enquiry has been saved to Sanity.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending wholesale admin notification:", error);
    throw error;
  }
}

// Send contact form notification to admin
export async function sendContactAdminNotification(data: ContactEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Contact form: ${formatSubject(data.subject)} from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">New Contact Form Message</h1>
          <h3>Contact Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></li>
            <li><strong>Subject:</strong> ${formatSubject(data.subject)}</li>
          </ul>
          <h3>Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${data.message}</p>
          <p style="margin-top: 30px;">
            <a href="mailto:${data.email}?subject=Re: ${formatSubject(data.subject)}"
               style="background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
              Reply to ${data.name}
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending contact admin notification:", error);
    throw error;
  }
}

// ── Ghost Roastery order emails ──

function formatAddress(addr: OrderEmailData["deliveryAddress"]): string {
  if (!addr) return "Not provided";
  return [addr.name, addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
    .filter(Boolean)
    .join(", ");
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  if (!data.customerEmail) return;
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order confirmed — #${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">Thanks for your order, ${data.customerName}!</h1>
          <p>Your order <strong>#${data.orderNumber}</strong> has been confirmed and is being prepared.</p>
          <h3>Order Summary</h3>
          <ul>
            <li><strong>Bag size:</strong> ${data.bagSize}</li>
            <li><strong>Colour:</strong> ${data.bagColour}</li>
            <li><strong>Roast profile:</strong> ${data.roastProfile}</li>
            <li><strong>Grind:</strong> ${data.grind}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
            <li><strong>Total:</strong> £${data.totalPrice.toFixed(2)}</li>
          </ul>
          <p><strong>Delivery to:</strong> ${formatAddress(data.deliveryAddress)}</p>
          <p><strong>Estimated turnaround:</strong> ${data.turnaroundDays}</p>
          <p style="margin-top: 30px;">We'll email you when your order ships. If you have any questions, just reply to this email.</p>
          <p>Best,<br>The Ghost Roasting UK Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    throw error;
  }
}

export async function sendAdminOrderNotification(data: AdminOrderEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.adminEmail,
      subject: `New order #${data.orderNumber} — ${data.quantity}x ${data.bagSize}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">New Order #${data.orderNumber}</h1>
          <h3>Customer</h3>
          <ul>
            <li><strong>Name:</strong> ${data.customerName}</li>
            <li><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></li>
          </ul>
          <h3>Order Details</h3>
          <ul>
            <li><strong>Bag size:</strong> ${data.bagSize}</li>
            <li><strong>Colour:</strong> ${data.bagColour}</li>
            <li><strong>Roast profile:</strong> ${data.roastProfile}</li>
            <li><strong>Grind:</strong> ${data.grind}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
            <li><strong>Price per bag:</strong> £${data.pricePerBag.toFixed(2)}</li>
            <li><strong>Total:</strong> £${data.totalPrice.toFixed(2)}</li>
            ${data.labelFileUrl ? `<li><strong>Label:</strong> <a href="${data.labelFileUrl}">View label</a></li>` : "<li><strong>Label:</strong> Not provided</li>"}
          </ul>
          <p><strong>Delivery to:</strong> ${formatAddress(data.deliveryAddress)}</p>
          <p><strong>Stripe session:</strong> ${data.stripeSessionId}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending admin order notification:", error);
    throw error;
  }
}

export async function sendRoasteryOrderNotification(data: RoasteryOrderEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.roasteryEmail,
      subject: `Roast order #${data.orderNumber} — ${data.quantity}x ${data.bagSize} ${data.roastProfile}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">New Roast Order #${data.orderNumber}</h1>
          <h3>Roast Details</h3>
          <ul>
            <li><strong>Bag size:</strong> ${data.bagSize}</li>
            <li><strong>Roast profile:</strong> ${data.roastProfile}</li>
            <li><strong>Grind:</strong> ${data.grind}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
          </ul>
          <p><strong>Turnaround:</strong> ${data.turnaroundDays}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending roastery order notification:", error);
    throw error;
  }
}

export async function sendGhostRoasterOrderNotification(data: GhostRoasterNotificationData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.roasterEmail,
      subject: `New Ghost Roastery order #${data.orderNumber} assigned to you`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">New Order Assigned</h1>
          <p>Hi ${data.roasterName},</p>
          <p>A new Ghost Roastery order has been assigned to you for fulfilment.</p>
          <h3>Order Details</h3>
          <ul>
            <li><strong>Order:</strong> #${data.orderNumber}</li>
            ${data.brandName ? `<li><strong>Brand:</strong> ${data.brandName}</li>` : ""}
            <li><strong>Bag size:</strong> ${data.bagSize}</li>
            <li><strong>Roast profile:</strong> ${data.roastProfile}</li>
            <li><strong>Grind:</strong> ${data.grind}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
          </ul>
          <p><strong>Dispatch by:</strong> ${data.dispatchDeadline}</p>
          <p style="margin-top: 20px;">
            <a href="${data.portalUrl}"
               style="background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
              View in Portal
            </a>
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending ghost roaster order notification:", error);
    throw error;
  }
}

export async function sendAccountActivationEmail(data: AccountActivationEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: "Your Ghost Roasting account is ready",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">Welcome, ${data.customerName}!</h1>
          <p>We've created an account for you so you can track your orders and manage your labels.</p>
          <p style="margin-top: 20px;">
            <a href="${data.activationLink}"
               style="background: #D97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
              Activate Your Account
            </a>
          </p>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            This link will sign you in automatically. You can then set a password in your account settings.
          </p>
          <p>Best,<br>The Ghost Roasting UK Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending account activation email:", error);
    throw error;
  }
}

export async function sendOrderStatusUpdateEmail(data: OrderStatusUpdateEmailData) {
  if (!data.customerEmail) return;

  const statusMessages: Record<string, string> = {
    "In Production": "Your coffee is now being roasted and prepared.",
    Dispatched: "Your order has been dispatched and is on its way!",
    Delivered: "Your order has been delivered. Enjoy your coffee!",
  };

  const message = statusMessages[data.newStatus] || `Your order status has been updated to: ${data.newStatus}.`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order #${data.orderNumber} — ${data.newStatus}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0D0D0D;">Order Update</h1>
          <p>Hi ${data.customerName},</p>
          <p>${message}</p>
          <h3>Order #${data.orderNumber}</h3>
          <ul>
            <li><strong>Bag size:</strong> ${data.bagSize}</li>
            <li><strong>Roast profile:</strong> ${data.roastProfile}</li>
            <li><strong>Quantity:</strong> ${data.quantity}</li>
            <li><strong>Status:</strong> ${data.newStatus}</li>
          </ul>
          <p>Best,<br>The Ghost Roasting UK Team</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending order status update email:", error);
    throw error;
  }
}
