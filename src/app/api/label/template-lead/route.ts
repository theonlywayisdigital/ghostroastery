import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name?.trim() || "";

    // Split name into first/last
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Insert into contacts table so leads appear in admin CRM
    const { error: contactError } = await supabase.from("contacts").insert({
      email: trimmedEmail,
      first_name: firstName,
      last_name: lastName,
      source: "form_submission",
      lead_status: "new",
      owner_type: "ghost_roastery",
      contact_type: "lead",
      types: ["lead"],
      status: "active",
      marketing_consent: true,
      tags: ["template-download"],
    });

    if (contactError) {
      console.error("Contact insert error:", contactError);
      return NextResponse.json(
        { error: "Failed to save" },
        { status: 500 }
      );
    }

    // Also keep legacy template_leads record
    await supabase.from("template_leads").insert({
      email: trimmedEmail,
      name: trimmedName || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Template lead error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
