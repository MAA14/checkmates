import { supabase } from "@/libs/supabase";
import { sendWhatsAppMessage } from "@/libs/whatsapp";
import { NextRequest, NextResponse } from "next/server";

interface TestResponse {
  success: boolean;
  message: string;
}

/**
 * POST /api/auth/login
 * Handle user login with username and password
 */
export async function GET(request: NextRequest) {
  try {
    const response = await sendWhatsAppMessage(
      "628972630026",
      "Hello from Checkmates API!",
    );
    return NextResponse.json(
      { success: true, message: "Test berhasil", data: response },
      { status: 200 },
    );
  } catch (err) {
    console.error("Test error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat testing" },
      { status: 500 },
    );
  }
}
