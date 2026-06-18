import { supabase } from "@/libs/supabase";
import { getUserFromRequest } from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: {
    username: string;
    email: string;
  };
}

/**
 * GET /api/auth/profile
 * Fetch current user profile
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<UserProfileResponse>> {
  try {
    // First, try to get user from JWT token in cookies
    const { userId, email: tokenEmail } = getUserFromRequest(request);

    if (!userId) {
      console.warn("[profile] No userId from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch both username and email from profiles table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("username, email")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[profile] Profile query error:", profileError);
      return NextResponse.json(
        { success: false, message: "Gagal mengambil profil user" },
        { status: 500 },
      );
    }

    if (!profileData) {
      console.warn("[profile] No profile data found for userId:", userId);
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile fetched successfully",
        data: {
          username: profileData.username || "User",
          email: profileData.email || tokenEmail || "",
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("[profile] Profile fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat fetch profile" },
      { status: 500 },
    );
  }
}
