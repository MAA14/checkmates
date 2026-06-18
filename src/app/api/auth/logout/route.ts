import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";

interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/auth/logout
 * Handle user logout
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<LogoutResponse>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json(
        { success: false, message: "Logout gagal" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Logout berhasil" },
      { status: 200 },
    );
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat logout" },
      { status: 500 },
    );
  }
}
