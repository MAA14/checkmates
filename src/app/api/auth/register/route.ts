import { supabase } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/auth/register
 * Handle user registration with username and password
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<RegisterResponse>> {
  try {
    const body: RegisterRequest = await request.json();
    const { username, password, confirmPassword } = body;

    // Validation
    if (!username || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Konfirmasi password tidak sama" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    const fakeEmail = `${username}@checkmates.local`;

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail,
      password,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message || "Registrasi gagal" },
        { status: 400 },
      );
    }

    const user = data.user;
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan setelah registrasi" },
        { status: 500 },
      );
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, username });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return NextResponse.json(
        { success: false, message: "Profile gagal dibuat" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil" },
      { status: 201 },
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat registrasi" },
      { status: 500 },
    );
  }
}
