import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { wholesaleEnquirySchema } from "@/lib/validation";
import {
  sendWholesaleConfirmationEmail,
  sendWholesaleAdminNotification,
} from "@/lib/resend";

// Create a write client for mutations
const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    const validatedData = wholesaleEnquirySchema.parse(body);

    // Save to Sanity
    const sanityDoc = await writeClient.create({
      _type: "wholesaleEnquiry",
      name: validatedData.name,
      businessName: validatedData.businessName,
      businessType: validatedData.businessType,
      email: validatedData.email,
      phone: validatedData.phone || "",
      estimatedVolume: validatedData.estimatedVolume,
      bagSizePreference: validatedData.bagSizePreference,
      branded: validatedData.branded === "branded",
      message: validatedData.message || "",
      status: "new",
      submittedAt: new Date().toISOString(),
    });

    // Send emails (don't fail the request if emails fail)
    try {
      await Promise.all([
        sendWholesaleConfirmationEmail(validatedData),
        sendWholesaleAdminNotification(validatedData),
      ]);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Continue - the enquiry is saved, emails are nice-to-have
    }

    return NextResponse.json({
      success: true,
      id: sanityDoc._id,
    });
  } catch (error) {
    console.error("Wholesale enquiry error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid form data", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 }
    );
  }
}
