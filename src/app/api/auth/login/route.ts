import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user_id: string;
  };
}

/**
 * POST /api/auth/login
 * Handle user login with username and password
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username dan password harus diisi" },
        { status: 400 },
      );
    }

    const fakeEmail = `${username}@checkmates.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil",
        data: { user_id: data.user?.id },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat login" },
      { status: 500 },
    );
  }
}
