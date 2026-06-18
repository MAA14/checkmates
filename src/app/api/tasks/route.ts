import { supabase } from "@/libs/supabase";
import { getUserFromRequest } from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

interface TasksResponse {
  success: boolean;
  message: string;
  data?: Array<Record<string, unknown>>;
}

/**
 * Helper function to calculate days left
 */
function daysLeft(deadline: string): number | null {
  if (!deadline) return null;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to get category
 */
function getCategory(row: Record<string, unknown>): string {
  const status = row.status as string;
  if (status === "selesai") return "selesai";

  const left = daysLeft(row.deadline_at as string);
  if (left !== null && left < 0) return "terlambat";

  return "dalam_proses";
}

/**
 * GET /api/tasks
 * Fetch all tasks with optional filters
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<TasksResponse>> {
  try {
    const { userId } = getUserFromRequest(request);

    if (!userId) {
      console.warn("[tasks] No userId from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    let query = supabase
      .from("view_priority_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("total_priority_score", {
        ascending: false,
        nullsFirst: false,
      });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil data tasks" },
        { status: 500 },
      );
    }

    let filteredData = data || [];

    // Apply status filter
    if (status && status !== "semua") {
      filteredData = filteredData.filter((row) => {
        const cat = getCategory(row);
        if (status === "semua") return cat === "dalam_proses";
        return cat === status;
      });
    }

    // Apply priority filter
    if (priority && priority !== "Semua Prioritas") {
      filteredData = filteredData.filter((row) => {
        const score = Number(row.total_priority_score || 0);
        if (score > 85) return priority === "SANGAT TINGGI";
        if (score > 65) return priority === "TINGGI";
        if (score > 50) return priority === "SEDANG";
        return priority === "RENDAH";
      });
    }

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter((row) =>
        String(row.judul || "")
          .toLowerCase()
          .includes(searchLower),
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Tasks fetched successfully",
        data: filteredData,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Tasks fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat fetch tasks" },
      { status: 500 },
    );
  }
}
