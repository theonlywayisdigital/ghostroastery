import { redirect } from "next/navigation";
import Link from "next/link";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

export default function AccountPage() {
  if (PORTAL_URL) {
    redirect(`${PORTAL_URL}/my-orders`);
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Account</h1>
      <p className="text-neutral-400 mb-6">
        Your account portal is being set up. In the meantime, you can manage your orders from the build page.
      </p>
      <Link
        href="/build"
        className="px-6 py-3 bg-accent text-neutral-900 font-semibold rounded-lg hover:opacity-90 transition-colors"
      >
        Go to Build
      </Link>
    </div>
  );
}
