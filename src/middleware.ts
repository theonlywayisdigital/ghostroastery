import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
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

  // Detect roasters subdomain
  const isRoasters =
    hostname.startsWith("roasters.") ||
    hostname.startsWith("roasters.localhost");

  if (isRoasters) {
    // Don't double-rewrite if already on roasters path
    if (pathname.startsWith("/roasters")) {
      return NextResponse.next();
    }
    // Rewrite roasters subdomain requests to /roasters/* routes
    const url = request.nextUrl.clone();
    url.pathname = `/roasters${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Block direct access to /roasters/* on the main domain
  if (pathname.startsWith("/roasters")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
