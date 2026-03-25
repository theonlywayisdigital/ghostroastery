import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip internal paths (Next.js internals, API, studio, static files)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/studio") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Redirect old /roasters/* paths to the new roasters site
  if (pathname.startsWith("/roasters")) {
    return NextResponse.redirect(
      new URL(
        pathname.replace("/roasters", "") || "/",
        "https://roasteryplatform.com"
      ),
      301
    );
  }

  // Redirect roasters subdomain visitors to the new domain
  const hostname = request.headers.get("host") || "";
  if (
    hostname.startsWith("roasters.") ||
    hostname.startsWith("roasters.localhost")
  ) {
    return NextResponse.redirect(
      new URL(pathname, "https://roasteryplatform.com"),
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
