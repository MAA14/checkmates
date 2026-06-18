import { supabase } from "@/libs/supabase";
import { getUserFromRequest } from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data?: {
    stats: {
      total: number;
      urgent: number;
      lateAssignments: number;
    };
    tasks: Array<{
      id: string;
      judul: string;
      status: string;
      deadline_at: string;
      total_priority_score: number;
    }>;
  };
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
 * GET /api/dashboard/stats
 * Fetch dashboard statistics and top priority tasks
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<DashboardStatsResponse>> {
  try {
    const { userId } = getUserFromRequest(request);

    if (!userId) {
      console.warn("[dashboard/stats] No userId from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("view_priority_tasks")
      .select("*")
      .not("status", "eq", "selesai")
      .eq("user_id", userId)
      .order("total_priority_score", { ascending: false, nullsFirst: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil data dashboard" },
        { status: 500 },
      );
    }

    const rows = data || [];

    // Calculate statistics
    const total = rows.length;
    const urgent = rows.filter(
      (row) => Number(row.total_priority_score || 0) > 85,
    ).length;
    const lateAssignments = rows.filter((row) => {
      const left = daysLeft(row.deadline_at);
      return left !== null && left < 0;
    }).length;

    // Get top 5 priority tasks
    const topPriorityRows = rows
      .sort(
        (a, b) =>
          Number(b.total_priority_score || 0) -
          Number(a.total_priority_score || 0),
      )
      .slice(0, 5);

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          stats: { total, urgent, lateAssignments },
          tasks: topPriorityRows,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Dashboard stats error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat fetch dashboard" },
      { status: 500 },
    );
  }
}
