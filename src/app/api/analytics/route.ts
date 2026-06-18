import { supabase } from "@/libs/supabase";
import { getUserFromRequest } from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

interface AnalyticsResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * GET /api/analytics
 * Fetch analytics data for current user
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<AnalyticsResponse>> {
  try {
    const { userId } = getUserFromRequest(request);

    if (!userId) {
      console.warn("[analytics] No userId from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("view_priority_tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil data analytics" },
        { status: 500 },
      );
    }

    const tasks = data || [];

    // Calculate basic statistics
    const scores = tasks
      .map((t) => Number(t.total_priority_score || 0))
      .filter((score) => !isNaN(score));

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "selesai").length;
    const pending = total - completed;

    let mean = 0;
    let median = 0;
    let mode = 0;
    let variance = 0;
    let stdDev = 0;
    let range = 0;
    let maxVal = 0;
    let minVal = 0;

    if (scores.length > 0) {
      // Mean
      mean = scores.reduce((a, b) => a + b, 0) / scores.length;

      // Median
      const sorted = [...scores].sort((a, b) => a - b);
      median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      // Mode
      const frequency: Record<number, number> = {};
      scores.forEach((s) => {
        frequency[s] = (frequency[s] || 0) + 1;
      });
      mode = Number(
        Object.keys(frequency).reduce((a, b) =>
          frequency[Number(a)] > frequency[Number(b)] ? a : b,
        ),
      );

      // Variance and Standard Deviation
      const squaredDifferences = scores.map((s) => Math.pow(s - mean, 2));
      variance = squaredDifferences.reduce((a, b) => a + b, 0) / scores.length;
      stdDev = Math.sqrt(variance);

      // Range, Min, Max
      minVal = Math.min(...scores);
      maxVal = Math.max(...scores);
      range = maxVal - minVal;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Analytics data fetched successfully",
        data: {
          total,
          completed,
          pending,
          completionRate:
            total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
          stats: {
            total_tasks: total,
            mean: Number(mean.toFixed(2)),
            median: Number(median.toFixed(2)),
            modus: Number(mode),
            variance: Number(variance.toFixed(2)),
            std_dev: Number(stdDev.toFixed(2)),
            range_val: range,
            max_val: maxVal,
            min_val: minVal,
          },
          tasks,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Analytics fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat fetch analytics" },
      { status: 500 },
    );
  }
}
