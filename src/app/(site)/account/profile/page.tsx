import { redirect } from "next/navigation";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

export default function AccountProfilePage() {
  if (PORTAL_URL) {
    redirect(`${PORTAL_URL}/dashboard`);
  }
  redirect("/account");
}
