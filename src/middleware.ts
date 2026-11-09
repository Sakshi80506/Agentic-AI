import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const projectId = process.env.NEXT_PUBLIC_DESCOPE_PROJECT_ID;

  // If Descope Project ID is not yet configured, allow navigation to setup instructions
  if (!projectId) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Public paths that do not require authentication
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check for Descope session cookies (DS, __session, or descope-session)
  const sessionToken =
    req.cookies.get("DS")?.value ||
    req.cookies.get("__session")?.value ||
    req.cookies.get("descope-session")?.value;

  // If unauthenticated, redirect to login page
  if (!sessionToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
