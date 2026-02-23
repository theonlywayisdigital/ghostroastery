import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ghostroasting.co.uk";
const FROM_EMAIL = "Ghost Roasting UK <noreply@ghostroasting.co.uk>";

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
