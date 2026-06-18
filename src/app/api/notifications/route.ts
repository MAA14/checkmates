import { supabase } from "@/libs/supabase";
import { getUserFromRequest } from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

interface NotificationData {
  id: string;
  type: "overdue" | "urgent" | "soon" | "priority";
  title: string;
  message: string;
  tag: string;
  date: string;
  isNew: boolean;
}

interface NotificationsResponse {
  success: boolean;
  message: string;
  data?: NotificationData[];
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
 * Helper function to get priority class
 */
function getPriorityClass(score: number): string {
  if (score > 85) return "SANGAT TINGGI";
  if (score > 65) return "TINGGI";
  if (score > 50) return "SEDANG";
  return "RENDAH";
}

/**
 * Generate notifications from tasks
 */
function generateNotifications(
  rows: Array<Record<string, unknown>>,
): NotificationData[] {
  const notifs: NotificationData[] = [];

  rows.forEach((row) => {
    const left = daysLeft(row.deadline_at as string);
    const score = Number(row.total_priority_score || 0);
    const pc = getPriorityClass(score);
    const title = row.judul as string;

    if (row.status === "selesai") return;

    if (left !== null && left < 0) {
      notifs.push({
        id: `overdue-${row.id}`,
        type: "overdue",
        title: "Kegiatan Terlambat",
        message: `"${title}" sudah melewati deadline ${Math.abs(left)} hari yang lalu.`,
        tag: "TERLAMBAT",
        date: row.deadline_at as string,
        isNew: Math.abs(left) <= 1,
      });
      return;
    }

    if (left !== null && left <= 1) {
      notifs.push({
        id: `urgent-${row.id}`,
        type: "urgent",
        title: "Deadline Hari Ini!",
        message: `"${title}" harus diselesaikan hari ini. Prioritas: ${pc}.`,
        tag: "MENDESAK",
        date: row.deadline_at as string,
        isNew: true,
      });
      return;
    }

    if (left !== null && left <= 3) {
      notifs.push({
        id: `soon-${row.id}`,
        type: "soon",
        title: "Deadline Mendekat",
        message: `"${title}" akan jatuh tempo dalam ${left} hari.`,
        tag: "SEGERA",
        date: row.deadline_at as string,
        isNew: false,
      });
      return;
    }

    if (score > 74) {
      notifs.push({
        id: `priority-${row.id}`,
        type: "priority",
        title: "Kegiatan Sangat Prioritas",
        message: `"${title}" memiliki skor prioritas tinggi (${score}). Sisa ${left} hari.`,
        tag: "PRIORITAS",
        date: row.created_at as string,
        isNew: false,
      });
    }
  });

  return notifs.sort((a, b) => {
    if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
    const diffTime = new Date(a.date).getTime() - new Date(b.date).getTime();
    return diffTime;
  });
}

/**
 * GET /api/notifications
 * Fetch notifications for current user
 */
export async function GET(
  request: NextRequest,
): Promise<NextResponse<NotificationsResponse>> {
  try {
    const { userId } = getUserFromRequest(request);

    if (!userId) {
      console.warn("[notifications] No userId from token");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { data, error } = await supabase
      .from("view_priority_tasks")
      .select("*")
      .eq("user_id", userId)
      .order("total_priority_score", { ascending: false, nullsFirst: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: "Gagal mengambil notifikasi" },
        { status: 500 },
      );
    }

    const notifications = generateNotifications(data || []);

    return NextResponse.json(
      {
        success: true,
        message: "Notifications fetched successfully",
        data: notifications,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Notifications fetch error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat fetch notifikasi",
      },
      { status: 500 },
    );
  }
}
