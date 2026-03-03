import { redirect } from "next/navigation";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (PORTAL_URL) {
    redirect(`${PORTAL_URL}/dashboard`);
  }
  return <>{children}</>;
}
