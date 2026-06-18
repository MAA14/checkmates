import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect authenticated routes
 * Redirects unauthenticated users to login page
 */
export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth-token");
  const { pathname } = request.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ["/dashboard"];

  // Check if the route needs protection
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isProtectedRoute && !authToken) {
    // Redirect to login if no auth token
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
