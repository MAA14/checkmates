import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Extract user information from JWT token stored in cookies
 * This is used for server-side authentication checks
 *
 * Tries multiple cookie names that Supabase uses:
 * - sb-auth-token: Main Supabase auth token
 * - sb-session: Session cookie
 * - auth-token: Fallback token name
 */
export function getUserFromRequest(request: NextRequest): {
  userId: string | null;
  email: string | null;
} {
  try {
    // Try to get the auth token from various cookie names that Supabase uses
    const token =
      request.cookies.get("sb-auth-token")?.value ||
      request.cookies.get("sb-session")?.value ||
      request.cookies.get("auth-token")?.value;

    if (!token) {
      console.warn("[serverAuth] No auth token found in cookies");
      return { userId: null, email: null };
    }

    // Decode the JWT token to extract user information
    const decoded: any = jwtDecode(token);

    if (!decoded || !decoded.sub) {
      console.warn("[serverAuth] Invalid token structure - missing sub claim");
      return { userId: null, email: null };
    }

    return {
      userId: decoded.sub,
      email: decoded.email || null,
    };
  } catch (error) {
    console.error("[serverAuth] Error decoding token:", error);
    return { userId: null, email: null };
  }
}
